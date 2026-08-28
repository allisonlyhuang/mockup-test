import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Notification from './components/Notification';
import Sidebar from './components/Sidebar';
import Hero from './pages/Hero';
import AboutUs from './pages/AboutUs';
import Mission from './pages/Mission';
import Values from './pages/Values';
import Projects from './pages/Projects';
import BuildWithUs from './pages/BuildWithUs';
import Apply from './pages/Apply';
import PageTransition from './components/PageTransition';
import UnsupportedScreen from './components/UnsupportedScreen';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function useIsNarrow(breakpoint = 1400) {
  const [narrow, setNarrow] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setNarrow(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return narrow;
}

function MainSite({ lenisRef }) {
  return (
    <div style={styles.root}>
      <Sidebar lenis={lenisRef.current} />
      <main style={styles.main}>
        <Hero />
        <AboutUs />
        <Mission />
        <Values />
        <Projects />
        <BuildWithUs />
      </main>
    </div>
  );
}

function GlobalNotification({ lenisRef }) {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return (
    <div style={styles.notification}>
      <Notification onApply={() => { lenisRef.current?.destroy(); navigate('/apply'); }} />
    </div>
  );
}

export default function App() {
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        setLenis(null);
      }
      return;
    }

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    const rafCb = (time) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(rafCb);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(rafCb);
      lenisRef.current = null;
      setLenis(null);
    };
  }, [location.pathname]);

  const narrow = useIsNarrow();

  if (narrow) return <UnsupportedScreen />;

  return (
    <>
      <GlobalNotification lenisRef={lenisRef} />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><MainSite lenisRef={lenisRef} /></PageTransition>} />
        <Route path="/apply" element={<PageTransition><Apply /></PageTransition>} />
      </Routes>
    </>
  );
}

const styles = {
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    minHeight: '100vh',
  },
  notification: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 1000,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
};

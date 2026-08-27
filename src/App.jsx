import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

gsap.registerPlugin(ScrollTrigger, useGSAP);

function MainSite({ lenis }) {
  return (
    <div style={styles.root}>
      <div style={styles.notification}>
        <Notification />
      </div>
      <Sidebar lenis={lenis} />
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

export default function App() {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    setLenis(lenisInstance);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(lenisInstance.raf);
    };
  }, []);

  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><MainSite lenis={lenis} /></PageTransition>} />
      <Route path="/apply" element={<PageTransition><Apply /></PageTransition>} />
    </Routes>
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

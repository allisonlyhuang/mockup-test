import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Sidebar from './components/Sidebar';
import Hero from './pages/Hero';
import AboutUs from './pages/AboutUs';
import Projects from './pages/Projects';
import JoinUs from './pages/JoinUs';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const containerRef = useRef(null);
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

  return (
    <div ref={containerRef} style={styles.root}>
      <Sidebar lenis={lenis} />
      <main style={styles.main}>
        <Hero />
        <AboutUs />
        <Projects />
        <JoinUs />
      </main>
    </div>
  );
}

const styles = {
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
};

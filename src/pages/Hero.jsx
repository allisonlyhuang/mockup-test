import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './Hero.css';

gsap.registerPlugin(ScrollToPlugin);
import arrowUrl from '../assets/hero/arrow.svg';
import emailTooltipUrl from '../assets/hero/email_tooltip.svg';
import RobloxPosts from '../components/RobloxPosts';
import FaceWithEyes from '../components/FaceWithEyes';

export default function Hero() {
  const chevronRef = useRef(null);

  // ── Chevron bounce loop ───────────────────────────────────────────────────
  useGSAP(() => {
    gsap.to(chevronRef.current, {
      y: 5,
      duration: 0.7,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, { scope: chevronRef });

  const scrollToSeasonalProgram = () => {
    const target = document.getElementById('seasonal-program');
    if (!target) return;
    gsap.to(window, {
      scrollTo: { y: target, offsetY: 0 },
      duration: 2,
      ease: 'power2.inOut',
    });
  };

  return (
    <>
      <section id="hero" className="hero-section" aria-label="Hero">
        <div className="hero-main-row">
        <div className="hero-lockup">

          {/* Email tooltip */}
          <img
            src={emailTooltipUrl}
            alt="email tooltip"
            className="hero-email-tooltip hero-animate"
            draggable="false"
            style={{ cursor: 'pointer' }}
            onClick={() => navigator.clipboard.writeText('design+mockup@uci.edu').then(() => alert('Copied: design+mockup@uci.edu'))}
          />

          {/* "Welcome to" label */}
          <p className="hero-welcome hero-animate" aria-hidden="true">Welcome to</p>

          {/* Logo row */}
          <div className="hero-logo-row" role="img" aria-label="mockup logo">

            {/* "m" */}
            <span className="hero-letter hero-letter-m hero-animate" aria-hidden="true">m</span>

            {/* face replaces "o" — FaceWithEyes component */}
            <div className="hero-face-wrap hero-animate">
              <FaceWithEyes size={222} />
            </div>

            {/* "ckup" */}
            <span className="hero-letter hero-letter-ckup hero-animate" aria-hidden="true">ckup</span>

            {/* arrow accent */}
            <img
              src={arrowUrl}
              alt="up-right arrow"
              className="hero-arrow hero-animate"
              draggable="false"
            />
          </div>

          {/* Subtitle */}
          <a
            href="https://designatuci.com"
            className="hero-subtitle hero-animate"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Design at UCI website"
          >
            by [design at uci]
          </a>

          {/* Tagline */}
          <p className="hero-tagline hero-animate">
            where ideas meet <span className="hero-tagline-highlight">creators</span>
          </p>

        </div>

        </div>

        {/* Posts — absolutely positioned, no layout impact */}
        <div className="hero-posts">
          <RobloxPosts onClick={scrollToSeasonalProgram} />
        </div>

        {/* Body text */}
        <p className="hero-body">
          Connecting student UI/UX designers with real clients, impactful projects, and career-defining experience.</p>

        <p className="hero-body" style={{ whiteSpace: 'nowrap', margin: '0 0 0.75rem' }}>From portfolios to partnerships. Opportunities open Fall and Spring.</p>

        <button className="hero-learn-more" onClick={scrollToSeasonalProgram}>
          <span className="hero-learn-more-label">Learn More</span>
          <ChevronDown ref={chevronRef} className="hero-learn-more-chevron" size={20} strokeWidth={1.5} />
        </button>
      </section>
    </>
  );
}

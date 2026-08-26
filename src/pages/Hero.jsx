import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);
import faceUrl from '../assets/hero/face_no_eyes.svg';
import arrowUrl from '../assets/hero/arrow.svg';
import emailTooltipUrl from '../assets/hero/email_tooltip.svg';
import RobloxPosts from '../components/RobloxPosts';

const LEFT_EYE  = { x: 46.2, y: 39.1 }; // % from top-left
const RIGHT_EYE = { x: 71.8, y: 28.7 };
const EYE_SIZE  = 8.7; // % of face width (≈ r:9 / 208 * 2)
const MAX_TRAVEL = 50; // % — how far pupils drift on cursor move

export default function Hero() {
  const faceWrapRef = useRef(null);
  const leftEyeRef  = useRef(null);
  const rightEyeRef = useRef(null);
  const chevronRef  = useRef(null);

  // ── Cursor tracking ───────────────────────────────────────────────────────
  useEffect(() => {
    const qlx_l = gsap.quickTo(leftEyeRef.current,  'xPercent', { duration: 0.35, ease: 'power2.out' });
    const qly_l = gsap.quickTo(leftEyeRef.current,  'yPercent', { duration: 0.35, ease: 'power2.out' });
    const qlx_r = gsap.quickTo(rightEyeRef.current, 'xPercent', { duration: 0.35, ease: 'power2.out' });
    const qly_r = gsap.quickTo(rightEyeRef.current, 'yPercent', { duration: 0.35, ease: 'power2.out' });

    const onMove = (e) => {
      const wrap = faceWrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      // normalised –1 → +1 relative to face centre
      const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
      const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx  = len > 1 ? dx / len : dx;
      const ny  = len > 1 ? dy / len : dy;
      qlx_l(nx * MAX_TRAVEL); qly_l(ny * MAX_TRAVEL);
      qlx_r(nx * MAX_TRAVEL); qly_r(ny * MAX_TRAVEL);
    };

    const onLeave = () => {
      qlx_l(0); qly_l(0);
      qlx_r(0); qly_r(0);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // ── Blink loop ────────────────────────────────────────────────────────────
  useGSAP(() => {
    const eyes = [leftEyeRef.current, rightEyeRef.current];
    const blink = () => {
      gsap.timeline({ onComplete: () => gsap.delayedCall(gsap.utils.random(2, 5), blink) })
        .to(eyes, { scaleY: 0.08, transformOrigin: '50% 50%', duration: 0.06, ease: 'power2.in' })
        .to(eyes, { scaleY: 1,    transformOrigin: '50% 50%', duration: 0.1,  ease: 'power2.out' });
    };
    gsap.delayedCall(1.5, blink);
  }, { scope: faceWrapRef });

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

  return (
    <>
      {/* Fustat from Google Fonts — load once at component level via <style> injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fustat:wght@800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

        /* ── Entrance keyframe ── */
        @keyframes hero-rise {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Face-rise also cancels its vertical offset ── */
        @keyframes hero-rise-face {
          from {
            opacity: 0;
            transform: translateY(calc(clamp(-4px, -0.8vw, -12px) + 18px));
          }
          to {
            opacity: 1;
            transform: translateY(clamp(-4px, -0.8vw, -12px));
          }
        }

        /* ── Arrow slides in from the right ── */
        @keyframes hero-slide-right {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* shared animation base */
        .hero-animate {
          opacity: 0;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-duration: 0.7s;
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: clamp(2rem, 8vw, 6rem) clamp(1.5rem, 8vw, 7rem);
        }

        .hero-main-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          gap: 0rem;
        }

        .hero-right {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -20%;
          margin-top: -20%;
        }

        /* ── Wrapper ── */
        .hero-lockup {
          margin-top: -21rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
          user-select: none;
          -webkit-user-select: none;
          transform: scale(0.6);
          transform-origin: left center;
        }

        .hero-lockup * {
          user-select: none;
          -webkit-user-select: none;
        }

        /* ── Main logo row: m + face + ckup + arrow ── */
        .hero-logo-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0;
          line-height: 0.88;
          margin-left: -0.75rem;
          cursor: url('/cursor_with_year.svg') 5 5, auto;
          user-select: none;
        }

        /* Shared text style for "m" and "ckup" */
        .hero-letter {
          font-family: 'Fustat', system-ui, sans-serif;
          font-size: clamp(80px, 20vw, 309px);
          font-weight: 800;
          color: #000000;
          letter-spacing: -0.1em;
          line-height: 0.88;
          display: inline-block;
        }

        /* "m" — pull face slightly left */
        .hero-letter-m {
          margin-right: -0.03em;
          animation-name: hero-rise;
          animation-delay: 0.1s;
        }

        /* ── Face wrapper (positions the overlay eyes) ── */
        .hero-face-wrap {
          position: relative;
          z-index: 1;
          height: clamp(55px, 14.4vw, 222px);
          width:  clamp(55px, 14.4vw, 222px);
          display: inline-block;
          flex-shrink: 0;
          transform: translateY(clamp(-4px, -0.8vw, -12px));
          margin-left:  0;
          margin-right: 0;
          animation-name: hero-rise-face;
          animation-delay: 0.2s;
        }

        .hero-face-o {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* ── Overlay eyes ── */
        .hero-eye {
          position: absolute;
          width:  8.7%;
          height: 8.7%;
          background: black;
          border-radius: 50%;
          pointer-events: none;
          /* translate(-50%,-50%) centres the div on its anchor point */
          transform: translate(-50%, -50%);
        }

        /* Pull "ckup" left to cancel the trailing letter-spacing gap left by the face */
        .hero-letter-ckup {
          margin-left: -0.12em;
          animation-name: hero-rise;
          animation-delay: 0.3s;
        }

        /* ── Arrow accent ── */
        .hero-arrow {
          height: clamp(60px, 12vw, 180px);
          width:  auto;
          display: inline-block;
          flex-shrink: 0;
          margin-left: clamp(4px, 1vw, 16px);
          align-self: center;
          margin-bottom: clamp(2px, 0.4vw, 8px);
          animation-name: hero-slide-right;
          animation-delay: 0.5s;
        }

        /* ── Email tooltip ── */
        .hero-email-tooltip {
          height: auto;
          width: clamp(350px, 50vw, 700px);
          margin-bottom: 0.5em;
          animation-name: hero-rise;
          animation-delay: 0s;
        }

        /* ── "Welcome to" label ── */
        .hero-welcome {
          margin: 0 0 -0.5em 0.1em;
          color: var(--Black-8, rgba(0, 0, 0, 0.80));
          font-family: Inter, system-ui, sans-serif;
          font-size: 32px;
          font-style: normal;
          font-weight: 400;
          line-height: 17.036px;
          letter-spacing: 0.11px;
          animation-name: hero-rise;
          animation-delay: 0.05s;
        }

        /* ── "by design at uci" ── */
        .hero-subtitle {
          font-family: 'Fustat', system-ui, sans-serif;
          font-size: 67.931px;
          font-style: normal;
          font-weight: 800;
          color: #0D9AFF;
          letter-spacing: 1.359px;
          line-height: normal;
          margin: clamp(-1rem, -2vw, 0.5rem) 0 0;
          animation-name: hero-rise;
          animation-delay: 0.45s;
        }

        /* ── "when ideas meet creators" ── */
        .hero-tagline {
          font-size: 68px;
          font-style: normal;
          font-weight: 300;
          color: #000000;
          letter-spacing: 1.359px;
          line-height: 1;
          margin: 1em 0 0;
          animation-name: hero-rise;
          animation-delay: 0.55s;
          display: flex;
          align-items: center;
          gap: 0.15em;
        }

        .hero-body {
          font-family: Inter, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.80);
          line-height: 1.6;
          margin-top: -4rem;
        }

        /* ── Learn More button ── */
        .hero-learn-more {
          position: absolute;
          bottom: 15rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          user-select: none;
        }

        .hero-learn-more-label {
          font-size: 12px;
          font-weight: 300;
          color: #2e2e2e;
          letter-spacing: 0.01em;
        }

        .hero-learn-more-chevron {
          font-size: 20px;
          color: #2e2e2e;
          line-height: 1;
          margin-top: -0.09em;
        }

        .hero-tagline-highlight {
          color: #ffffff;
          background: #000000;
          padding: 0 0.15em;
          border-radius: 2px;
          display: inline-flex;
          align-items: center;
          font-weight: 400;
          line-height: 1;
          height: 1em;
        }
      `}</style>

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
            onClick={() => navigator.clipboard.writeText('mockup@dauci.com').then(() => alert('Copied: mockup@dauci.com'))}
          />

          {/* "Welcome to" label */}
          <p className="hero-welcome hero-animate" aria-hidden="true">Welcome to</p>

          {/* Logo row */}
          <div className="hero-logo-row" role="img" aria-label="mockup logo">

            {/* "m" */}
            <span className="hero-letter hero-letter-m hero-animate" aria-hidden="true">m</span>

            {/* face replaces "o" — wrapper holds overlay eyes */}
            <div className="hero-face-wrap hero-animate" ref={faceWrapRef}>
              <img
                src={faceUrl}
                alt="face, representing the letter o"
                className="hero-face-o"
                draggable="false"
              />
              {/* Left eye overlay */}
              <div
                ref={leftEyeRef}
                className="hero-eye"
                style={{ left: `${LEFT_EYE.x}%`, top: `${LEFT_EYE.y}%` }}
              />
              {/* Right eye overlay */}
              <div
                ref={rightEyeRef}
                className="hero-eye"
                style={{ left: `${RIGHT_EYE.x}%`, top: `${RIGHT_EYE.y}%` }}
              />
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
          <p className="hero-subtitle hero-animate">by [design at uci]</p>

          {/* Tagline */}
          <p className="hero-tagline hero-animate">
            where ideas meet <span className="hero-tagline-highlight">creators</span>
          </p>

        </div>

        {/* Right side */}
        <div className="hero-right">
          <RobloxPosts />
        </div>
        </div>
        {/* end hero-main-row */}

        {/* Body text */}
        <p className="hero-body">From portfolios to partnerships.<br />
          Connecting student UI/UX designers with real clients, impactful projects, and career-defining experience.</p>

        <button className="hero-learn-more" onClick={() => {
          const target = document.getElementById('about-us');
          if (!target) return;
          gsap.to(window, {
            scrollTo: { y: target, offsetY: 0 },
            duration: 2,
            ease: 'power2.inOut',
          });
        }}>
          <span className="hero-learn-more-label">Learn More</span>
          <span className="hero-learn-more-chevron" ref={chevronRef}>&#8964;</span>
        </button>
      </section>
    </>
  );
}

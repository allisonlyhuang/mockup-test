import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import faceUrl from '../assets/face_no_eyes.svg';
import arrowUrl from '../assets/arrow.svg';
import './Hero.css';

const LEFT_EYE  = { x: 46.2, y: 39.1 }; // % from top-left
const RIGHT_EYE = { x: 71.8, y: 28.7 };
const EYE_SIZE  = 8.7; // % of face width (≈ r:9 / 208 * 2)
const MAX_TRAVEL = 50; // % — how far pupils drift on cursor move

export default function Hero() {
  const faceWrapRef = useRef(null);
  const leftEyeRef  = useRef(null);
  const rightEyeRef = useRef(null);

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

  return (
    <section id="hero" className="hero-section" aria-label="Hero">
        <div className="hero-lockup">

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
          <p className="hero-subtitle hero-animate">by design at uci</p>

        </div>

        <p>From portfolios to partnerships.<br></br>
          Connecting student UI/UX designers with real clients, impactful projects, and career-defining experience.</p>
      </section>
  );
}

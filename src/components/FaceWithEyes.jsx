import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import faceUrl from '../assets/face_no_eyes.svg';

const LEFT_EYE   = { x: 46.2, y: 39.1 }; // % from top-left of face
const RIGHT_EYE  = { x: 71.8, y: 28.7 };
const MAX_TRAVEL = 50; // % — how far pupils drift on cursor move

export default function FaceWithEyes({ size = 222, blinkDelay = 1.5 }) {
  const faceWrapRef  = useRef(null);
  const leftEyeRef   = useRef(null);
  const rightEyeRef  = useRef(null);

  // ── Cursor tracking ─────────────────────────────────────────────────────────
  useEffect(() => {
    const qlx_l = gsap.quickTo(leftEyeRef.current,  'xPercent', { duration: 0.35, ease: 'power2.out' });
    const qly_l = gsap.quickTo(leftEyeRef.current,  'yPercent', { duration: 0.35, ease: 'power2.out' });
    const qlx_r = gsap.quickTo(rightEyeRef.current, 'xPercent', { duration: 0.35, ease: 'power2.out' });
    const qly_r = gsap.quickTo(rightEyeRef.current, 'yPercent', { duration: 0.35, ease: 'power2.out' });

    const onMove = (e) => {
      const wrap = faceWrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
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

  // ── Blink loop ───────────────────────────────────────────────────────────────
  useGSAP(() => {
    const eyes = [leftEyeRef.current, rightEyeRef.current];
    const blink = () => {
      gsap.timeline({ onComplete: () => gsap.delayedCall(gsap.utils.random(2, 5), blink) })
        .to(eyes, { scaleY: 0.08, transformOrigin: '50% 50%', duration: 0.06, ease: 'power2.in' })
        .to(eyes, { scaleY: 1,    transformOrigin: '50% 50%', duration: 0.1,  ease: 'power2.out' });
    };
    gsap.delayedCall(blinkDelay, blink);
  }, { scope: faceWrapRef });

  return (
    <div ref={faceWrapRef} style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <img src={faceUrl} alt="face" style={{ width: '100%', height: '100%', display: 'block' }} draggable="false" />
      {/* Left eye */}
      <div ref={leftEyeRef} style={{
        position: 'absolute', width: '8.7%', height: '8.7%',
        background: 'black', borderRadius: '50%', pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        left: `${LEFT_EYE.x}%`, top: `${LEFT_EYE.y}%`,
      }} />
      {/* Right eye */}
      <div ref={rightEyeRef} style={{
        position: 'absolute', width: '8.7%', height: '8.7%',
        background: 'black', borderRadius: '50%', pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        left: `${RIGHT_EYE.x}%`, top: `${RIGHT_EYE.y}%`,
      }} />
    </div>
  );
}

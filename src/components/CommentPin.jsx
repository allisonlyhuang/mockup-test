import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CommentPin({
  style,
  author = 'Allison Huang',
  timestamp = 'Founder',
  comment = "What happens if we adjust this to handle a light and dark mode? I'm not sure if we're ready to handle...",
  avatarInitial = author[0],
  avatarColor = '#0770bb',
  entranceDelay = 0,
}) {
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef(null);
  const shapeRef = useRef(null);
  const pinRef = useRef(null);
  const bubbleRef = useRef(null);
  const measureRef = useRef(null);
  const tlRef = useRef(null);

  // Collapsed dimensions
  const PIN_W = 44;
  const PIN_H = 44;
  const PIN_R = '100% 100% 100% 5%';

  // Expanded dimensions
  const BUB_W = 300;
  const BUB_R = '14px 14px 14px 2px';

  useLayoutEffect(() => {
    const shape = shapeRef.current;
    const pin = pinRef.current;
    const bubble = bubbleRef.current;
    const root = rootRef.current;
    if (!shape || !pin || !bubble || !root) return;

    // Set initial collapsed state — hidden until scroll entrance
    gsap.set(root, { opacity: 0, scale: 0.4, transformOrigin: 'bottom left' });
    gsap.set(shape, { width: PIN_W, height: PIN_H, borderRadius: PIN_R });
    gsap.set(pin, { opacity: 1, scale: 1 });
    gsap.set(bubble, { opacity: 0, display: 'none' });

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(root, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          delay: entranceDelay,
          ease: 'back.out(1.8)',
        });
      },
    });

    return () => st.kill();
  }, []);

  useEffect(() => {
    const shape = shapeRef.current;
    const pin = pinRef.current;
    const bubble = bubbleRef.current;
    if (!shape || !pin || !bubble) return;

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    if (hovered) {
      const BUB_H = measureRef.current ? measureRef.current.scrollHeight : 110;
      tl.set(bubble, { display: 'flex' })
        .to(shape, { width: BUB_W, height: BUB_H, borderRadius: BUB_R, duration: 0.18, ease: 'power3.inOut' }, 0)
        .to(pin, { opacity: 0, scale: 0.6, duration: 0.08, ease: 'power2.in' }, 0)
        .to(bubble, { opacity: 1, duration: 0.1, ease: 'power2.out' }, 0.12);
    } else {
      tl.to(bubble, { opacity: 0, duration: 0.08, ease: 'power2.in' }, 0)
        .to(shape, { width: PIN_W, height: PIN_H, borderRadius: PIN_R, duration: 0.15, ease: 'power3.inOut' }, 0.05)
        .to(pin, { opacity: 1, scale: 1, duration: 0.1, ease: 'back.out(2)' }, 0.14)
        .set(bubble, { display: 'none' });
    }

    return () => tl.kill();
  }, [hovered]);

  return (
    <div
      ref={rootRef}
      style={{ position: 'absolute', display: 'inline-block', ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hidden measurement div — mirrors bubble exactly to compute natural height */}
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: BUB_W,
          padding: '16px 18px 12px',
          boxSizing: 'border-box',
          display: 'flex',
          gap: 10,
        }}
      >
        <div style={{ width: 28, flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, fontFamily: 'Inter, system-ui, sans-serif' }}>{author}</span>
            <span style={{ fontSize: 11, lineHeight: 1.3, fontFamily: 'Inter, system-ui, sans-serif' }}>{timestamp}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, fontFamily: 'Inter, system-ui, sans-serif' }}>
            {comment}
          </p>
        </div>
      </div>

      {/* Anchor wrapper — fixes bottom-left corner in place */}
      <div style={{ position: 'relative', width: PIN_W, height: PIN_H }}>
      <div
        ref={shapeRef}
        style={{
          background: '#2c2c2e',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          position: 'absolute',
          bottom: 0,
          left: 0,
          cursor: 'pointer',
          width: PIN_W,
          height: PIN_H,
        }}
      >
        {/* Collapsed pin content */}
        <div
          ref={pinRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif',
            flexShrink: 0,
          }}>
            {avatarInitial}
          </div>
        </div>

        {/* Expanded bubble content */}
        <div
          ref={bubbleRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'none',
            flexDirection: 'column',
            padding: '16px 18px 12px',
            gap: 6,
            opacity: 0,
          }}
        >
          {/* Avatar + right column */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            {/* Avatar */}
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              {avatarInitial}
            </div>
            {/* Right column: name+timestamp, then comment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif', lineHeight: 1.3 }}>
                  {author}
                </span>
                <span style={{ fontSize: 11, color: '#8e8e93', fontFamily: 'Inter, system-ui, sans-serif', lineHeight: 1.3 }}>
                  {timestamp}
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.5,
                color: '#f0f0f0',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}>
                {comment}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

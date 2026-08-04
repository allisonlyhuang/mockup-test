import { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(ScrollTrigger, Flip, Draggable);

// ─── Card data ────────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'picnic',
    title: 'PICNIC',
    glyph: 'p',
    font: '"Georgia", serif',
    bg: '#ffffff',
    border: '#cde7ff',
    glyphColor: '#0d99ff',
    textColor: '#0d70cc',
    description: 'An outdoor design experience blending nature and creativity into a seamless gathering.',
  },
  {
    id: 'tataki',
    title: 'TATAKI',
    glyph: 't',
    font: '"Palatino Linotype", "Palatino", serif',
    bg: '#cde7ff',
    border: '#9bceff',
    glyphColor: '#0d99ff',
    textColor: '#0860b8',
    description: 'A refined typographic study exploring the intersection of motion and stillness.',
  },
  {
    id: 'instrument',
    title: 'INSTRUMENT',
    glyph: 'i',
    font: '"Times New Roman", serif',
    bg: '#9bceff',
    border: '#64b4ff',
    glyphColor: '#ffffff',
    textColor: '#ffffff',
    description: 'Sound-driven visual systems that translate rhythm into form and space.',
  },
  {
    id: 'bricolage',
    title: 'BRICOLAGE',
    glyph: 'b',
    font: '"Garamond", "EB Garamond", serif',
    bg: '#64b4ff',
    border: '#0d99ff',
    glyphColor: '#ffffff',
    textColor: '#ffffff',
    description: 'Assembled from fragments — a design philosophy rooted in making do and making more.',
  },
  {
    id: 'lemurmure',
    title: 'LE MURMURE',
    glyph: 'l',
    font: '"Didot", "Bodoni MT", serif',
    bg: '#0d99ff',
    border: '#0077dd',
    glyphColor: 'rgba(255,255,255,0.18)',
    textColor: '#ffffff',
    description: 'A quiet, intimate visual language that whispers rather than shouts.',
  },
];

// Fan parameters: rotation and translation per card (index 0 = leftmost/back)
const FAN = [
  { rotate: -14, tx: -90, ty: 30 },
  { rotate:  -7, tx: -45, ty: 12 },
  { rotate:   0, tx:   0, ty:  0 },
  { rotate:   7, tx:  45, ty: 12 },
  { rotate:  14, tx:  90, ty: 30 },
];

// ─── Individual Card ──────────────────────────────────────────────────────────
function Card({ data, fanIndex, cardRef, onClick, dragging }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      data-card-id={data.id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: 'absolute',
        width: 180,
        height: 240,
        borderRadius: 14,
        background: data.bg,
        border: `1px solid ${data.border}`,
        boxShadow: hovered || dragging
          ? '0 22px 52px rgba(13,153,255,0.26), 0 6px 16px rgba(0,0,0,0.14)'
          : '0 8px 28px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.07)',
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        overflow: 'hidden',
        boxSizing: 'border-box',
        transformOrigin: 'center bottom',
        transition: 'box-shadow 0.25s ease',
        zIndex: fanIndex + 1,
        top: '50%',
        left: '50%',
      }}
    >
      {/* Watermark glyph */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: data.font,
          fontSize: 190,
          lineHeight: 1,
          color: data.glyphColor,
          filter: 'blur(7px)',
          opacity: 0.5,
          userSelect: 'none',
          marginTop: 24,
        }}>
          {data.glyph}
        </span>
      </div>

      {/* Top-right label */}
      <span style={{
        position: 'absolute',
        top: 12,
        right: 12,
        fontFamily: 'inherit',
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.13em',
        color: data.textColor,
        opacity: 0.8,
      }}>
        {data.title}
      </span>

      {/* Bottom-left label */}
      <span style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        fontFamily: 'inherit',
        fontSize: 7,
        fontWeight: 600,
        letterSpacing: '0.10em',
        color: data.textColor,
        opacity: 0.5,
      }}>
        {data.title}
      </span>

      {/* Expanded content — faded in by GSAP after Flip completes */}
      <div
        className={`card-extra card-extra-${data.id}`}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '28px 22px 28px',
          opacity: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,0.08) 0%, transparent 60%)',
        }}
      >
        <p style={{
          fontFamily: 'inherit',
          fontSize: 13,
          lineHeight: 1.65,
          color: data.textColor,
          margin: 0,
          opacity: 0.9,
        }}>
          {data.description}
        </p>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ProjectScope() {
  const sectionRef    = useRef(null);
  const stageRef      = useRef(null);
  const overlayRef    = useRef(null);
  const cardRefs      = useRef([]);
  const draggableRefs = useRef([]);          // Draggable instances
  const expandedId    = useRef(null);
  const busy          = useRef(false);
  const [draggingIdx, setDraggingIdx] = useState(null);

  // ── Scroll-triggered reveal ────────────────────────────────────────────────
  useGSAP(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    // Apply fan transforms via GSAP — keeps React inline styles from fighting these
    cards.forEach((el, i) => {
      const fan = FAN[i];
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: fan.tx,
        y: fan.ty,
        rotation: fan.rotate,
      });
    });

    // Start hidden
    gsap.set(cards, { scale: 0.85, filter: 'blur(6px)', autoAlpha: 0 });

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        toggleActions: 'play reverse none none',
      },
    }).to(cards, {
      scale: 1,
      filter: 'blur(0px)',
      autoAlpha: 1,
      duration: 0.6,
      ease: 'power3.out',
      stagger: { each: 0.10, from: 'start' },
    });
  });

  // ── Draggable setup ────────────────────────────────────────────────────────
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    draggableRefs.current = cards.map((el, i) => {
      const fan = FAN[i];
      let didDrag = false;
      let dragStartX = 0, dragStartY = 0;

      const [instance] = Draggable.create(el, {
        type: 'x,y',
        onPress() {
          // Block dragging this specific card if it's the expanded one
          if (expandedId.current === el.dataset.cardId) return;
          didDrag = false;
          dragStartX = this.x;
          dragStartY = this.y;
          gsap.to(el, { scale: 1.06, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
          gsap.set(el, { zIndex: 30 });
          setDraggingIdx(i);
        },
        onDrag() {
          if (Math.abs(this.x - dragStartX) > 4 || Math.abs(this.y - dragStartY) > 4) {
            didDrag = true;
          }
          // Tilt with drag direction
          const tilt = gsap.utils.clamp(-18, 18, this.deltaX * 0.6);
          gsap.set(el, { rotation: fan.rotate + tilt });
        },
        onRelease() {
          if (expandedId.current === el.dataset.cardId) return;
          setDraggingIdx(null);
          gsap.set(el, { zIndex: i + 1 });

          const self = this;
          gsap.to(el, {
            x: fan.tx,
            y: fan.ty,
            rotation: fan.rotate,
            scale: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.55)',
            overwrite: 'auto',
            onComplete() { self.update(); },  // sync Draggable's internal coords
          });
        },
        onClick() {
          if (!didDrag && expandedId.current !== el.dataset.cardId) {
            const cardId = el.dataset.cardId;
            if (cardId) handleCardClick(cardId);
          }
        },
      });

      // Tell Draggable the card starts at the fan offset so its x/y baseline is correct
      instance.update();
      return instance;
    });

    return () => {
      draggableRefs.current.forEach((d) => d?.kill());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Click handler ──────────────────────────────────────────────────────────
  const handleCardClick = useCallback((cardId) => {
    if (busy.current) return;

    const cards = cardRefs.current.filter(Boolean);
    const clickedIndex = CARDS.findIndex((c) => c.id === cardId);
    const clickedEl = cards[clickedIndex];
    const others = cards.filter((_, i) => i !== clickedIndex);

    // ── Collapse ─────────────────────────────────────────────────────────────
    if (expandedId.current === cardId) {
      busy.current = true;

      // Hide expanded content
      gsap.to(`.card-extra-${cardId}`, {
        opacity: 0, duration: 0.18, ease: 'power2.in',
        onComplete: () => gsap.set(`.card-extra-${cardId}`, { pointerEvents: 'none' }),
      });

      // Fade overlay out
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.3,
        onComplete: () => gsap.set(overlayRef.current, { display: 'none' }),
      });

      // Restore others
      gsap.to(others, { autoAlpha: 1, filter: 'blur(0px)', scale: 1, duration: 0.4, ease: 'power2.out' });

      // Flip card back to fan position
      const state = Flip.getState(clickedEl);

      // Reset to fanned layout
      const fan = FAN[clickedIndex];
      gsap.set(clickedEl, {
        width: 180,
        height: 240,
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        x: fan.tx,
        y: fan.ty,
        rotation: fan.rotate,
        zIndex: clickedIndex + 1,
      });

      Flip.from(state, {
        duration: 0.58,
        ease: 'power3.out',
        onComplete: () => { busy.current = false; },
      });

      expandedId.current = null;
      return;
    }

    // Prevent expanding a second card if one is already open
    if (expandedId.current !== null) return;

    // ── Expand ────────────────────────────────────────────────────────────────
    busy.current = true;
    expandedId.current = cardId;

    // Dim overlay
    gsap.set(overlayRef.current, { display: 'block', opacity: 0 });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });

    // Dim others
    gsap.to(others, {
      autoAlpha: 0.18, filter: 'blur(3px)', scale: 0.9,
      duration: 0.38, ease: 'power2.out',
    });

    // Capture pre-change state
    const state = Flip.getState(clickedEl);

    // Apply expanded layout
    gsap.set(clickedEl, {
      width: 300,
      height: 400,
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      rotation: 0,
      zIndex: 20,
    });

    Flip.from(state, {
      duration: 0.62,
      ease: 'power3.out',
      onComplete: () => {
        busy.current = false;
        // Fade in description + close button
        gsap.set(`.card-extra-${cardId}`, { pointerEvents: 'auto' });
        gsap.to(`.card-extra-${cardId}`, { opacity: 1, duration: 0.28, ease: 'power2.out' });
      },
    });
  }, []);

  return (
    <section
      id="project-scope"
      ref={sectionRef}
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem 2rem',
      }}
    >
      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <p style={{
          fontFamily: 'inherit',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.14em',
          color: '#0d99ff',
          margin: '0 0 10px',
          textTransform: 'uppercase',
        }}>
          Our Work
        </p>
        <h2 style={{
          fontFamily: 'inherit',
          fontSize: 32,
          fontWeight: 700,
          color: '#0a1a2e',
          margin: 0,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          Project Scope
        </h2>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          minHeight: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        }}
      >
        {/* Dim overlay */}
        <div
          ref={overlayRef}
          onClick={() => expandedId.current && handleCardClick(expandedId.current)}
          style={{
            display: 'none',
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 30, 65, 0.25)',
            zIndex: 15,
            pointerEvents: 'auto',
            cursor: 'default',
          }}
        />
        {/* Cards */}
        {CARDS.map((card, i) => (
          <Card
            key={card.id}
            data={card}
            fanIndex={i}
            cardRef={(el) => { cardRefs.current[i] = el; }}
            onClick={() => { /* handled by Draggable onClick */ }}
            dragging={draggingIdx === i}
          />
        ))}
      </div>

      {/* Sub-hint */}
      <p style={{
        fontFamily: 'inherit',
        fontSize: 12,
        color: '#7abaee',
        letterSpacing: '0.06em',
        margin: '2rem 0 0',
      }}>
        Drag or click any card to explore
      </p>
    </section>
  );
}

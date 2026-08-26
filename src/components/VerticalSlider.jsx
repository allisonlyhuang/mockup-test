import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import avisionImg from "../assets/aboutus/avision_labs.png";
import rcbabImg from "../assets/aboutus/rcbab.png";

const ENTRIES = [
  {
    seed: "avision",
    img: avisionImg,
    title: "Avision Labs",
    subtitle: "Winter 2026",
    body: "A smarter vision for every workspace. Avision manufactures imaging solutions engineered for reliability, speed, and precision.",
  },
  {
    seed: "rcbab",
    img: rcbabImg,
    title: "RCBA Barristers",
    subtitle: "Spring 2026",
    body: "Connecting, supporting, and empowering young attorneys in Riverside County since 1962.",
  },
  {
    seed: "roblox",
    img: null,
    title: "Roblox",
    subtitle: "Fall 2026",
    body: "",
  },
];

const SPACING = 450;
const ARC    = 900;
const clamp  = (v, min, max) => Math.max(min, Math.min(max, v));

export default function VerticalSlider() {
  const containerRef    = useRef(null);
  const cardRefs        = useRef([]);
  const textRefs        = useRef([]);
  const positionRef     = useRef(0);
  const snapTween       = useRef(null);
  const isDragging      = useRef(false);
  const dragStartY      = useRef(0);
  const dragStartPos    = useRef(0);
  const lastY           = useRef(0);
  const lastT           = useRef(0);
  const velocity        = useRef(0);
  const wheelTimeout    = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging]       = useState(false);

  // ── Position all cards based on current scroll position ──────────────
  const applyStyles = useCallback((pos, immediate = false) => {
    ENTRIES.forEach((_, i) => {
      const el     = cardRefs.current[i];
      const textEl = textRefs.current[i];
      if (!el) return;

      const d    = i - pos;
      const absD = Math.abs(d);
      const vars = {
        x:       Math.min(absD * absD * 400, ARC),
        y:       d * SPACING,
        scale:   clamp(1 - absD * 0.17, 0.34, 1),
        rotateZ: clamp(d * -3.4, -16, 16),
        opacity: clamp(1 - absD * 0.32, 0, 1),
        filter:  `blur(${clamp(absD * 3.4, 0, 16)}px)`,
        zIndex:  Math.round(200 - absD * 10),
        overwrite: "auto",
      };

      immediate
        ? gsap.set(el, vars)
        : gsap.to(el, { ...vars, duration: 0.75, ease: "power3.out" });

      if (textEl) {
        const textVars = {
          opacity: absD < 0.5 ? 1 - absD / 0.5 : 0,
          y:       absD < 0.5 ? 0 : 12,
          overwrite: "auto",
        };
        immediate
          ? gsap.set(textEl, textVars)
          : gsap.to(textEl, { ...textVars, duration: 0.6, ease: "power3.out" });
      }
    });
  }, []);

  // ── Snap to a target index ────────────────────────────────────────────
  const goTo = useCallback((target, opts = {}) => {
    target = clamp(Math.round(target), 0, ENTRIES.length - 1);
    snapTween.current?.kill();
    const proxy = { p: positionRef.current };
    snapTween.current = gsap.to(proxy, {
      p:        target,
      duration: opts.duration ?? 0.7,
      ease:     "power3.out",
      onUpdate:  () => { positionRef.current = proxy.p; applyStyles(proxy.p); },
      onComplete:() => { positionRef.current = target; applyStyles(target); setActiveIndex(target); },
    });
  }, [applyStyles]);

  // ── Wheel ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      snapTween.current?.kill();
      positionRef.current = clamp(positionRef.current + e.deltaY / 260, 0, ENTRIES.length - 1);
      applyStyles(positionRef.current);
      clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => goTo(positionRef.current), 120);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); clearTimeout(wheelTimeout.current); };
  }, [applyStyles, goTo]);

  // ── Drag ──────────────────────────────────────────────────────────────
  const onPointerDown = (e) => {
    isDragging.current  = true;
    setDragging(true);
    dragStartY.current  = e.clientY;
    dragStartPos.current = positionRef.current;
    lastY.current       = e.clientY;
    lastT.current       = performance.now();
    velocity.current    = 0;
    snapTween.current?.kill();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const next = clamp(dragStartPos.current - (e.clientY - dragStartY.current) / SPACING, 0, ENTRIES.length - 1);
    positionRef.current = next;
    applyStyles(next, true);
    const now = performance.now();
    const dt  = now - lastT.current;
    if (dt > 0) velocity.current = (e.clientY - lastY.current) / dt;
    lastY.current = e.clientY;
    lastT.current = now;
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false);
    goTo(positionRef.current + (-velocity.current * 140) / SPACING, { duration: 0.8 });
  };

  // ── Keyboard ──────────────────────────────────────────────────────────
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); goTo(activeIndex + 1); }
    if (e.key === "ArrowUp")   { e.preventDefault(); goTo(activeIndex - 1); }
  };

  useEffect(() => { applyStyles(0, true); }, []); // eslint-disable-line

  return (
    <div className="vac-root">
      <style>{`
        .vac-root {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Inter', system-ui, sans-serif;
          color: #1a1a1a;
          padding: 8px 24px 40px;
          box-sizing: border-box;
        }
        .vac-stage-wrap {
          position: relative;
          width: 100%;
          max-width: 1100px;
          display: flex;
          align-items: stretch;
        }
        .vac-stage {
          position: relative;
          flex: 1;
          height: 820px;
          overflow: visible;
          cursor: grab;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }
        .vac-stage.dragging { cursor: grabbing; }
        .vac-stage:focus-visible { outline: 2px solid #0D9AFF; outline-offset: 4px; }
        .vac-track { position: absolute; inset: 0; }
        .vac-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 479px;
          margin-top: -159px;
          margin-left: -239px;
          will-change: transform, filter, opacity;
          pointer-events: none;
        }
        .vac-card-img-wrap {
          width: 479px;
          height: 319px;
          border-radius: 6px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 18px 40px -12px rgba(0,0,0,0.18);
        }
        .vac-card-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .vac-card-text { margin-top: 20px; text-align: center; padding: 0 8px; }
        .vac-card-title {
          font-family: 'Fustat', system-ui, sans-serif;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -0.02em;
          margin: 0 0 0px;
          color: #1a1a1a;
        }
        .vac-card-subtitle {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12px;
          letter-spacing: 0.04em;
          color: #0D9AFF;
          margin: 0 0 3px;
          font-weight: 500;
          text-transform: uppercase;
        }
        .vac-card-body {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13.5px;
          line-height: 1.6;
          color: #6b7280;
          margin: 0 auto;
          max-width: 600px;
        }
      `}</style>
      <div className="vac-stage-wrap">

        {/* Card stage */}
        <div
          ref={containerRef}
          className={`vac-stage${dragging ? " dragging" : ""}`}
          data-lenis-prevent
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="listbox"
          aria-label="Past opportunities carousel"
          aria-activedescendant={`vac-card-${activeIndex}`}
        >
          <div className="vac-track">
            {ENTRIES.map((entry, i) => (
              <div
                key={entry.seed}
                id={`vac-card-${i}`}
                ref={(el) => (cardRefs.current[i] = el)}
                className="vac-card"
                role="option"
                aria-selected={i === activeIndex}
              >
                <div className="vac-card-img-wrap">
                  {entry.img ? (
                    <img src={entry.img} alt={entry.title} draggable={false} />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      background: "linear-gradient(135deg, #e8edf2 0%, #d0d8e4 100%)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 10,
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter, system-ui, sans-serif" }}>
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="vac-card-text"
                  ref={(el) => (textRefs.current[i] = el)}
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <h3 className="vac-card-title">{entry.title}</h3>
                  <p className="vac-card-subtitle">{entry.subtitle}</p>
                  <p className="vac-card-body">{entry.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import avisionImg from "../assets/aboutus/avision_labs.png";
import rcbabImg from "../assets/aboutus/rcbab.png";
import comingSoonImg from "../assets/aboutus/coming_soon.png";
import "./VerticalSlider.css";

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
    img: comingSoonImg,
    title: "Roblox",
    subtitle: "Fall 2026",
    body: "",
  },
];

const WHEEL_SENSITIVITY = 400; // px of wheel delta mapped to one full card step
const DRAG_SPACING      = 260; // px of drag distance mapped to one full card step
const ENTER_OFFSET      = 46; // px an upcoming card peeks below the active one before its turn
const STACK_STEP        = 46;  // px each retired card nudges up behind the active one
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

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

  // ── Position every card based on continuous scroll position ───────────
  const applyStack = useCallback((pos) => {
    ENTRIES.forEach((_, i) => {
      const el     = cardRefs.current[i];
      const textEl = textRefs.current[i];
      if (!el) return;

      const d = i - pos;
      let vars;

      if (d >= 0) {
        // Not yet arrived — waits below, sliding up into place on its turn.
        const t = clamp(d, 0, 1);
        vars = {
          y:       t * ENTER_OFFSET,
          scale:   1 - t * 0.04,
          opacity: clamp(1 - t * 0.6, 0.4, 1),
          filter:  "brightness(1)",
        };
      } else {
        // Already active or retired into the stack behind the current card.
        const depth = clamp(-d, 0, 3);
        vars = {
          y:       -depth * STACK_STEP,
          scale:   clamp(1 - depth * 0.05, 0.82, 1),
          opacity: clamp(1 - depth * 0.15, 0.35, 1),
          filter:  `brightness(${clamp(1 - depth * 0.08, 0.7, 1)})`,
        };
      }

      const zIndex = Math.round(100 - Math.abs(d) * 10);
      gsap.set(el, { ...vars, zIndex, overwrite: "auto" });

      if (textEl) {
        const showText = Math.abs(d) < 0.12;
        gsap.set(textEl, { opacity: showText ? 1 : 0, y: showText ? 0 : 8, overwrite: "auto" });
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
      duration: opts.duration ?? 0.6,
      ease:     "power3.out",
      onUpdate:  () => { positionRef.current = proxy.p; applyStack(proxy.p); },
      onComplete:() => { positionRef.current = target; applyStack(target); setActiveIndex(target); },
    });
  }, [applyStack]);

  // ── Wheel (only fires while the cursor is over the hitbox) ────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      snapTween.current?.kill();
      positionRef.current = clamp(positionRef.current + e.deltaY / WHEEL_SENSITIVITY, 0, ENTRIES.length - 1);
      applyStack(positionRef.current);
      clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => goTo(positionRef.current), 120);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); clearTimeout(wheelTimeout.current); };
  }, [applyStack, goTo]);

  useEffect(() => () => {
    snapTween.current?.kill();
    clearTimeout(wheelTimeout.current);
  }, []);

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
    const next = clamp(dragStartPos.current - (e.clientY - dragStartY.current) / DRAG_SPACING, 0, ENTRIES.length - 1);
    positionRef.current = next;
    applyStack(next);
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
    goTo(positionRef.current + (-velocity.current * 140) / DRAG_SPACING, { duration: 0.7 });
  };

  // ── Keyboard ──────────────────────────────────────────────────────────
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); goTo(activeIndex + 1); }
    if (e.key === "ArrowUp")   { e.preventDefault(); goTo(activeIndex - 1); }
  };

  useEffect(() => { applyStack(0); }, [applyStack]);

  return (
    <div className="vac-root">
      <div className="vac-stage-wrap">
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
                <div className={`vac-card-img-wrap${entry.seed === "roblox" ? " vac-card-img-wrap--placeholder" : ""}`}>
                  {entry.img ? (
                    <img src={entry.img} alt={entry.title} draggable={false} />
                  ) : (
                    <div className="vac-card-placeholder">
                      <span>Coming Soon</span>
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

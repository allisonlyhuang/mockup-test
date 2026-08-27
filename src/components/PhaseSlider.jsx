import { useCallback, useEffect, useInsertionEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

const PHASE_CAROUSEL_CSS = `
.phase-carousel {
  --pc-accent: #0d9aff;
  --pc-ink: #0b0b0c;
  --pc-body: #4a4d52;
  --pc-bg: #ffffff;
  --pc-card-width: 560px;
  --pc-gap: 24px;

  width: 100%;
}
.phase-carousel__strip {
  display: flex;
  flex-direction: row;
  gap: var(--pc-gap);
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;
  cursor: default;
  padding: 0 0 16px clamp(2rem, 8vw, 7rem);
  width: 100%;
  box-sizing: border-box;
  scrollbar-width: none;
}
.phase-carousel__strip::-webkit-scrollbar {
  display: none;
}
.phase-carousel__slide {
  flex: 0 0 var(--pc-card-width);
  box-sizing: border-box;
}
.phase-card {
  position: relative;
  background: var(--pc-bg);
  max-width: var(--pc-card-max-width);
  margin: 0 auto;
  aspect-ratio: 781 / 371;
  padding: 28px 32px;
  display: flex;
  box-sizing: border-box;
}
/* text block — absolutely positioned per layout */
.phase-card__text {
  position: absolute;
  z-index: 1;
  max-width: 52%;
}
.phase-card--bl .phase-card__text { bottom: 28px; left: 32px; }
.phase-card--tr .phase-card__text { top: 28px;    right: 32px; text-align: right; }
.phase-card--br .phase-card__text { bottom: 28px; right: 32px; text-align: right; }
.phase-card--tl .phase-card__text { top: 28px;    left: 32px; }

/* doodle — opposite corner from text */
.phase-card__doodle {
  position: absolute;
  height: 55%;
  width: auto;
  pointer-events: none;
}
.phase-card--bl .phase-card__doodle { top: 27px;    right: 40px; }
.phase-card--tr .phase-card__doodle { bottom: 40px; left: 50px; }
.phase-card--br .phase-card__doodle { top: 24px;    left: 70px; }
.phase-card--tl .phase-card__doodle { bottom: 24px; right: 28px; }

.phase-card__doodle svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.phase-card__eyebrow {
  margin: 0 0 6px;
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: var(--pc-ink);
}
.phase-card__subtitle {
  margin: 0 0 10px;
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: clamp(20px, 3.4vw, 28px);
  font-weight: 800;
  color: var(--pc-ink);
  line-height: 1.15;
}
.phase-card__body {
  margin: 0;
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--pc-body);
}
@media (max-width: 560px) {
  .phase-carousel { --pc-card-width: 85vw; }
}
`;

function usePhaseCarouselStyles() {
  useInsertionEffect(() => {
    if (document.getElementById("phase-carousel-styles")) return;
    const tag = document.createElement("style");
    tag.id = "phase-carousel-styles";
    tag.textContent = PHASE_CAROUSEL_CSS;
    document.head.appendChild(tag);
  }, []);
}

/**
 * Strips the fixed width/height off an exported <svg ...> tag so it can be
 * scaled by CSS, and reports the original aspect ratio so the wrapper can
 * reserve the right amount of space (no layout jump, no letterboxing).
 */
function prepSvgMarkup(raw) {
  const widthMatch = raw.match(/<svg[^>]*\swidth="([\d.]+)"/);
  const heightMatch = raw.match(/<svg[^>]*\sheight="([\d.]+)"/);
  const ratio =
    widthMatch && heightMatch
      ? parseFloat(widthMatch[1]) / parseFloat(heightMatch[1])
      : 1;

  const markup = raw
    .replace(/(<svg[^>]*)\swidth="[\d.]+"/, "$1")
    .replace(/(<svg[^>]*)\sheight="[\d.]+"/, "$1");

  return { markup, ratio };
}

/**
 * Builds a paused GSAP timeline that "draws" every shape inside the doodle
 * in source order:
 *  - stroked shapes (outlines) reveal themselves with DrawSVGPlugin
 *  - filled-only shapes (eyes, dots, solid accents) pop in with a small
 *    back-ease scale, timed just after the stroke around them finishes
 * Playing the timeline draws the doodle, reversing it undraws it.
 */
function buildDrawTimeline(host) {
  const shapes = Array.from(host.querySelectorAll(
    "path, circle, rect, ellipse, line, polyline, polygon"
  ));
  const tl = gsap.timeline({ paused: true });

  shapes.forEach((el, i) => {
    const stroke = el.getAttribute("stroke");
    const fill = el.getAttribute("fill");
    const hasStroke = !!stroke && stroke !== "none";
    const hasFill = !!fill && fill !== "none" && fill !== "white" && fill !== "#ffffff" && fill !== "#fff";
    const start = i * 0.04;

    if (hasStroke) {
      gsap.set(el, { drawSVG: "0%", fillOpacity: 0 });
      tl.to(el, { drawSVG: "100%", duration: 0.5, ease: "power2.inOut" }, start);
      if (hasFill) {
        tl.to(el, { fillOpacity: 1, duration: 0.2, ease: "power1.out" }, start + 0.35);
      }
    } else if (hasFill) {
      gsap.set(el, { opacity: 0, scale: 0.5, transformOrigin: "50% 50%" });
      tl.to(el, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, start);
    } else {
      // white fill (highlights) — just fade in late
      gsap.set(el, { opacity: 0 });
      tl.to(el, { opacity: 1, duration: 0.2, ease: "power1.out" }, start + 0.2);
    }
  });

  return tl;
}

function DoodleFrame({ svg, active, size }) {
  const wrapRef = useRef(null);
  const timelineRef = useRef(null);
  const activeRef = useRef(active);
  const { markup, ratio } = useMemo(() => prepSvgMarkup(svg), [svg]);

  activeRef.current = active;

  // Inject SVG markup imperatively so the ref div is always mounted
  // before we try to query its children.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    wrap.innerHTML = markup;

    const tl = buildDrawTimeline(wrap);
    timelineRef.current = tl;

    if (activeRef.current) tl.play(0);

    return () => {
      tl.kill();
      timelineRef.current = null;
      wrap.innerHTML = "";
    };
  }, [markup]);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    if (active) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.5).reverse();
    }
  }, [active]);

  return (
    <div
      className="phase-card__doodle"
      style={{ aspectRatio: ratio, ...(size ? { height: size } : {}) }}
      ref={wrapRef}
    />
  );
}

function PhaseCard({ phase, active, frame }) {
  const layoutClass = phase.layout ? ` phase-card--${phase.layout}` : " phase-card--bl";
  return (
    <div className={`phase-card${layoutClass}${active ? " is-active" : ""}`}>
      {frame && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          dangerouslySetInnerHTML={{ __html: frame.replace(/<svg/, '<svg preserveAspectRatio="none" style="width:100%;height:100%;display:block;"') }}
        />
      )}
      <DoodleFrame svg={phase.doodle} active={active} size={phase.doodleSize} />
      <div className="phase-card__text">
        <p className="phase-card__eyebrow">{phase.title}</p>
        <h3 className="phase-card__subtitle">{phase.subtitle}</h3>
        {phase.body && <p className="phase-card__body">{phase.body}</p>}
      </div>
    </div>
  );
}

function SlideObserver({ phase, frame, strip, sectionVisible }) {
  const slideRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const slide = slideRef.current;
    if (!slide || !strip || !sectionVisible) return;

    const check = () => {
      const sr = strip.getBoundingClientRect();
      const el = slide.getBoundingClientRect();
      const overlap = Math.min(el.right, sr.right) - Math.max(el.left, sr.left);
      setVisible(overlap / el.width >= 0.3);
    };

    strip.addEventListener("scroll", check, { passive: true });
    check();
    return () => strip.removeEventListener("scroll", check);
  }, [strip, sectionVisible]);

  return (
    <div className="phase-carousel__slide" ref={slideRef}>
      <PhaseCard phase={phase} active={visible} frame={frame} />
    </div>
  );
}

export default function PhaseSlider({ phases, frame, className = "" }) {
  usePhaseCarouselStyles();
  const sectionRef = useRef(null);
  const stripRef = useRef(null);
  const [stripEl, setStripEl] = useState(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  // Fire once when the section scrolls into the page viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSectionVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onWheel = useCallback((e) => {
    const strip = stripRef.current;
    if (!strip) return;
    e.preventDefault();
    strip.scrollLeft += e.deltaY + e.deltaX;
  }, []);

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
  }, []);

  const setCarouselRef = useCallback((node) => {
    sectionRef.current = node;
    if (!node) return;
    node.addEventListener("wheel", onWheel, { passive: false });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
  }, [onWheel, onTouchMove]);

  useEffect(() => {
    const node = sectionRef.current;
    return () => {
      if (!node) return;
      node.removeEventListener("wheel", onWheel);
      node.removeEventListener("touchmove", onTouchMove);
    };
  }, [onWheel, onTouchMove]);

  const setRefs = useCallback((node) => {
    stripRef.current = node;
    setStripEl(node);
  }, []);

  return (
    <div className={`phase-carousel ${className}`} ref={setCarouselRef}>
      <div className="phase-carousel__strip" ref={setRefs}>
        {phases.map((phase, i) => (
          <SlideObserver key={phase.id ?? i} phase={phase} frame={frame} strip={stripEl} sectionVisible={sectionVisible} />
        ))}
        <div style={{ flexShrink: 0, width: "clamp(2rem, 8vw, 7rem)" }} />
      </div>
    </div>
  );
}
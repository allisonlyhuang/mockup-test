import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import "./PhaseSlider.css";

gsap.registerPlugin(DrawSVGPlugin);

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

  useLayoutEffect(() => {
    activeRef.current = active;
  }, [active]);

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

export default function PhaseSlider({ phases, frame, className = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
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

  const updateTranslate = useCallback(() => {
    const target = slideRefs.current[activeIndex];
    if (!target) return;
    setTranslateX(target.offsetLeft);
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateTranslate();
  }, [updateTranslate]);

  useEffect(() => {
    window.addEventListener("resize", updateTranslate);
    return () => window.removeEventListener("resize", updateTranslate);
  }, [updateTranslate]);

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(phases.length - 1, i + 1));

  const progress = phases.length > 1 ? activeIndex / (phases.length - 1) : 0;

  return (
    <div className={`phase-carousel ${className}`} ref={sectionRef}>
      <div className="phase-carousel__viewport">
        <div
          className="phase-carousel__track"
          ref={trackRef}
          style={{ transform: `translateX(-${translateX}px)` }}
        >
          {phases.map((phase, i) => (
            <div
              className="phase-carousel__slide"
              key={phase.id ?? i}
              ref={(el) => { slideRefs.current[i] = el; }}
            >
              <PhaseCard phase={phase} active={sectionVisible && i === activeIndex} frame={frame} />
            </div>
          ))}
        </div>
      </div>
      <div className="phase-carousel__controls">
        <button
          type="button"
          className="phase-carousel__arrow"
          onClick={goPrev}
          disabled={activeIndex === 0}
          aria-label="Previous phase"
        >
          <ChevronLeftIcon width={18} height={18} />
        </button>
        <div className="phase-carousel__progress" aria-label="Project phases progress">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <div className="phase-carousel__progress-track" aria-hidden="true">
            <div
              className="phase-carousel__progress-thumb"
              style={{ left: `${progress * 78}%` }}
            />
          </div>
          <span>{String(phases.length).padStart(2, "0")}</span>
        </div>
        <button
          type="button"
          className="phase-carousel__arrow"
          onClick={goNext}
          disabled={activeIndex === phases.length - 1}
          aria-label="Next phase"
        >
          <ChevronRightIcon width={18} height={18} />
        </button>
      </div>
    </div>
  );
}
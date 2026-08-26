import { useRef, useEffect } from "react";
import gsap from "gsap";
import Arrow from "../assets/aboutus/handdrawn_arrow.svg?react";

export default function ArrowDrawOn({
  once = true,
  targetRef = null,
  threshold = 0.15,
  rootMargin = "0px",
  ...props
}) {
  const svgRef = useRef(null);
  const played = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    const watchEl = targetRef?.current ?? svg;
    if (!svg || !watchEl) return;

    const paths = Array.from(svg.querySelectorAll("path"));

    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    const play = () => {
      gsap.killTweensOf(paths);
      paths.forEach((path, i) => {
        const length = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: "power2.inOut",
            delay: i * 0.12,
          }
        );
      });
    };

    const reset = () => {
      gsap.killTweensOf(paths);
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDashoffset: length });
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && played.current) return;
          played.current = true;
          play();
        } else if (!once) {
          reset();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(watchEl);
    return () => observer.disconnect();
  }, [once, targetRef, threshold, rootMargin]);

  // SVGR forwards refs to the root <svg> by default (recent versions of
  // both vite-plugin-svgr and @svgr/webpack) — no changes needed to arrow.svg.
  return <Arrow ref={svgRef} {...props} />;
}
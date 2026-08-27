import { useRef, useEffect } from "react";
import gsap from "gsap";
import Draw from "../assets/mission/vector.svg?react"
const CLUSTER_ORDER = ["2", "3", "4"]; // left-to-right along the curve
const LINE_RANGES = { "3": [0, 2], "2": [2, 4], "4": [4, 5] };
const POINT_RANGES = { "3": [0, 3], "2": [3, 6], "4": [6, 9] };

export default function VectorDrawOn({
  once = true,
  targetRef = null,
  threshold = 0.4,
  rootMargin = "0px",
  className,
}) {
  const svgRef = useRef(null);
  const played = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    const watchEl = targetRef?.current ?? svg;
    if (!svg || !watchEl) return;

    const curve = svg.querySelector('[stroke="black"]');

    const points = Array.from(
      svg.querySelectorAll('[fill="#F0F0EF"][stroke="#3591D4"]')
    );

    const lines = Array.from(svg.querySelectorAll('[stroke="#3591D4"]')).filter(
      (el) => el.getAttribute("fill") !== "#F0F0EF"
    );

    const cursorParts = Array.from(svg.querySelectorAll("*")).filter(
      (el) => !el.hasAttribute("stroke")
    );

    const clusterLines = (cluster) => {
      const [start, end] = LINE_RANGES[cluster];
      return lines.slice(start, end);
    };
    const clusterPoints = (cluster) => {
      const [start, end] = POINT_RANGES[cluster];
      return points.slice(start, end);
    };

    const primeDraw = (el) => {
      const len = el.getTotalLength();
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    };

    const primePoint = (el) => {
      gsap.set(el, { scale: 0, transformOrigin: "50% 50%" });
    };

    const primeCursor = (el) => {
      gsap.set(el, { opacity: 0, scale: 0.8, transformOrigin: "50% 50%" });
    };

    const prime = () => {
      primeDraw(curve);
      lines.forEach(primeDraw);
      points.forEach(primePoint);
      cursorParts.forEach(primeCursor);
    };

    const play = () => {
      const tl = gsap.timeline();

      tl.to(curve, {
        strokeDashoffset: 0,
        duration: 0.75,
        ease: "power2.inOut",
      });

      CLUSTER_ORDER.forEach((cluster, i) => {
        tl.to(
          clusterLines(cluster),
          {
            strokeDashoffset: 0,
            duration: 0.18,
            ease: "power2.out",
            stagger: 0.04,
          },
          i === 0 ? "+=0.03" : "-=0.06"
        ).to(
          clusterPoints(cluster),
          {
            scale: 1,
            duration: 0.2,
            ease: "back.out(2.2)",
            stagger: 0.03,
          },
          "-=0.1"
        );
      });

      tl.to(
        cursorParts,
        {
          opacity: 1,
          scale: 1,
          duration: 0.22,
          ease: "back.out(1.8)",
        },
        "-=0.05"
      );
    };

    const reset = () => {
      gsap.killTweensOf([curve, ...lines, ...points, ...cursorParts]);
      prime();
    };

    prime();

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

  return <Draw ref={svgRef} className={className} />;
}
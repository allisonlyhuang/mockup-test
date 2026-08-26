import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import incoming_post from "../assets/hero/incoming_post.svg";
import roblox_post from "../assets/hero/roblox_post.svg";

export default function AnimatedStickyStack() {
  const sceneRef = useRef(null);
  const backRef = useRef(null);
  const frontRef = useRef(null);
  const quickX = useRef(null);
  const quickY = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const back = backRef.current;
      const front = frontRef.current;

      gsap.set([back, front], { autoAlpha: 0, y: 18, scale: 0.96, transformOrigin: "50% 50%" });

      const floatBack = gsap.to(back, {
        y: -7, rotate: -0.6, duration: 2.6, ease: "sine.inOut",
        yoyo: true, repeat: -1, paused: true,
      });
      const floatFront = gsap.to(front, {
        y: -9, rotate: 0.5, duration: 3.2, ease: "sine.inOut",
        yoyo: true, repeat: -1, paused: true,
      });

      gsap.timeline({
        onComplete: () => { floatBack.play(); floatFront.play(); },
      })
        .to(back, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }, 0.05)
        .to(front, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }, 0.25);

      [{ el: back, float: floatBack }, { el: front, float: floatFront }].forEach(({ el, float }) => {
        el.style.cursor = "pointer";
        el.addEventListener("mouseenter", () => {
          float.pause();
          gsap.to(el, { scale: 1.03, filter: "drop-shadow(0 14px 18px rgba(13,154,255,0.35))", duration: 0.35, ease: "power2.out" });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, {
            scale: 1, filter: "drop-shadow(0 0px 0px rgba(13,154,255,0))", duration: 0.35, ease: "power2.out",
            onComplete: () => float.resume(),
          });
        });
      });

      quickX.current = gsap.quickTo(sceneRef.current, "rotationY", { duration: 0.4, ease: "power3" });
      quickY.current = gsap.quickTo(sceneRef.current, "rotationX", { duration: 0.4, ease: "power3" });
      gsap.set(sceneRef.current, { transformPerspective: 900, transformStyle: "preserve-3d" });
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    const rect = sceneRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    quickX.current?.(x * 10);
    quickY.current?.(-y * 10);
  };

  const handleMouseLeave = () => {
    quickX.current?.(0);
    quickY.current?.(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", width: 328, height: 198 }}
    >
      <div ref={sceneRef} style={{ position: "relative", width: "100%", height: "100%" }}>
        <img
          ref={backRef}
          src={incoming_post}
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: 201, height: 165 }}
        />
        <img
          ref={frontRef}
          src={roblox_post}
          alt=""
          style={{ position: "absolute", top: 100, left: 45, width: 288, height: 153 }}
        />
      </div>
    </div>
  );
}
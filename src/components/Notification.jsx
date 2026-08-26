import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import figmaStar from "../assets/hero/figma_star.svg";

export default function Notification({
  message = "Fall applications are closing soon. Make sure to apply!",
  onApply,
  onDismiss,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: 100 },
      { duration: 0.4, opacity: 1, x: 0, ease: "power2.out" }
    );
  }, []);

  const handleDismiss = () => {
    gsap.to(ref.current, {
      duration: 0.3,
      opacity: 0,
      x: 100,
      ease: "power2.in",
      onComplete: () => {
        setVisible(false);
        onDismiss?.();
      },
    });
  };

  if (!visible) return null;

  return (
    <div ref={ref} style={styles.container}>
      <div style={styles.body}>
        <img src={figmaStar} alt="icon" style={styles.icon} />
        <p style={styles.message}>{message}</p>
      </div>
      <div style={styles.actions}>
        <button style={styles.button} onClick={onApply}>
          Apply
        </button>
        <div style={styles.dividerH} />
        <button style={styles.button} onClick={handleDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    borderRadius: "var(--radius-medium, 0.3125rem)",
    background: "var(--color-bg-menu, #2a2a2a)",
    boxShadow:
      "0 2.643px 9.25px 0 rgba(0,0,0,0.15), 0 6.607px 22.464px 0 rgba(0,0,0,0.20)",
    overflow: "hidden",
    maxWidth: "350px",
    width: "100%",
  },
  body: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
    flex: 1,
    padding: "12px 16px",
  },
  icon: {
    width: "30px",
    height: "30px",
    flexShrink: 0,
    filter: "brightness(0) invert(1)",
  },
  message: {
    margin: 0,
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "500",
    lineHeight: "1.4",
  },
  dividerV: {
    width: "1px",
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "stretch",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    borderLeft: "1px solid rgba(255,255,255,0.15)",
    flexShrink: 0,
    minWidth: "72px",
  },
  dividerH: {
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  button: {
    flex: 1,
    background: "none",
    border: "none",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "0 14px",
    minHeight: "34px",
    whiteSpace: "nowrap",
  },
};

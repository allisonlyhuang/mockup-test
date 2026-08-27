import React, { useState } from "react";
import { Building2, Search, PencilLine, Check, Loader2, Mail } from "lucide-react";


const OPTIONS = [
  { key: "brandDesign", label: "Brand Design" },
  { key: "websiteRedesign", label: "Website Redesign" },
  { key: "designConsulting", label: "Design Consulting" },
  { key: "mentorshipProgram", label: "Mentorship Program" },
  { key: "other", label: "Other:" },
];

const INITIAL_SELECTIONS = OPTIONS.reduce((acc, o) => {
  acc[o.key] = false;
  return acc;
}, {});

export default function InquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [otherText, setOtherText] = useState("");
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  // status: "idle" | "sending" | "sent"
  const [status, setStatus] = useState("idle");

  const toggle = (key) => {
    if (status !== "idle") return;
    setSelections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== "idle") return;

    setStatus("sending");

    // simulate processing
    setTimeout(() => {
      setStatus("sent");

      // clear form + reset button after showing "Sent!"
      setTimeout(() => {
        setName("");
        setEmail("");
        setOrganization("");
        setOtherText("");
        setSelections(INITIAL_SELECTIONS);
        setStatus("idle");
      }, 1100);
    }, 1000);
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        {/* Search-style header */}
        <div style={styles.searchBar}>
          <Search size={18} color="#8e8e93" strokeWidth={2} />
          <span style={styles.searchPlaceholder}>Send us an inquiry!</span>
        </div>

        <div style={styles.divider} />

        {/* Basic Information */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Basic Information</div>

          <label style={styles.fieldRow}>
            <PencilLine size={18} color="#c7c7cc" strokeWidth={1.75} />
            <input
              style={styles.fieldInput}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status !== "idle"}
            />
          </label>

          <label style={styles.fieldRow}>
            <Mail size={18} color="#c7c7cc" strokeWidth={1.75} />
            <input
              style={styles.fieldInput}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status !== "idle"}
            />
          </label>
          <label style={styles.fieldRow}>
            <Building2 size={18} color="#c7c7cc" strokeWidth={1.75} />
            <input
              style={styles.fieldInput}
              type="text"
              placeholder="(Optional) Organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              disabled={status !== "idle"}
            />
          </label>
        </div>

        <div style={styles.divider} />

        {/* What are you looking for */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>What are you looking for?</div>

          {OPTIONS.map((opt) => (
            <div key={opt.key}>
              <div
                style={styles.optionRow}
                onClick={() => toggle(opt.key)}
              >
                <span style={styles.optionLabel}>{opt.label}</span>
                <span
                  style={{
                    ...styles.checkbox,
                    ...(selections[opt.key] ? styles.checkboxChecked : {}),
                  }}
                >
                  {selections[opt.key] && (
                    <Check size={14} color="#ffffff" strokeWidth={3} />
                  )}
                </span>
              </div>
              {opt.key === "other" && selections.other && (
                <div onClick={(e) => e.stopPropagation()}>
                  <textarea
                    style={styles.otherInput}
                    placeholder="Please describe…"
                    value={otherText}
                    maxLength={150}
                    onChange={(e) => {
                      setOtherText(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    disabled={status !== "idle"}
                    rows={3}
                  />
                  <div style={styles.otherCount}>
                    {otherText.length}/150
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={styles.divider} />

        {/* Submit */}
        <div style={styles.footer}>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(status === "sent" ? styles.buttonSent : {}),
            }}
            disabled={status !== "idle"}
          >
            {status === "idle" && "Send Inquiry"}
            {status === "sending" && (
              <span style={styles.buttonContent}>
                <Loader2 size={16} style={styles.spinner} />
                Sending...
              </span>
            )}
            {status === "sent" && (
              <span style={styles.buttonContent}>
                <Check size={16} color="#4abaff" strokeWidth={3} />
                Sent!
              </span>
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    background: "#1c1c1e",
    borderRadius: 20,
    boxShadow: "0 12px 28px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "10px 14px 8px 14px",
    padding: "8px 14px",
    background: "#2c2c2e",
    borderRadius: 10,
  },
  searchPlaceholder: {
    color: "#8e8e93",
    fontSize: 14,
    fontWeight: 400,
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "0 14px",
  },
  section: {
    padding: "10px 20px 6px 20px",
  },
  sectionLabel: {
    color: "#8e8e93",
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 6,
  },
  fieldRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "5px 0",
  },
  fieldInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 400,
    width: "100%",
    fontFamily: "inherit",
  },
  optionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "2px 0",
    cursor: "pointer",
    userSelect: "none",
  },
  optionLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 400,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    background: "#3a3a3c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.15s ease",
  },
  checkboxChecked: {
    background: "#0a84ff",
  },
  otherCount: {
    textAlign: "right",
    fontSize: 11,
    color: "#636366",
    marginTop: -5,
    marginBottom: 0,
    paddingRight: 2,
  },
  otherInput: {
    display: "block",
    width: "100%",
    background: "#2c2c2e",
    border: "none",
    borderRadius: 8,
    outline: "none",
    color: "#ffffff",
    fontSize: 14,
    padding: "7px 10px",
    marginBottom: 6,
    fontFamily: "inherit",
    boxSizing: "border-box",
    resize: "none",
    overflow: "hidden",
  },
  footer: {
    padding: "8px 14px 14px 14px",
  },
  button: {
    width: "100%",
    padding: "11px 0",
    background: "#48484a",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 500,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s ease",
  },
  buttonSent: {
    animation: "popIn 0.3s ease",
  },
  buttonContent: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinner: {
    animation: "spin 0.8s linear infinite",
  },
};
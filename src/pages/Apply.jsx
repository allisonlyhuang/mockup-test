import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2, X, SquareChevronDown, ChevronDown } from "lucide-react";
import FaceWithEyes from "../components/FaceWithEyes";
import FigmaTimeline from "../components/FigmaTimeline";
import templateBg from "../assets/template.jpg";

const SHEET_ENDPOINT = import.meta.env.VITE_SHEET_ENDPOINT;

export default function Apply() {
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [takeHome, setTakeHome] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [about, setAbout] = useState("");
  const [role, setRole] = useState("");
  const [quarter, setQuarter] = useState("");
  const [prevRole, setPrevRole]   = useState('');
  const [prevQuarter, setPrevQuarter] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    setSubmitError(null);

    const payload = {
      timestamp:    new Date().toISOString(),
      fullName:     name,
      uciEmail:     email,
      year:         quarter,
      roleInterest: role,
      takeHomeURL:  takeHome,
      whyJoin:      about,
      portfolioURL: portfolio || null,
      projectTeams: confirmed ? "Yes" : "No",
      prevRole:     confirmed ? prevRole : "",
      prevQuarter:  confirmed ? prevQuarter : "",
    };

    try {
      await fetch(SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        redirect: "follow",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });

      setStatus("sent");
      setTimeout(() => {
        setName("");
        setEmail("");
        setTakeHome("");
        setPortfolio("");
        setAbout("");
        setRole("");
        setQuarter("");
        setPrevRole("");
        setPrevQuarter("");
        setConfirmed(false);
        setStatus("idle");
      }, 1800);
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div style={s.page}>
      <img
        src={templateBg}
        alt=""
        aria-hidden="true"
        style={s.bg}
        draggable="false"
      />
      <div style={s.bgOverlay} />

      <button style={s.back} onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* Two-column layout */}
      <div style={s.layout}>
      {/* Figma-style dialog card */}
      <div style={s.card}>
        {/* Face above card */}
        <div style={s.faceWrap}>
          <FaceWithEyes size={80} blinkDelay={1} />
        </div>

        {/* Title bar */}
        <div style={s.titleBar}>
          <span style={s.title}>Roblox x Mockup Application</span>
        </div>

        <div
          style={{
            marginTop: "-1.2rem",
            padding: "15px 20px",
            letterSpacing: "-0.01em",
            flex: 1,
            textAlign: "center",
          }}
        >
          <p style={s.bodyText}>
            Thanks for your interest in our program. Please submit this form,
            alongside your Take-Home, <strong>by Sept. 30.</strong> Best of
            luck!
          </p>
        </div>

        <div style={s.hairline} />

        <form style={s.form} onSubmit={handleSubmit}>
          <div style={s.body}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Full Name <span style={s.asterisk}>*</span></label>
              <input
                style={s.figmaInput}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>UCI Email <span style={s.asterisk}>*</span></label>
              <input
                style={s.figmaInput}
                type="email"
                placeholder="you@uci.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Year + Role Interest side by side */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ ...s.fieldGroup, flex: 1 }}>
                <label style={s.label}>Year <span style={s.asterisk}>*</span></label>
                <div style={s.figmaSelect}>
                  <select
                    style={{ ...s.select, color: quarter ? '#1a1a1a' : '#aaa' }}
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select standing...
                    </option>
                    <option>Freshman</option>
                    <option>Sophomore</option>
                    <option>Junior</option>
                    <option>Senior</option>
                  </select>
                  <ChevronDown size={14} color="#555" style={s.chevron} />
                </div>
              </div>
              <div style={{ ...s.fieldGroup, flex: 1 }}>
                <label style={s.label}>Role Interest <span style={s.asterisk}>*</span></label>
                <div style={s.figmaSelect}>
                  <select
                    style={{ ...s.select, color: role ? '#1a1a1a' : '#aaa' }}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select a role…
                    </option>
                    <option>Design Lead</option>
                    <option>Designer</option>
                  </select>
                  <ChevronDown size={14} color="#555" style={s.chevron} />
                </div>
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Take-Home URL <span style={s.asterisk}>*</span></label>
              <input
                style={s.figmaInput}
                type="url"
                placeholder="Make sure Figma link is editable!"
                value={takeHome}
                onChange={(e) => setTakeHome(e.target.value)}
                required
              />
            </div>

            <div style={s.fieldGroup}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <label style={s.label}>
                  Why do you want to join this program? <span style={s.asterisk}>*</span>
                </label>
                <span style={s.charCount}>{about.length}/160</span>
              </div>
              <textarea
                style={s.figmaTextarea}
                placeholder="Anything you'd like to share…"
                value={about}
                maxLength={160}
                rows={4}
                onChange={(e) => setAbout(e.target.value)}
                required
              />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>(Optional) Portfolio URL</label>
              <input
                style={s.figmaInput}
                type="url"
                placeholder="https://yourportfolio.com"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />
            </div>

            <div style={s.checkRow}>
              <div
                style={{ ...s.checkBox, ...(confirmed ? s.checkBoxChecked : {}) }}
                onClick={() => {
                  setConfirmed(c => {
                    if (c) { setPrevRole(''); setPrevQuarter(''); }
                    return !c;
                  });
                }}
              >
                {confirmed && <Check size={11} strokeWidth={3} color="#fff" />}
              </div>
              <span style={{ ...s.checkLabel, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                I have participated in Design @ UCI Project Teams before as a
                <span style={s.inlineSelectWrap}>
                  <select
                    style={{ ...s.inlineSelect, color: prevRole ? '#1a1a1a' : '#aaa' }}
                    value={prevRole}
                    onChange={e => setPrevRole(e.target.value)}
                    required={confirmed}
                    disabled={!confirmed}
                  >
                    <option value="" disabled={confirmed}>role</option>
                    <option>Project Lead</option>
                    <option>Designer</option>
                  </select>
                  <ChevronDown size={11} color="#555" style={s.inlineChevron} />
                </span>
                for
                <span style={s.inlineSelectWrap}>
                  <select
                    style={{ ...s.inlineSelect, color: prevQuarter ? '#1a1a1a' : '#aaa' }}
                    value={prevQuarter}
                    onChange={e => setPrevQuarter(e.target.value)}
                    required={confirmed}
                    disabled={!confirmed}
                  >
                    <option value="" disabled={confirmed}>quarter</option>
                    <option>Spring 2026</option>
                    <option>Winter 2026</option>
                    <option>Fall 2025</option>
                    <option>Spring 2025</option>
                    <option>Winter 2025</option>
                    <option>Fall 2024</option>
                    <option>Spring 2024</option>
                    <option>Winter 2024</option>
                    <option>Fall 2023</option>
                    <option>Spring 2023</option>
                    <option>Winter 2023</option>
                    <option>Fall 2022</option>
                  </select>
                  <ChevronDown size={11} color="#555" style={s.inlineChevron} />
                </span>
                .
              </span>
            </div>
          </div>

          <div style={s.hairline} />

          {/* Footer */}
          <div style={s.footer}>
            {submitError && (
              <span style={s.errorText}>{submitError}</span>
            )}
            <div style={s.footerActions}>
              <button
                type="button"
                style={s.cancelBtn}
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  ...s.continueBtn,
                  ...(status === "sent" ? s.continueSent : {}),
                }}
                disabled={status !== "idle"}
              >
                {status === "idle" && "Submit"}
                {status === "sending" && (
                  <span style={s.btnContent}>
                    <Loader2 size={13} style={s.spinner} /> Sending…
                  </span>
                )}
                {status === "sent" && (
                  <span style={s.btnContent}>
                    <Check size={13} strokeWidth={3} /> Sent!
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Timeline — right column */}
      <FigmaTimeline />
      </div>{/* end layout */}

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input::placeholder,textarea::placeholder { color: #b0b0b0; }
        input:focus,textarea:focus,select:focus { outline: none; }
        select { appearance: none; -webkit-appearance: none; }
      `}</style>
    </div>
  );
}

const s = {
  page: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '-apple-system, "Inter", "Segoe UI", system-ui, sans-serif',
    padding: "5rem 2rem 3rem",
    boxSizing: "border-box",
  },
  layout: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "flex-start",
    gap: 120,
    width: "100%",
    maxWidth: 1150,
    justifyContent: "center",
  },
  bg: {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  bgOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.1)",
    zIndex: 1,
  },
  back: {
    position: "fixed",
    top: "1.25rem",
    left: "1.25rem",
    zIndex: 10,
    background: "none",
    border: "none",
    color: "#000000",
    fontSize: 13,
    fontFamily: "inherit",
    padding: 0,
    cursor: "pointer",
    opacity: 0.85,
  },
  /* ── Card ── */
  card: {
    position: "relative",
    background: "#ffffff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 800,
    boxShadow: "0 8px 40px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)",
    overflow: "visible",
    paddingTop: 48,
  },
  faceWrap: {
    position: "absolute",
    top: -40,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 3,
    filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.2))",
  },
  /* ── Title bar ── */
  titleBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px 16px",
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1a1a",
    letterSpacing: "-0.01em",
    flex: 1,
    textAlign: "center",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    color: "#1a1a1a",
  },
  hairline: {
    height: 1,
    background: "#e6e6e6",
    margin: "0",
  },
  /* ── Form body ── */
  form: { display: "flex", flexDirection: "column" },
  body: {
    padding: "20px 20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  bodyText: {
    margin: 0,
    fontSize: 13,
    color: "#1a1a1a",
    lineHeight: 1.2,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  figmaInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    background: "#F5F5F5",
    border: "1px solid #e0e0e0",
    borderRadius: 6,
    fontSize: 13,
    color: "#1a1a1a",
    fontFamily: "inherit",
    outline: "none",
  },
  figmaTextarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    background: "#F5F5F5",
    border: "1px solid #e0e0e0",
    borderRadius: 6,
    fontSize: 13,
    color: "#1a1a1a",
    fontFamily: "inherit",
    outline: "none",
    resize: "none",
    lineHeight: 1.2,
  },
  asterisk: {
    color: '#0D9AFF',
    fontWeight: 600,
  },
  charCount: {
    textAlign: "right",
    fontSize: 11,
    color: "#999",
    marginTop: -2,
  },
  supportText: {
    margin: "4px 0 0",
    fontSize: 12,
    color: "#999",
    lineHeight: 1.2,
  },
  /* ── Figma-style select ── */
  figmaSelect: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
    paddingLeft: '10px'
  },
  selectIcon: {
    flexShrink: 0,
    margin: "0 10px 0 10px",
    pointerEvents: "none",
    borderRadius: 4,
  },
  select: {
    flex: 1,
    boxSizing: "border-box",
    padding: "10px 32px 10px 0",
    background: "transparent",
    border: "none",
    fontSize: 13,
    color: "#1a1a1a",
    fontFamily: "inherit",
    cursor: "pointer",
    outline: "none",
  },
  chevron: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    flexShrink: 0,
  },
  /* ── Checkbox row ── */
  checkRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 15,
    marginBottom: 10,
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    border: "1.5px solid #c0c0c0",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer"
  },
  checkBoxChecked: {
    background: "#0D9AFF",
    borderColor: "#0D9AFF",
  },
  checkLabel: {
    fontSize: 13,
    color: "#1a1a1a",
    lineHeight: 0.3,
  },
  inlineSelectWrap: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
  },
  inlineSelect: {
    appearance: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    borderBottom: '1.5px solid #aaa',
    borderRadius: 0,
    fontSize: 13,
    color: '#1a1a1a',
    fontFamily: 'inherit',
    padding: '0 16px 1px 2px',
    cursor: 'pointer',
    outline: 'none',
  },
  inlineChevron: {
    position: 'absolute',
    right: 0,
    pointerEvents: 'none',
  },
  /* ── Footer ── */
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px 16px",
  },
  errorText: {
    fontSize: 12,
    color: "#e53e3e",
  },
  footerActions: {
    display: "flex",
    gap: 8,
  },
  cancelBtn: {
    padding: "8px 18px",
    background: "#fff",
    border: "1px solid #d0d0d0",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: "#1a1a1a",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  continueBtn: {
    padding: "8px 18px",
    background: "#0D9AFF",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "opacity 0.15s",
  },
  continueSent: {
    background: "#0D9AFF",
  },
  btnContent: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  spinner: { animation: "spin 0.8s linear infinite" },
};

import { useState } from "react";
import {
  Send,
  MessagesSquare,
  Star,
  Paintbrush,
  Megaphone,
} from "lucide-react";

const STEP_ICONS = [Send, MessagesSquare, Star, Paintbrush, Megaphone];

const STEPS = [
  {
    phase: "Sept. 20 (Sunday) - Sept. 30 (Wednesday)",
    date: "Application & Take-Home",
    detail: (
      <>
        Submit your application form and Take-Home design challenge via the
        links provided. Make sure all shared links are publicly viewable before
        submitting.
        <strong> Applications are due September 30.</strong>
        <br></br>
        <br></br>
        <strong>Take-Home</strong>
        <br></br>
        Please make a copy of{" "}
        <a
          href="https://www.figma.com/design/fEroag2r9U7IgqfjBrTLdf/-APPLICANT-NAME--Take-Home?node-id=0-1&t=OYut8ojfPJCGzBfi-1"
          style={{
            color: "#0D9AFF",
            textDecoration: "underline",
            textUnderlineOffset: 3,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          this Figma design
        </a>{" "}
        and follow the instructions stated in the file. The take-home should not
        take more than 1 hour to complete. The objective of this exercise is to
        see how you design{" "}
        <strong>
          without pressure, using any tools you'd normally reach for
        </strong>
        , such as AI, inspiration boards, etc. We'll be evaluating your work
        based on standard design principles. Good luck and have fun!
      </>
    ),
  },
  {
    phase: "Oct. 4 (Sunday) - Oct. 9 (Friday)",
    date: "Whiteboarding & Interview",
    detail: (
      <>
        Interview decisions will be released{" "}
        <strong>Saturday, October 3rd.</strong> Selected applicants will be
        invited for a short whiteboarding session and casual interview with
        directors. This is a chance for us to get to know you and for you to
        learn more about the program.
        <strong>
          {" "}
          Final decisions will be released Saturday, October 10th.
        </strong>
      </>
    ),
  },
  {
    phase: "Oct. 12 (Monday)",
    date: "Kickoff & Onboarding",
    detail: (
      <>
        The program starts with a <strong>program-wide kickoff session</strong>,
        where Roblox will announce the program's problem statement. You'll get
        the chance to have{" "}
        <strong>initial meetings with your team and UCI faculty mentor</strong>{" "}
        to get aligned before sprints begins.
        <br></br>
        <br></br>
        <strong>André Van Der Hoek</strong>
        <br></br>
        Professor Hoek is a professor and Associate Dean of Academic Affairs at the Donald Bren School of Information and Computer Sciences.
        <br></br>
        <br></br>
        <strong>Matt Bietz</strong>
        <br></br>
        Professor Bietz is the MHCID Associate Director of Capstone and leads the student capstone experience. 
        
      </>
    ),
  },
  {
    phase: "Oct. 13 (Tuesday) - Nov. 26 (Thursday)",
    date: "Project Scrums & Sprints",
    detail: (
      <>
        Weekly working sessions run throughout the 7-week sprints.{" "}
        <strong>Every Tuesday</strong> is an open session with your UCI grad
        faculty advisor to check in on progress and get feedback.
        <strong> Every Thursday</strong> is your stakeholder meeting with Roblox
        to demo progress and align on next steps, as long as realign on business
        goals.
      </>
    ),
  },
  {
    phase: "Dec. 4 (Friday)",
    date: "Final Presentation & Deliverable",
    detail: (
      <>
        Demo day! Present your finished work in front of{" "}
        <strong>
          the entire program: other teams, faculty, and Roblox stakeholders.
        </strong>{" "}
        Network with everyone in the room, get professional feedback on your
        project, and celebrate your completion!
      </>
    ),
  },
];

const BLUE = "#0D9AFF";
const BLUE_SOFT = "#93c5fd";

export default function FigmaTimeline() {
  const [expanded, setExpanded] = useState(0);

  return (
    <div style={t.root}>
      {STEPS.map((step, i) => {
        const isOpen = expanded === i;
        return (
          <div key={i} style={t.stepWrap}>
            {/* Frame + floating phase label (label is absolutely positioned,
                so it takes no flow space and can't create a gap in the
                connector below) */}
            <div style={t.frameOuter}>
              <div
                style={{
                  ...t.phaseLabel,
                  ...(isOpen ? { fontWeight: 700, color: BLUE } : {}),
                }}
              >
                {step.phase}
              </div>

              {/* Timeline chip — only on the first frame, outside-left */}
              {i === 0 && (
                <div style={t.chip}>
                  <span style={t.chipLabel}>Timeline</span>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <rect
                      x="1"
                      y="1"
                      width="11"
                      height="11"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <path d="M4.5 4L8.5 6.5L4.5 9V4Z" fill="currentColor" />
                  </svg>
                </div>
              )}
              <div
                style={{ ...t.frame, ...(isOpen ? t.frameOpen : {}) }}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div style={t.frameInner}>
                  <div style={t.titleRow}>
                    {(() => {
                      const Icon = STEP_ICONS[i];
                      return (
                        <Icon
                          size={20}
                          strokeWidth={1.6}
                          style={{
                            flexShrink: 0,
                            color: isOpen ? BLUE : "#777",
                          }}
                        />
                      );
                    })()}
                    <span
                      style={{
                        ...t.titleText,
                        ...(isOpen ? t.titleTextOpen : {}),
                      }}
                    >
                      {step.date}
                    </span>
                  </div>
                  {isOpen && <p style={t.detail}>{step.detail}</p>}
                </div>
              </div>
            </div>

            {/* Connector — only between frames. Dot sits first (touching the
                frame above = start of the arrow), then a single shaft runs
                straight down to the arrowhead touching the next frame. */}
            {i < STEPS.length - 1 && (
              <div style={t.connector}>
                <div style={t.connDot} />
                <div style={t.connShaft} />
                <svg
                  width="14"
                  height="12"
                  viewBox="0 0 12 10"
                  style={t.connArrow}
                >
                  <path
                    d="M6 0 L6 7 M2 3.5 L6 7 L10 3.5"
                    stroke={BLUE_SOFT}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const t = {
  root: {
    fontFamily: '-apple-system, "Inter", "Segoe UI", system-ui, sans-serif',
    width: "100%",
    maxWidth: 520,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    paddingTop: 34,
  },

  /* ── Chip — outside-left of first frame ── */
  chip: {
    position: "absolute",
    left: 0,
    top: 0,
    transform: "translateX(-100%)",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "#B9E1FC",
    borderRadius: "10% 0 0 10%",
    boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
    padding: "2px 12px 2px 10px",
    color: "#1a1a1a",
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    zIndex: -1000,
  },
  chipLabel: {
    letterSpacing: "0.01em",
  },

  /* ── Step wrapper ── */
  stepWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },

  /* Wraps the frame so the phase label can float above it without
     consuming layout space (position: relative anchor). */
  frameOuter: {
    position: "relative",
  },

  phaseLabel: {
    position: "absolute",
    bottom: "100%",
    left: 2,
    marginBottom: 0,
    fontSize: 12,
    color: "#434343",
    fontWeight: 400,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  },

  /* ── Frame card ── */
  frame: {
    background: "#fff",
    borderLeft: `6px solid #777777`,
    boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
    cursor: "pointer",
    transition: "box-shadow 0.15s",
    boxSizing: "border-box",
  },
  frameOpen: {
    boxShadow: `0 0 0 1.5px ${BLUE}, 0 6px 16px rgba(13,154,255,0.2)`,
    borderLeft: `6px solid ${BLUE}`,
  },

  frameInner: {
    display: "flex",
    flexDirection: "column",
    padding: "14px 18px",
    boxSizing: "border-box",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  titleText: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: 400,
    lineHeight: 1.3,
  },
  titleTextOpen: {
    // weight-only emphasis when open — size stays fixed
    fontWeight: 700,
    color: `${BLUE}`,
  },
  detail: {
    margin: 0,
    marginTop: 0,
    // aligns with the title's left edge: thumb width (36) + row gap (14)
    marginLeft: 32,
    fontSize: 13,
    color: "#333",
    lineHeight: 1.6,
  },

  /* ── Connector ──
     No leading line before the dot: the dot sits flush against the frame
     above it, so it visually reads as the *start* of the arrow. A single
     shaft then runs down to the arrowhead, which sits flush against the
     next frame (no phase label in between anymore, so no gap). */
  connector: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    position: "relative",
    zIndex: 1,
    lineHeight: 0,
    fontSize: 0,
  },
  connDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    border: `1.5px solid ${BLUE_SOFT}`,
    background: "#fff",
    flexShrink: 0,
  },
  connShaft: {
    width: 1.5,
    height: 34,
    background: BLUE_SOFT,
    flexShrink: 0,
  },
  connArrow: {
    display: "block",
    flexShrink: 0,
  },
};

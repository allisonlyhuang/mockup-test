import { useRef } from 'react';
import blueFace from '../assets/aboutus/blue_face.svg';
import VerticalSlider from '../components/VerticalSlider';
import ArrowDrawOn from '../components/ArrowDrawOn';

export default function AboutUs() {
  const arrowRef = useRef(null);

  return (
    <section id="about-us" style={styles.section}>
      {/* Left column */}
      <div style={styles.left}>

        {/* Heading */}
        <div style={styles.headingRow}>
          <img src={blueFace} alt="" style={styles.faceIcon} draggable="false" />
          <h1 style={styles.heading}>about us</h1>
        </div>

        {/* Body copy */}
        <div style={styles.body}>
          <p style={styles.para}>
            Launched in Fall 2026, <strong>MockUp at Design @ UCI</strong> empowers
            emerging designers by connecting UC Irvine students with real-world
            opportunities to collaborate with companies, startups, and brands.
          </p>

          <p style={styles.para}>
            Our mission is to <strong>bridge the gap</strong> between education and
            industry through meaningful client partnerships, giving students the
            experience, mentorship, and creative challenges needed to build
            professional portfolios, develop their skills, and make a lasting impact
            through design.
          </p>

          <div style={styles.spacer} />

          <p style={styles.para}>
            Starting with our 9-week program with <strong>Roblox</strong>, MockUp will
            have unique opportunities open every Fall and Spring quarter. Keep an eye
            out weeks 0–1 for opportunities to get involved, don't miss our applications!
          </p>

          <p style={{ ...styles.para, fontWeight: 700, marginTop: '1.5rem' }}>
            Check out past opportunities here!
          </p>
        </div>

        {/* Hand-drawn arrow — draws when the arrow itself enters the viewport */}
        <ArrowDrawOn targetRef={arrowRef} threshold={0} rootMargin="0px" style={styles.arrow} />
        {/* invisible sentinel at the arrow's position */}
        <div ref={arrowRef} style={{ height: 0, width: 0 }} />
      </div>

      {/* Right column — browser mockup placeholder */}
      <div style={styles.right}>
        <VerticalSlider />
      </div>
    </section>
  );
}

const styles = {
  section: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 'clamp(3rem, 8vw, 6rem) clamp(2rem, 8vw, 7rem)',
    gap: '4rem',
    boxSizing: 'border-box',
  },

  // ── Left ──
  left: {
    flex: '0 0 auto',
    maxWidth: 450,
    display: 'flex',
    flexDirection: 'column',
  },
  headingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  faceIcon: {
    width: 72,
    height: 72,
    flexShrink: 0,
  },
  heading: {
    fontFamily: "'Fustat', system-ui, sans-serif",
    fontSize: 'clamp(48px, 6vw, 72px)',
    fontWeight: 800,
    color: '#0D9AFF',
    margin: 0,
    lineHeight: 1,
    letterSpacing: '-0.02em',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  para: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 16,
    fontWeight: 400,
    color: '#1a1a1a',
    lineHeight: 1.65,
    margin: 0,
  },
  spacer: {
    height: '1.5rem',
  },
  arrow: {
    width: 'clamp(140px, 20vw, 221px)',
    height: 'auto',
    marginTop: '2.5rem',
    marginLeft: '5rem',
    alignSelf: 'center',
  },

  // ── Right ──
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    minWidth: 0,
    marginTop: '-8rem',
  },
  browser: {
    position: 'relative',
    width: '100%',
    maxWidth: 520,
    borderRadius: 12,
    background: '#fff',
    boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  browserBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    background: '#f3f4f6',
    borderBottom: '1px solid #e5e7eb',
    gap: 10,
  },
  dots: {
    display: 'flex',
    gap: 6,
    flexShrink: 0,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    display: 'inline-block',
  },
  urlBar: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fff',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 12,
    color: '#374151',
  },
  urlIcon: { fontSize: 14, color: '#6b7280' },
  urlText: { flex: 1, fontWeight: 500 },
  navArrows: { color: '#9ca3af', fontSize: 14 },
  urlRight: { width: 100, height: 14, background: '#e5e7eb', borderRadius: 4 },
  browserContent: {
    padding: 16,
    background: '#f9fafb',
    maxHeight: 680,
    overflowY: 'auto',
  },
  scrollbar: {
    position: 'absolute',
    right: 0,
    top: 44,
    bottom: 0,
    width: 6,
    background: '#f3f4f6',
  },
  scrollThumb: {
    width: '100%',
    height: 80,
    background: '#d1d5db',
    borderRadius: 3,
    marginTop: 8,
  },

  // Card 1 — Avision
  card: {
    background: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    border: '1px solid #e5e7eb',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: '1px solid #f3f4f6',
  },
  cardLogo: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1a56db',
  },
  cardNav: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  cardNavItem: {
    fontSize: 11,
    color: '#374151',
  },
  supportBtn: {
    background: '#1a56db',
    color: '#fff',
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 5,
    fontWeight: 600,
  },
  cardHero: {
    padding: '28px 24px 24px',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
    textAlign: 'center',
  },
  cardHeroTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#111827',
    margin: '0 0 12px',
    lineHeight: 1.2,
  },
  cardHeroSub: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 1.5,
    margin: '0 0 16px',
    maxWidth: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cardBtns: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
  },
  cardBtnPrimary: {
    background: '#1a56db',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '7px 14px',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
  },
  cardBtnSecondary: {
    background: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: '7px 14px',
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
  },

  // Card 2 — RCBA
  card2Header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  card2Logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  card2LogoIcon: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '2px solid #c9a84c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: '#c9a84c',
  },
  card2OrgName: {
    fontSize: 10,
    fontWeight: 700,
    color: '#c9a84c',
    letterSpacing: '0.1em',
  },
  card2Nav: {
    display: 'flex',
    gap: 10,
  },
  card2NavItem: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  card2Body: {
    display: 'flex',
    alignItems: 'stretch',
  },
  card2Text: {
    flex: 1,
    padding: '20px 16px',
  },
  card2Title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 8px',
    lineHeight: 1.3,
  },
  card2Sub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.5,
    margin: '0 0 14px',
  },
  card2Btns: {
    display: 'flex',
    gap: 8,
  },
  card2BtnPrimary: {
    background: '#fff',
    color: '#0d1b3e',
    border: 'none',
    borderRadius: 5,
    padding: '5px 14px',
    fontSize: 10,
    fontWeight: 600,
    cursor: 'pointer',
  },
  card2BtnSecondary: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 5,
    padding: '5px 14px',
    fontSize: 10,
    cursor: 'pointer',
  },
  card2Photos: {
    width: 140,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 2,
    flexShrink: 0,
  },
  card2Photo: {
    background: 'rgba(255,255,255,0.15)',
    aspectRatio: '1',
  },
};

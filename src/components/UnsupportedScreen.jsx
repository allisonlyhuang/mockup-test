import topLogo from '../assets/top_logo.svg';

export default function UnsupportedScreen() {
  return (
    <div style={s.overlay}>
      <div style={s.card}>
        <img src={topLogo} alt="mockup logo" style={s.logo} />
        <div style={s.divider} />
        <p style={s.heading}>Desktop Only</p>
        <p style={s.body}>
          This experience is designed for larger screens.
          Please visit on a desktop or laptop for the full experience.
        </p>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    zIndex: 9999,
    fontFamily: '-apple-system, "Inter", "Segoe UI", system-ui, sans-serif',
    padding: '2rem',
    boxSizing: 'border-box',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    maxWidth: 320,
    width: '100%',
    textAlign: 'center',
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  divider: {
    width: '100%',
    height: 1,
    background: '#e5e5e5',
  },
  heading: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: '#1a1a1a',
    letterSpacing: '-0.01em',
  },
  body: {
    margin: 0,
    fontSize: 14,
    color: '#555',
    lineHeight: 1.6,
  },
};

import { useNavigate } from 'react-router-dom';
import topLogo from '../assets/top_logo.svg';

export default function Apply() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => navigate('/')}>
        ← Back
      </button>
      <img src={topLogo} alt="mockup logo" style={styles.logo} />
      <h1 style={styles.heading}>Apply to mockup</h1>
      <p style={styles.sub}>Applications open Fall and Spring quarters.</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '2rem',
  },
  back: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    color: '#555',
    fontFamily: 'inherit',
    padding: '0.3rem 0.5rem',
    borderRadius: 5,
  },
  logo: {
    width: 120,
    marginBottom: '2rem',
  },
  heading: {
    fontSize: 32,
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 0.5rem',
  },
  sub: {
    fontSize: 15,
    color: '#555',
    margin: 0,
  },
};

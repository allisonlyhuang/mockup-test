import { useState, useEffect } from 'react';
import topLogo from '../assets/top_logo.svg';

const NAV_ITEMS = [
  { label: 'Hero',       id: 'hero' },
  { label: 'About Us',   id: 'about-us' },
  { label: 'Projects',   id: 'projects' },
  { label: 'Join Us',    id: 'join-us' },
];

function CheckIcon({ isActive }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ flexShrink: 0, visibility: isActive ? 'visible' : 'hidden' }}
    >
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Sidebar({ lenis }) {
  const [active, setActive] = useState('hero');

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActive(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={styles.sidebar}>
      <div style={styles.logoWrapper}>
        <img src={topLogo} alt="Logo" style={styles.logo} />
      </div>
      <div style={styles.divider} />
      <ul style={styles.list}>
        {NAV_ITEMS.map(({ label, id }) => {
          const isActive = active === id;
          return (
            <li key={id} style={styles.item}>
              <button
                onClick={() => scrollTo(id)}
                style={isActive ? linkActiveStyle : linkStyle}
              >
                <CheckIcon isActive={isActive} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Contact Us — pinned to bottom */}
      <div style={styles.contactWrapper}>
        <div style={styles.divider} />
        <a href="mailto:" style={styles.contactLink}>Contact Us</a>
      </div>
    </nav>
  );
}

const styles = {
  sidebar: {
    position: 'sticky',
    top: 0,
    height: '100vh',
    width: 160,
    flexShrink: 0,
    alignSelf: 'flex-start',
    padding: '1rem 0.75rem',
    border: '1.387px solid #E5E5E5',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  item: {
    display: 'flex',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.4rem 0.5rem',
    paddingLeft: '0.5rem',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'inherit',
    color: 'var(--text)',
    transition: 'color 0.2s',
    textAlign: 'left',
    width: '100%',
  },
  linkActive: {
    color: 'var(--accent)',
    fontWeight: 600,
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.2rem 0 0.75rem',
  },
  logo: {
    width: '100%',
    maxWidth: 100,
    height: 'auto',
    display: 'block',
  },
  divider: {
    height: '1px',
    background: '#E5E5E5',
    margin: '0 0 0.75rem',
    flexShrink: 0,
  },
  contactWrapper: {
    marginTop: 'auto',
  },
  contactLink: {
    display: 'block',
    fontSize: 13,
    fontFamily: 'inherit',
    fontWeight: 500,
    color: 'var(--text)',
    textDecoration: 'none',
    padding: '0.4rem 0.5rem',
  },
};

const linkStyle       = styles.link;
const linkActiveStyle = { ...styles.link, ...styles.linkActive };

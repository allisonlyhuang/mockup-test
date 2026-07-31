import { useState, useEffect, useRef } from 'react';
import { LinkedInLogoIcon, InstagramLogoIcon, SunIcon } from "@radix-ui/react-icons"
import topLogo from '../assets/top_logo.svg';

const SOCIAL_ITEMS = [
  {
    label: 'Instagram',
    tooltip: '@mockup.uci',
    href: 'https://instagram.com',
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="1.5" y="1.5" width="9" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <circle cx="9" cy="3" r="0.7" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    tooltip: 'mockup at UCI',
    href: 'https://linkedin.com',
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="1" y="1" width="10" height="10" rx="1.8" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <path d="M3.5 5.2V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="3.5" cy="3.5" r="0.7" fill="currentColor"/>
        <path d="M5.5 9V6.8C5.5 5.9 6.8 5.7 6.8 6.8V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.8 6.3V5.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    tooltip: 'mockup@uci.edu',
    href: 'mailto:mockup@uci.edu',
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="1" y="2.5" width="10" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <path d="M1.5 3.5L6 7L10.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const NAV_ITEMS = [
  { label: 'Hero',       id: 'hero' },
  { label: 'About Us',   id: 'about-us' },
  { label: 'Projects',   id: 'projects' },
  { label: 'Join Us',    id: 'join-us' },
];

// ── Figma-style tooltip ───────────────────────────────────────────────────────
function Tooltip({ text, visible }) {
  return (
    <span
      role="tooltip"
      style={{
        position: 'absolute',
        left: 'calc(100% + 10px)',
        top: '50%',
        transform: 'translateY(-50%)',
        background: '#1e1e1e',
        color: '#ffffff',
        fontSize: 11,
        fontFamily: 'inherit',
        fontWeight: 400,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        padding: '4px 8px',
        borderRadius: 4,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.1s ease',
        zIndex: 100,
        lineHeight: 1.4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}
    >
      {text}
      {/* left arrow */}
      <span style={{
        position: 'absolute',
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        borderWidth: 4,
        borderStyle: 'solid',
        borderColor: 'transparent #1e1e1e transparent transparent',
        display: 'block',
        width: 0,
        height: 0,
      }} />
    </span>
  );
}

// ── Nav item with tooltip ─────────────────────────────────────────────────────
function NavItem({ label, id, isActive, onClick }) {
  const [hovered, setHovered]       = useState(false);
  const [tooltipVisible, setTooltip] = useState(false);
  const timerRef                     = useRef(null);

  const showTooltip = () => {
    timerRef.current = setTimeout(() => setTooltip(true), 600);
  };
  const hideTooltip = () => {
    clearTimeout(timerRef.current);
    setTooltip(false);
  };

  return (
    <li style={{ display: 'flex', position: 'relative' }}>
      <button
        onClick={() => { onClick(id); hideTooltip(); }}
        onMouseEnter={() => { setHovered(true);  showTooltip(); }}
        onMouseLeave={() => { setHovered(false); hideTooltip(); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: isActive
            ? 'rgba(13, 154, 255, 0.12)'
            : hovered
            ? 'rgba(0,0,0,0.05)'
            : 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.3rem 0.5rem',
          borderRadius: 5,
          fontSize: 12,
          fontFamily: 'inherit',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? '#0D9AFF' : hovered ? '#111' : '#555',
          transition: 'background 0.15s, color 0.15s',
          textAlign: 'left',
          width: '100%',
          letterSpacing: '0.01em',
          lineHeight: 1.4,
        }}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </button>
      <Tooltip text={`Go to ${label}`} visible={tooltipVisible} />
    </li>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
export default function Sidebar({ lenis }) {
  const [active, setActive] = useState('hero');

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

      {/* Logo */}
      <div style={styles.logoWrapper}>
        <img src={topLogo} alt="mockup logo" style={styles.logo} />
      </div>

      <div style={styles.divider} />

      {/* Pages section — mirrors Figma's "Pages" panel */}
      <div style={styles.sectionHeader}>
        <span style={styles.sectionLabel}>PAGES</span>
      </div>

      <ul style={styles.list}>
        {NAV_ITEMS.map(({ label, id }) => (
          <NavItem
            key={id}
            label={label}
            id={id}
            isActive={active === id}
            onClick={scrollTo}
          />
        ))}
      </ul>

      {/* Layers section — Get in Touch */}
      <div style={{ ...styles.divider, marginTop: '0.7rem' }} />
      <div style={styles.sectionHeader}>
        <span style={styles.sectionLabel}>GET IN TOUCH</span>
      </div>
      <ul style={styles.list}>
        {SOCIAL_ITEMS.map(({ label, tooltip, href, icon }) => (
          <LayerItem key={label} label={label} tooltip={tooltip} href={href} icon={icon} />
        ))}
      </ul>

    </nav>
  );
}

// ── Layer item (social link) ──────────────────────────────────────────────────
function LayerItem({ label, tooltip, href, icon }) {
  const [hovered, setHovered]        = useState(false);
  const [tooltipVisible, setTooltip] = useState(false);
  const timerRef                     = useRef(null);

  return (
    <li style={{ display: 'flex', position: 'relative' }}>
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        onMouseEnter={() => {
          setHovered(true);
          timerRef.current = setTimeout(() => setTooltip(true), 600);
        }}
        onMouseLeave={() => {
          setHovered(false);
          clearTimeout(timerRef.current);
          setTooltip(false);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: 12,
          fontFamily: 'inherit',
          fontWeight: 400,
          color: hovered ? '#111' : '#555',
          textDecoration: 'none',
          padding: '0.3rem 0.5rem',
          borderRadius: 5,
          background: hovered ? 'rgba(0,0,0,0.05)' : 'none',
          transition: 'background 0.15s, color 0.15s',
          letterSpacing: '0.01em',
          lineHeight: 1.4,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ flexShrink: 0, opacity: hovered ? 0.9 : 0.45, display: 'flex' }}>
          {icon}
        </span>
        {label}
      </a>
      <Tooltip text={tooltip} visible={tooltipVisible} />
    </li>
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
    padding: '0.85rem 0.6rem',
    borderRight: '1px solid #e5e5e5',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    overflow: 'visible',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.1rem 0 0.65rem',
  },
  logo: {
    width: '100%',
    maxWidth: 96,
    height: 'auto',
    display: 'block',
  },
  divider: {
    height: '1px',
    background: '#e5e5e5',
    margin: '0 0 0.6rem',
    flexShrink: 0,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 0.5rem 0.35rem',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: '#aaa',
    fontFamily: 'inherit',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1rem',
  },
};

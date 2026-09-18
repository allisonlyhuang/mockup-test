import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  EnvelopeClosedIcon,
  FileTextIcon,
  InstagramLogoIcon,
} from '@radix-ui/react-icons';
import topLogo from '../assets/top_logo.svg';

const SOCIAL_ITEMS = [
  {
    label: 'Instagram',
    tooltip: '@mockup_dauci',
    href: 'https://instagram.com/mockup_dauci',
    icon: <InstagramLogoIcon width={12} height={12} />,
  },
  {
    label: 'Email',
    tooltip: 'design+mockup@uci.edu',
    href: 'mailto:design+mockup@uci.edu',
    icon: <EnvelopeClosedIcon width={12} height={12} />,
  },
  {
    label: 'Apply',
    tooltip: 'Apply to Mockup',
    href: '/apply',
    icon: <FileTextIcon width={12} height={12} />,
  },
];

const NAV_ITEMS = [
  { label: 'Welcome',             id: 'hero' },
  { label: 'About Us',         id: 'about-us' },
  { label: 'Mission',          id: 'mission' },
  { label: 'Values',           id: 'values' },
  { label: 'Projects',         id: 'projects' },
  { label: 'Build With Us',          id: 'build-with-us' },
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

function useTooltip() {
  const [hovered, setHovered] = useState(false);
  const [tooltipVisible, setTooltip] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const showTooltip = () => {
    timerRef.current = setTimeout(() => setTooltip(true), 600);
  };

  const hideTooltip = () => {
    clearTimeout(timerRef.current);
    setTooltip(false);
  };

  return { hovered, setHovered, tooltipVisible, showTooltip, hideTooltip };
}

// ── Nav item with tooltip ─────────────────────────────────────────────────────
function NavItem({ label, id, isActive, onClick }) {
  const { hovered, setHovered, tooltipVisible, showTooltip, hideTooltip } = useTooltip();

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
export default function Sidebar({ lenisRef }) {
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
    const lenis = lenisRef?.current;
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

      {/* Spacer pushes Apply tab to the very bottom */}
      <div style={{ flex: 1 }} />

      {/* Apply tab — pinned to bottom of sidebar */}
      <div style={styles.divider} />
      <a
        href="https://designatuci.com"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.applyTab}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(13,154,255,0.12)';
          e.currentTarget.style.color = '#0D9AFF';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#555';
        }}
      >Design at UCI
      </a>

    </nav>
  );
}

// ── Layer item (social link) ──────────────────────────────────────────────────
function LayerItem({ label, tooltip, href, icon }) {
  const { hovered, setHovered, tooltipVisible, showTooltip, hideTooltip } = useTooltip();
  const isMailto = href.startsWith('mailto:');

  const itemStyle = {
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
  };

  const eventHandlers = {
    onMouseEnter: () => { setHovered(true); showTooltip(); },
    onMouseLeave: () => { setHovered(false); hideTooltip(); },
  };

  const content = (
    <>
      <span style={{ flexShrink: 0, opacity: hovered ? 0.9 : 0.45, display: 'flex' }}>
        {icon}
      </span>
      {label}
    </>
  );

  return (
    <li style={{ display: 'flex', position: 'relative' }}>
      {isMailto ? (
        <button
          type="button"
          onClick={() => {
            const email = href.slice('mailto:'.length);
            navigator.clipboard.writeText(email).then(() => alert(`Copied: ${email}`));
          }}
          {...eventHandlers}
          style={{ ...itemStyle, border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          {content}
        </button>
      ) : href.startsWith('/') ? (
        <Link to={href} {...eventHandlers} style={itemStyle}>
          {content}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" {...eventHandlers} style={itemStyle}>
          {content}
        </a>
      )}
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
  applyTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    borderRadius: 5,
    fontSize: 12,
    fontFamily: 'inherit',
    fontWeight: 500,
    color: '#555',
    textDecoration: 'none',
    textAlign: 'center',
    lineHeight: 1.3,
    background: 'transparent',
    transition: 'background 0.15s, color 0.15s',
    width: '100%',
    boxSizing: 'border-box',
  },
};

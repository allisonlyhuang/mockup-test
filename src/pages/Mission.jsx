import { useRef } from 'react';
import selectedBox from '../assets/mission/selected_box.svg';
import VectorDrawOn from '../components/VectorDrawOn';

export default function Mission() {
  const contentRef = useRef(null);

  return (
    <section id="mission" style={styles.section}>
      <div style={styles.vectorWrap}>
        <VectorDrawOn targetRef={contentRef} threshold={0.3} />
      </div>

      <div ref={contentRef} style={styles.content}>
        <h1 className="page-heading">our mission</h1>

        <div style={styles.card}>
          <img src={selectedBox} alt="" style={styles.boxDecor} draggable="false" />
          <p style={styles.body}>
            bridge the gap between{' '}
            <span style={styles.highlight}>student experience and the real world</span>{' '}
            by partnering with industry leaders to create meaningful opportunities
            for students to gain practical experience, build connections, and
            prepare for their future careers.
          </p>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(3rem, 8vw, 6rem) clamp(2rem, 8vw, 7rem)',
    boxSizing: 'border-box',
    overflow: 'hidden',
    userSelect: 'none',
  },

  vectorWrap: {
    position: 'relative',
    zIndex: 1,
    width: 'clamp(260px, 40vw, 460px)',
    height: 'auto',
    marginBottom: '-2rem',
    marginLeft: '-5rem',
    alignSelf: 'flex-start',
    pointerEvents: 'none',
  },

  content: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 760,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginTop: '7rem',
    marginLeft: '-5rem',
  },

  card: {
    position: 'relative',
    padding: '2rem 2.25rem',
    marginTop: '-1rem',
  },

  boxDecor: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    userSelect: 'none',
  },

  body: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 'clamp(15px, 1.6vw, 18px)',
    fontWeight: 400,
    color: '#1a1a1a',
    lineHeight: 1.7,
    margin: 0,
    position: 'relative',
    zIndex: 1,
    userSelect: 'none',
  },

  highlight: {
    background: '#cce8ff',
    color: '#0D9AFF',
    borderRadius: 4,
    padding: '1px 6px',
    fontWeight: 500,
  },
};

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    id: 'dedication',
    word: 'dedication',
    pronunciation: '/ˌdedəˈkāSHən/',
    definition: (
      <>
        We bring the same commitment to every client partnership, carrying
        projects through from kickoff to final deliverable and giving students
        the{' '}
        <mark
          style={{
            background: 'rgba(13, 153, 255, 0.18)',
            borderRadius: 3,
            padding: '0 2px',
          }}
        >
          consistency that builds lasting trust
        </mark>{' '}
        with the companies they work with. We believe great work comes from showing up, following through,
        and taking pride in every step of the process. Because when students know they can count on us, our
        industry partners can too.
      </>
    ),
  },
  {
    id: 'creativity',
    word: 'creativity',
    pronunciation: '/ˌkrēāˈtivədē/',
    definition: (
      <>
        We encourage students to bring{' '}
        <mark
          style={{
            background: 'rgba(13, 153, 255, 0.18)',
            borderRadius: 3,
            padding: '0 2px',
          }}
        >
          fresh perspectives and bold ideas
        </mark>{' '}
        to every project, turning real-world challenges into opportunities for
        original thinking and meaningful design. We believe the best ideas come from
        curiosity, experimentation, and the freedom to think differently. There’s no
        one right way to solve a problem, so we give students the space to explore, create,
        and make their ideas come to life.
      </>
    ),
  },
  {
    id: 'community',
    word: 'community',
    pronunciation: '/kəˈmyo͞onədē/',
    definition: (
      <>
        MockUp is built on the belief that students and companies grow stronger
        together — fostering{' '}
        <mark
          style={{
            background: 'rgba(13, 153, 255, 0.18)',
            borderRadius: 3,
            padding: '0 2px',
          }}
        >
          genuine relationships that extend beyond a single project
        </mark>{' '}
        and into lasting professional networks. We create a space where
        students can learn, companies can discover, and everyone has something to bring to the table. Because the
        best opportunities don’t just connect people, but bring them together.
      </>
    ),
  },
];

export default function Values() {
  const [active, setActive] = useState('dedication');
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const isFirstRender = useRef(true);

  // Animate right panel in whenever active changes (skip very first render — scroll-in handles that)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const el = rightRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [active]);

  const handleTabClick = (id) => {
    const el = rightRef.current;
    if (!el) { setActive(id); return; }
    gsap.to(el, {
      opacity: 0,
      y: -12,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => setActive(id),
    });
  };

  useGSAP(() => {
    const els = [headingRef.current, subtitleRef.current, leftRef.current, rightRef.current];

    gsap.set(els, { opacity: 0, y: 28 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
        });
      },
    });
  }, { scope: sectionRef });

  const activeValue = VALUES.find((v) => v.id === active);
  const otherValues = VALUES.filter((v) => v.id !== active);

  return (
    <section
      id="values"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(3rem, 8vw, 6rem) clamp(2rem, 8vw, 7rem)',
        boxSizing: 'border-box',
      }}
    >
      {/* Heading */}
      <h1 ref={headingRef} className="page-heading" style={{ marginBottom: '1.25rem' }}>
        our values
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 16,
            fontWeight: 400,
            color: '#1a1a1a',
            lineHeight: 1.65,
            marginBottom: '3rem',
        }}
      >
        The best experiences happen when you get out of the classroom and into
        the real world. That's why MockUp brings students, companies, and big
        ideas together to create opportunities that are exciting, meaningful,
        and actually useful. Our values shape how we show up, make connections,
        and turn "what if?" into "let's do it."
      </p>

      {/* Dictionary layout */}
      <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', width: '100%', minHeight: 320 }}>
        {/* Left column — search UI */}
        <div ref={leftRef} style={{ width: 300, flexShrink: 0 }}>
          {/* Active tab — search bar style */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1.5px solid black',
              borderRadius: 0,
              padding: '10px 14px',
              marginBottom: 10,
              background: 'transparent',
              cursor: 'default',
            }}
          >
            <span
              style={{
                fontSize: 17,
                fontStyle: 'normal',
                fontWeight: 300,
                color: '#000000',
                letterSpacing: '1.359px',
                lineHeight: 1,
              }}
            >
              {activeValue.word}
            </span>
            <SearchIcon />
          </div>

          {/* Other tabs */}
          <div
            style={{
              border: '1.5px solid black',
              borderRadius: 0,
              overflow: 'hidden',
            }}
          >
            {otherValues.map((v, i) => (
              <button
                key={v.id}
                onClick={() => handleTabClick(v.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '11px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderTop: i > 0 ? '1px solid var(--text-h)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 17,
                  fontStyle: 'normal',
                  fontWeight: 300,
                  color: '#000000',
                  letterSpacing: '1.359px',
                  lineHeight: 1,
                  fontFamily: 'var(--sans)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--text-h)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <SearchIcon muted />
                {v.word}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical divider */}
        <div
          style={{
            width: 1,
            background: 'black',
            margin: '0 48px',
            flexShrink: 0,
          }}
        />

        {/* Right column — definition */}
        <div ref={rightRef} style={{ flex: 1, paddingTop: 0, paddingRight: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'black',
              marginBottom: 4,
              letterSpacing: '-0.3px',
            }}
          >
            {activeValue.word}
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'var(--text)',
              marginBottom: 20,
              fontStyle: 'normal',
            }}
          >
            {activeValue.pronunciation}
          </div>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: 'black',
              margin: 0,
            }}
          >
            {activeValue.definition}
          </p>
        </div>

        {/* Right-edge vertical line */}
        <div
          style={{
            width: 1,
            background: 'black',
            flexShrink: 0,
          }}
        />
      </div>
    </section>
  );
}

function SearchIcon({ muted = false }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, opacity: muted ? 0.45 : 1 }}
    >
      <circle
        cx="6.5"
        cy="6.5"
        r="4.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="9.85355"
        y1="9.85355"
        x2="13.1464"
        y2="13.1464"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

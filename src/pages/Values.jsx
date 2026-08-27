import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Values.css';

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
        <mark>consistency that builds lasting trust</mark>{' '}
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
        <mark>fresh perspectives and bold ideas</mark>{' '}
        to every project, turning real-world challenges into opportunities for
        original thinking and meaningful design. We believe the best ideas come from
        curiosity, experimentation, and the freedom to think differently. There's no
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
        <mark>genuine relationships that extend beyond a single project</mark>{' '}
        and into lasting professional networks. We create a space where
        students can learn, companies can discover, and everyone has something to bring to the table. Because the
        best opportunities don't just connect people, but bring them together.
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

  // Animate right panel in on tab change (skip first render — scroll-in handles that)
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
    <section id="values" ref={sectionRef} className="values-section">

      <h1 ref={headingRef} className="page-heading" style={{ marginBottom: '1.25rem' }}>
        our values
      </h1>

      <p ref={subtitleRef} className="values-subtitle">
        The best experiences happen when you get out of the classroom and into
        the real world. That's why MockUp brings students, companies, and big
        ideas together to create opportunities that are exciting, meaningful,
        and actually useful. Our values shape how we show up, make connections,
        and turn "what if?" into "let's do it."
      </p>

      <div className="values-dict">

        {/* Left column — search UI */}
        <div ref={leftRef} className="values-dict-left">
          {/* Active tab */}
          <div className="values-dict-active">
            <span className="values-dict-active-word">{activeValue.word}</span>
            <SearchIcon />
          </div>

          {/* Other tabs */}
          <div className="values-dict-list">
            {otherValues.map((v) => (
              <button
                key={v.id}
                className="values-dict-btn"
                onClick={() => handleTabClick(v.id)}
              >
                <SearchIcon muted />
                {v.word}
              </button>
            ))}
          </div>
        </div>

        {/* Left divider */}
        <div className="values-dict-divider" />

        {/* Right column — definition */}
        <div ref={rightRef} className="values-dict-right">
          <div className="values-dict-word">{activeValue.word}</div>
          <div className="values-dict-pronunciation">{activeValue.pronunciation}</div>
          <p className="values-dict-definition">{activeValue.definition}</p>
        </div>

        {/* Right-edge line */}
        <div className="values-dict-edge" />

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
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <line
        x1="9.85355" y1="9.85355" x2="13.1464" y2="13.1464"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  );
}

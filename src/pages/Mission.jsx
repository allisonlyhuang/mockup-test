import { useRef } from 'react';
import './Mission.css';
import selectedBox from '../assets/mission/selected_box.svg';
import VectorDrawOn from '../components/VectorDrawOn';
import CommentPin from '../components/CommentPin';

export default function Mission() {
  const contentRef = useRef(null);

  return (
    <section id="mission" className="mission-section">
      <div className="mission-vector-wrap">
        <VectorDrawOn targetRef={contentRef} threshold={0.3} />
      </div>

      <div ref={contentRef} className="mission-content">
        <h1 className="page-heading">our mission</h1>

        <div className="mission-card">
          <img src={selectedBox} alt="" className="mission-box-decor" draggable="false" />
          <p className="mission-body">
            bridge the gap between{' '}
            <span className="mission-highlight">student experience and the real world</span>{' '}
            by partnering with industry leaders to create meaningful opportunities
            for students to gain practical experience, build connections, and
            prepare for their future careers.
          </p>
        </div>
      </div>

      <CommentPin style={{ bottom: '5rem', left: '11rem' }} author="Queena Liu" comment="Mockup is a program I wish I had when I was starting out, so I’m really glad we have a program like this now to help students gain real-world experience and build confidence working professionally." entranceDelay={0} />
      <CommentPin style={{ top: '10rem', left: '6rem' }} author="Evie Ngo" comment="Love this direction!" entranceDelay={0.12} />
      <CommentPin style={{ top: '18rem', right: '24rem' }} author="Allison Huang" comment="I truly love the community at Design@UCI and am excited for an opportunity to give back to a club that has shown me so much love." entranceDelay={0.24} />
    </section>
  );
}

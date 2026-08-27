import { useRef } from 'react';
import './Mission.css';
import selectedBox from '../assets/mission/selected_box.svg';
import VectorDrawOn from '../components/VectorDrawOn';

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
    </section>
  );
}

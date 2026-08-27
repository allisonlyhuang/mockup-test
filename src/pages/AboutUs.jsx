import { useRef } from 'react';
import './AboutUs.css';
import blueFace from '../assets/aboutus/blue_face.svg';
import VerticalSlider from '../components/VerticalSlider';
import ArrowDrawOn from '../components/ArrowDrawOn';

export default function AboutUs() {
  const arrowRef = useRef(null);

  return (
    <section id="about-us" className="about-section">
      {/* Left column */}
      <div className="about-left">

        {/* Heading */}
        <div className="about-heading-row">
          <img src={blueFace} alt="" className="about-face-icon" draggable="false" />
          <h1 className="about-heading">about us</h1>
        </div>

        {/* Body copy */}
        <div className="about-body">
          <p className="about-para">
            Launched in Fall 2026, <strong>MockUp at Design @ UCI</strong> empowers
            emerging designers by connecting UC Irvine students with real-world
            opportunities to collaborate with companies, startups, and brands.
          </p>

          <p className="about-para">
            Our mission is to <strong>bridge the gap</strong> between education and
            industry through meaningful client partnerships, giving students the
            experience, mentorship, and creative challenges needed to build
            professional portfolios, develop their skills, and make a lasting impact
            through design.
          </p>

          <div className="about-spacer" />

          <p className="about-para">
            Starting with our 9-week program with <strong>Roblox</strong>, MockUp will
            have unique opportunities open every Fall and Spring quarter. Keep an eye
            out weeks 0–1 for opportunities to get involved, don't miss our applications!
          </p>

          <p className="about-para about-para--bold">
            Check out past opportunities here!
          </p>
        </div>

        {/* Hand-drawn arrow — draws when the arrow itself enters the viewport */}
        <ArrowDrawOn targetRef={arrowRef} threshold={0} rootMargin="0px" className="about-arrow" />
        {/* invisible sentinel at the arrow's position */}
        <div ref={arrowRef} style={{ height: 0, width: 0 }} />
      </div>

      {/* Right column */}
      <div className="about-right">
        <VerticalSlider />
      </div>
    </section>
  );
}

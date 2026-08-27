import './BuildWithUs.css';
import InquiryForm from '../components/InquiryForm';
import { MoveRight } from 'lucide-react';

export default function BuildWithUs() {
  return (
    <section id="build-with-us" className="build-section">
      <div className="build-body">
        <div className="build-left">
          <h1 className="page-heading" style={{ marginBottom: '1.25rem' }}>
            build with us
          </h1>
          <p className="build-subtitle">
            Ready to bring fresh ideas and real design talent to your next project?
            MockUp connects you with <strong>driven UC Irvine students</strong> ready to take on
            meaningful design challenges, from kickoff to final deliverable. Whether
            you're building a brand identity, developing a design system, creating a
            full prototype, or reimagining an existing product, our designers are
            equipped to meet your needs.
            <br /><br />
            Have an idea you want to explore or a vision you're ready to bring to
            life? MockUp gives you the talent, creativity, and support to take your
            project from concept to completion. Send us an inquiry and we'll get back to you!
            <br /><br />
            <strong>Are you a student?</strong> Applications open Fall and Spring.{' '}
            <a href="#" className="build-apply-link">
              Apply here <MoveRight size={13} strokeWidth={2.5} style={{ verticalAlign: 'middle' }} />
            </a>
          </p>
        </div>

        <div className="build-right">
          <InquiryForm />
        </div>
      </div>
    </section>
  );
}

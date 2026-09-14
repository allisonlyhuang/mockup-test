import './Footer.css';
import topLogo from '../assets/top_logo.svg';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div>
          <img
            src={topLogo}
            alt="mockup"
            className="site-footer-brand"
          />
        </div>
        <p className="site-footer-description">
          Student designers building meaningful work with real partners.
        </p>

      </div>
    </footer>
  );
}

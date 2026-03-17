import React from 'react';
import '../styles/footer.css';

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer({ onOpenAuth }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo-icon">
            <div className="logo-square"></div>
          </div>
          <span className="footer-logo-text">GemTalk</span>
          <p>GemTalk is your hub for gemstone news, research updates, and educational articles curated for the Sri Lankan gem community.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><button onClick={() => scrollTo('home')}>About us</button></li>
            <li><button onClick={() => onOpenAuth && onOpenAuth()}>Login | Signup</button></li>
            <li><button onClick={() => scrollTo('article')}>Articles</button></li>
            <li><button onClick={() => scrollTo('research')}>Research</button></li>
          </ul>
          <ul>
            <li><button onClick={() => scrollTo('latest-news')}>News & Events</button></li>
            <li><button onClick={() => scrollTo('contact')}>Contact us</button></li>
            <li><button onClick={() => scrollTo('contact')}>Support</button></li>
          </ul>
        </div>
        <div className="footer-social">
          <p>Follow us</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">in</a>
            <a href="#" aria-label="X">𝕏</a>
            <a href="#" aria-label="TikTok">tt</a>
            <a href="#" aria-label="YouTube">▶</a>
            <a href="#" aria-label="WhatsApp">w</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 GemTalk. All rights reserved.</p>
      </div>
    </footer>
  );
}

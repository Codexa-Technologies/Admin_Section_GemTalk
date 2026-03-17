import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/home.css';

const SLIDES = [
  
  { title: 'Gem Research', desc: 'Discover the world of gemstones through cutting-edge research and expert analysis from leading gemologists worldwide.' },
  { title: 'Latest Articles', desc: 'Stay updated with the latest articles, news, and events in the gemstone industry from our expert contributors.' },
  { title: 'GIA Certified', desc: 'Access certified gemstone information and research backed by internationally recognized gemological institutes.' },
  { title: 'Connect & Learn', desc: 'Join our community of gem enthusiasts, researchers, and professionals to share knowledge and insights.' },
];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&h=500&fit=crop',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&h=500&fit=crop',
  'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=700&h=500&fit=crop',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=700&h=500&fit=crop',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&h=500&fit=crop',
];

const FAQS = [
  { question: 'How do I find gemstone articles?', answer: 'Use the search bar on the homepage or navigate to the Article section to browse all published gemstone articles by category.' },
  { question: 'What types of gemstones are covered?', answer: 'We cover a wide range of gemstones including rubies, sapphires, emeralds, diamonds, and many rare Sri Lankan gems like blue sapphires and cat\'s eye.' },
  { question: 'How can I access research papers?', answer: 'Visit the Research section to browse and download certified research papers from leading gemological institutes worldwide.' },
  { question: 'Are the articles GIA certified?', answer: 'Many of our articles and research papers are backed by GIA and other internationally recognized gemological institutes.' },
  { question: 'How do I contact support?', answer: 'Scroll down to the Contact Us section or click the Learn More button to reach our support team directly.' },
];

const LOGOS = [
  { name: 'GJRTI', color: '#4a1a8a' },
  { name: 'NGSB', color: '#c8a000' },
  { name: 'EDB Sri Lanka', color: '#1a5276' },
  { name: 'GIA', color: '#1a1a1a' },
  { name: 'RAPAPORT', color: '#e74c3c' },
  { name: 'GRS', color: '#2c3e50' },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(o => !o)}>
        <span>{faq.question}</span>
        <span className="faq-icon">{open ? '−' : '+'}</span>
      </button>
      <div
        className="faq-answer"
        ref={bodyRef}
        style={{ maxHeight: open ? bodyRef.current?.scrollHeight + 'px' : '0' }}
      >
        <p>{faq.answer}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState('');
  const [newsArticles, setNewsArticles] = useState([]);

  const nextSlide = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleSearch = (e) => {
    e.preventDefault();
    const el = document.getElementById('article');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/public/articles?type=news&limit=20&sortField=createdAt&sortOrder=desc')
      .then(r => r.json())
      .then(d => { if (d.success) setNewsArticles(d.articles); })
      .catch(() => {});
  }, []);

  return (
    <main>
      {/* Hero Slider */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="hero-shape s1" />
          <div className="hero-shape s2" />
          <div className="hero-shape s3" />
        </div>
        <div className="hero-inner">
          {/* Left */}
          <div className="hero-left">
            <span className="hero-badge">✦ GemTalk Platform</span>
            <h1 key={current} className="hero-title">{SLIDES[current].title}</h1>
            <p key={current + 'p'} className="hero-desc">{SLIDES[current].desc}</p>
            <form className="search-bar" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit">Search →</button>
            </form>
            <div className="hero-dots">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === current ? 'active' : ''}`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          </div>
          {/* Right - Single image */}
          <div className="hero-right">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&h=500&fit=crop"
              alt="Gemstone"
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Help Center */}
      <section className="help-center">
        <div className="help-center-inner">
          <div className="help-card">
            <div className="help-badge">💎 GemTalk Support</div>
            <h2 className="help-heading">Help Center</h2>
            <p className="help-desc">Explore our gemstone knowledge base — from identifying precious stones to understanding certifications. Find answers to your questions about rubies, sapphires, emeralds, and more.</p>
            <button className="btn-learn" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact Support →</button>
          </div>
          <div className="faq-section">
            <h3 className="faq-title">Frequently Asked Questions</h3>
            <div className="faq-list">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} faq={faq} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section id="latest-news" className="latest-news">
        <h2>Latest News</h2>
        <div className="news-marquee">
          <div className="news-track">
            {newsArticles.map((item) => (
              <div key={item._id} className="news-card">
                {item.image
                  ? <img src={item.image} alt={item.title} className="news-card-img" />
                  : <div className="news-card-icon">📄</div>
                }
                <div className="news-body">
                  <p>{item.title}</p>
                  <small className="news-desc">{item.description}</small>
                  <span className="news-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="partners">
        <div className="logos-row">
          {LOGOS.map((logo, i) => (
            <div key={i} className="logo-item" style={{ borderColor: logo.color }}>
              <span style={{ color: logo.color, fontWeight: 700, fontSize: '0.85rem' }}>{logo.name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

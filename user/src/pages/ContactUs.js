import React, { useState } from 'react';
import '../styles/contact.css';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <main className="contact-page">
      <div className="contact-shell">
        <div className="contact-hero">
          <span className="contact-chip">Contact Team</span>
          <h1>Contact Us</h1>
          <p>Have a question about gems, research, or partnerships? Send us a message and our team will get back to you.</p>
        </div>

        <div className="contact-container">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <div className="info-card">
              <span>Email</span>
              <p>info@gemtalk.com</p>
            </div>
            <div className="info-card">
              <span>Phone</span>
              <p>+94 11 234 5678</p>
            </div>
            <div className="info-card">
              <span>Address</span>
              <p>Colombo, Sri Lanka</p>
            </div>
            <div className="contact-note">
              Support hours: Monday - Friday, 9:00 AM to 5:00 PM
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Send a Message</h3>
            <p className="form-subtitle">Tell us what you need and we will respond as soon as possible.</p>
            {sent && <div className="success-msg">Message sent successfully!</div>}
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
            />
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </main>
  );
}

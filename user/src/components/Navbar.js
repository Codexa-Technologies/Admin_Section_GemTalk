import React, { useEffect, useMemo, useState } from 'react';
import '../styles/navbar.css';
import logo from '../assets/login.jpg';

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Navbar({ onOpenAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [user, setUser] = useState(null);

  const readUser = () => {
    try {
      const raw = localStorage.getItem('gemtalk_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const syncUser = () => setUser(readUser());
    syncUser();

    window.addEventListener('storage', syncUser);
    window.addEventListener('gemtalk-auth-changed', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('gemtalk-auth-changed', syncUser);
    };
  }, []);

  const handleNav = (id) => {
    scrollTo(id);
    setActive(id);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('gemtalk_user_token');
    localStorage.removeItem('gemtalk_user');
    window.dispatchEvent(new Event('gemtalk-auth-changed'));
    setUser(null);
    handleNav('home');
  };

  const NAV_ITEMS = useMemo(() => [
    { id: 'home', label: 'Home' },
    { id: 'article', label: 'Article' },
    { id: 'research', label: 'Research' },
    { id: 'contact', label: 'Contact us' },
  ], [user]);

  const openAuthModal = () => {
    setMenuOpen(false);
    if (onOpenAuth) onOpenAuth();
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <img src={logo} alt="GemTalk" className="navbar-logo" onClick={() => handleNav('home')} style={{ cursor: 'pointer' }} />
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {!user && (
            <li>
              <button onClick={openAuthModal}>Login | Signup</button>
            </li>
          )}
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => handleNav(id)}
                className={active === id ? 'nav-active' : ''}
              >
                {label}
              </button>
            </li>
          ))}
          {user && (
            <>
              <li className="nav-user-item">
                <span className="nav-user-chip">{user.name}</span>
              </li>
              <li>
                <button className="nav-logout" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
        {user ? (
          <div className="session-actions">
            <span className="user-chip">Hi, {user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="btn-signin" onClick={openAuthModal}>Sign in | Sign up</button>
        )}
      </div>
    </nav>
  );
}

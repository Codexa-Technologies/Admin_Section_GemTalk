import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';

const pageTitles = {
  '/dashboard':        'Dashboard',
  '/add-article':      'Add Article',
  '/add-news':         'Add Latest News',
  '/add-research':     'Add Research Papers',
  '/manage-articles':  'Manage Articles',
  '/manage-news':      'Manage News',
  '/manage-research':  'Manage Research Papers',
};

const TopBar = () => {
  const [now, setNow] = useState(new Date());
  const location = useLocation();
  const { admin } = useAuth();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = n => String(n).padStart(2, '0');
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const initials = admin?.name
    ? admin.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <header className="topbar">
      <span className="topbar-title">{pageTitles[location.pathname] || 'Dashboard'}</span>
      <div className="topbar-right">
        <div className="topbar-datetime">
          <div className="topbar-time">{timeStr}</div>
          <div className="topbar-date">{dateStr}</div>
        </div>
        <div className="topbar-badge">{initials}</div>
      </div>
    </header>
  );
};

export default TopBar;

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardLogo from '../assets/dashboard.jpg';
import '../styles/components.css';

const icons = {
  dashboard: (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  addArticle: (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  news: (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
      <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>
    </svg>
  ),
  research: (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  manage: (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
    </svg>
  ),
  logout: (
    <svg style={{width:14,height:14,flexShrink:0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const navSections = [
  {
    label: 'Overview',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: icons.dashboard },
    ],
  },
  {
    label: 'Add Content',
    items: [
      { path: '/add-article',  label: 'Add Article',         icon: icons.addArticle },
      { path: '/add-news',     label: 'Add events & news',  icon: icons.news },
      { path: '/add-research', label: 'Add Research Papers', icon: icons.research },
    ],
  },
  {
    label: 'Manage',
    items: [
      { path: '/manage-articles',  label: 'Manage Articles',        icon: icons.manage },
      { path: '/manage-news',      label: 'Manage News',            icon: icons.news },
      { path: '/manage-research',  label: 'Manage Research Papers', icon: icons.research },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const initials = admin?.name
    ? admin.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={dashboardLogo} alt="GemTalk" className="sidebar-brand-logo" />
        <div>
          <div className="sidebar-brand-name">GemTalk</div>
          <div className="sidebar-brand-sub">Admin Portal</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navSections.map(section => (
          <div key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            {section.items.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link${location.pathname === path ? ' active' : ''}`}
              >
                {icon}
                <span className="nav-text">{label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div style={{minWidth:0}}>
            <div className="sidebar-user-name">{admin?.name || 'Admin'}</div>
            <div className="sidebar-user-email">{admin?.email || ''}</div>
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          {icons.logout} Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

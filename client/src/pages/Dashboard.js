import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
} from 'recharts';
import '../styles/dashboard.css';

/* ── Icons ─────────────────────────────────────────── */
const IconArticles = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
);
const IconMonth = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconStorage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconAdd = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const IconList = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const IconNews = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
    <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>
  </svg>
);
const IconResearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

/* ── Custom Tooltip ─────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{label}</div>
        <div className="chart-tooltip-value">{payload[0].value} uploads</div>
      </div>
    );
  }
  return null;
};

/* ── Helpers ────────────────────────────────────────── */
const formatStorage = (bytes) => {
  if (!bytes) return '0 MB';
  const mb = bytes / 1024 / 1024;
  return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(2)} MB`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

/* ── Component ──────────────────────────────────────── */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, admin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats(token);
      if (res.success) setStats(res.stats);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Articles',    value: stats?.totalArticles ?? 0,              icon: <IconArticles />, color: 'teal' },
    { label: 'Latest News',       value: stats?.newsCount ?? 0,                  icon: <IconNews />,     color: 'navy' },
    { label: 'Research Papers',   value: stats?.researchCount ?? 0,              icon: <IconResearch />, color: 'teal' },
    { label: 'Added This Month',  value: stats?.thisMonth ?? 0,                  icon: <IconMonth />,    color: 'navy' },
    { label: 'Total Storage',     value: formatStorage(stats?.totalStorageBytes), icon: <IconStorage />, color: 'teal' },
    { label: 'Last Upload',       value: formatDate(stats?.lastUpload),           icon: <IconClock />,   color: 'navy', small: true },
  ];

  return (
    <div className="dashboard">
      <Toast message={error} type="error" onClose={() => setError('')} />

      {/* Page Header */}
      <div className="page-header">
        <h1>Welcome back, {admin?.name?.split(' ')[0] || 'Admin'}</h1>
        <p>Here is an overview of your knowledge base.</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-row">
        {statCards.map((card) => (
          <div key={card.label} className={`stat-card stat-card--${card.color}`}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-info">
              <div className={`stat-number${card.small ? ' stat-number--sm' : ''}`}>{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-row">
        <button className="quick-action-btn quick-action-btn--primary" onClick={() => navigate('/add-article')}>
          <span className="qa-icon"><IconAdd /></span>
          <div>
            <div className="qa-title">Add Article</div>
            <div className="qa-sub">Upload a general PDF article</div>
          </div>
        </button>
        <button className="quick-action-btn quick-action-btn--news" onClick={() => navigate('/add-news')}>
          <span className="qa-icon"><IconNews /></span>
          <div>
            <div className="qa-title">Add Latest News</div>
            <div className="qa-sub">Publish a news article</div>
          </div>
        </button>
        <button className="quick-action-btn quick-action-btn--research" onClick={() => navigate('/add-research')}>
          <span className="qa-icon"><IconResearch /></span>
          <div>
            <div className="qa-title">Add Research Paper</div>
            <div className="qa-sub">Upload a research paper</div>
          </div>
        </button>
      </div>

      {/* Bottom Row: Chart + Activity */}
      <div className="dashboard-bottom">
        {/* Bar Chart */}
        <div className="card chart-card">
          <div className="card-header">
            <span className="card-title">Uploads per Month</span>
            <span className="card-badge">Last 6 months</span>
          </div>
          <div className="card-body chart-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.monthlyData || []} barSize={28} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8a9bb0' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8a9bb0' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(5,135,138,0.06)' }} />
                <Bar dataKey="uploads" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#05878A" />
                    <stop offset="100%" stopColor="#074E67" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card activity-card">
          <div className="card-header">
            <span className="card-title">Recent Activity</span>
            <span className="card-badge">{stats?.recentArticles?.length || 0} latest</span>
          </div>
          <div className="card-body">
            {stats?.recentArticles?.length > 0 ? (
              <div className="activity-list">
                {stats.recentArticles.map((article, i) => (
                  <div key={article._id} className="activity-item">
                    <div className="activity-line">
                      <div className="activity-dot" />
                      {i < stats.recentArticles.length - 1 && <div className="activity-connector" />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{article.title}</div>
                      <div className="activity-meta">
                        <span>{formatDateTime(article.createdAt)}</span>
                        <span className={`type-badge type-badge--${article.type || 'article'}`}>
                          {article.type === 'research' ? 'Research' : article.type === 'article' ? 'Article' : 'News'}
                        </span>
                        {article.fileSize ? <span className="activity-size">{(article.fileSize / 1024 / 1024).toFixed(2)} MB</span> : null}
                      </div>
                      <div className="activity-user">Uploaded by {admin?.name || 'Admin'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No activity yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

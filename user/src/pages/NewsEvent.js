import React, { useState, useEffect } from 'react';
import '../styles/simple-page.css';

const API = 'http://localhost:5000';

export default function NewsEvent() {
  const [articles, setArticles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [inputVal, setInputVal]   = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/public/articles?type=news&page=${page}&limit=9&search=${encodeURIComponent(search)}`)
      .then(r => r.json())
      .then(d => { if (d.success) { setArticles(d.articles); setPagination(d.pagination); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = e => { e.preventDefault(); setSearch(inputVal); setPage(1); };

  return (
    <main className="simple-page">
      <div className="simple-hero">
        <h1>News & Events</h1>
        <p>Stay updated with the latest news and upcoming events in the gem industry.</p>
        <form className="article-search" style={{ marginTop: 20 }} onSubmit={handleSearch}>
          <input type="text" placeholder="Search news..." value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="simple-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="no-results">No news articles found.</div>
        ) : (
          <div className="content-grid">
            {articles.map(article => (
              <div key={article._id} className="content-card" style={{ textAlign: 'left', padding: 0, overflow: 'hidden' }}>
                {article.image ? (
                  <img src={article.image} alt={article.title}
                    style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                ) : (
                  <div className="card-img-placeholder" style={{ padding: '24px 0 0', textAlign: 'center' }}>📰</div>
                )}
                <div style={{ padding: '20px 24px 24px' }}>
                  <h3 style={{ textAlign: 'left', marginBottom: 8 }}>{article.title}</h3>
                  <p style={{ textAlign: 'left' }}>{article.description}</p>
                  <div style={{ fontSize: '0.75rem', color: '#05878A', fontWeight: 500 }}>
                    {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="pagination" style={{ marginTop: 40 }}>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹ Prev</button>
            <span>{page} / {pagination.totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages}>Next ›</button>
          </div>
        )}
      </div>
    </main>
  );
}

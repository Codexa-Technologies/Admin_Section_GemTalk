import React, { useState, useEffect } from 'react';
import '../styles/article.css';

const API = 'http://localhost:5000';

export default function Article() {
  const [articles, setArticles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [inputVal, setInputVal]     = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/public/articles?type=article&page=${page}&limit=9&search=${encodeURIComponent(search)}`)
      .then(r => r.json())
      .then(d => { if (d.success) { setArticles(d.articles); setPagination(d.pagination); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = e => { e.preventDefault(); setSearch(inputVal); setPage(1); };
  const closeViewer = () => setSelectedArticle(null);

  const formatSize = (bytes) => bytes ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : '';

  return (
    <main className="article-page">
      <div className="article-hero">
        <h1>Articles</h1>
        <form className="article-search" onSubmit={handleSearch}>
          <input type="text" placeholder="Search articles..." value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="article-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="no-results">No articles found.</div>
        ) : (
          <div className="article-grid">
            {articles.map(article => (
              <div key={article._id} className="article-card" style={{ flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden' }}>
                {article.image ? (
                  <img src={article.image} alt={article.title}
                    style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '2rem', textAlign: 'center', padding: '20px 0 8px' }}>📄</div>
                )}
                <div className="article-card-body" style={{ padding: '16px 20px 20px' }}>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <div className="article-meta">
                    {article.fileSize && <span>{formatSize(article.fileSize)}</span>}
                  </div>
                  <div className="article-actions">
                    <button className="btn-view" onClick={() => setSelectedArticle(article)}>View</button>
                    {article.pdf && (
                      <a href={`${API}${article.pdf}`} target="_blank" rel="noreferrer" className="btn-download">
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹ Prev</button>
            <span>{page} / {pagination.totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages}>Next ›</button>
          </div>
        )}
      </div>

      {selectedArticle && (
        <div className="doc-modal-overlay" onClick={closeViewer}>
          <div className="doc-modal" onClick={e => e.stopPropagation()}>
            <div className="doc-modal-header">
              <h3>{selectedArticle.title}</h3>
              <button className="doc-close" onClick={closeViewer}>×</button>
            </div>
            <div className="doc-modal-meta">
              {selectedArticle.fileSize && <span>{formatSize(selectedArticle.fileSize)}</span>}
              {selectedArticle.createdAt && <span>{new Date(selectedArticle.createdAt).toLocaleDateString()}</span>}
            </div>
            <p className="doc-modal-desc">{selectedArticle.description}</p>

            {selectedArticle.pdf ? (
              <div className="doc-preview">
                <iframe src={`${API}${selectedArticle.pdf}`} title={selectedArticle.title} />
              </div>
            ) : (
              <div className="no-results" style={{ padding: '28px 10px' }}>PDF file is not available for preview.</div>
            )}

            {selectedArticle.pdf && (
              <div className="doc-modal-actions">
                <a href={`${API}${selectedArticle.pdf}`} target="_blank" rel="noreferrer" className="btn-download">
                  Open in New Tab
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

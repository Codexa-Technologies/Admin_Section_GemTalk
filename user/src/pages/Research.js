import React, { useState, useEffect } from 'react';
import '../styles/simple-page.css';
import '../styles/article.css';

const API = 'http://localhost:5000';

const formatSize = (bytes) => {
  if (!bytes) return '';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
};

export default function Research() {
  const [articles, setArticles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [inputVal, setInputVal]     = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/public/articles?type=research&page=${page}&limit=9&search=${encodeURIComponent(search)}`)
      .then(r => r.json())
      .then(d => { if (d.success) { setArticles(d.articles); setPagination(d.pagination); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = e => { e.preventDefault(); setSearch(inputVal); setPage(1); };
  const closeViewer = () => setSelectedPaper(null);

  return (
    <main className="simple-page">
      <div className="simple-hero">
        <h1>Research</h1>
        <p>Explore cutting-edge gemological research and scientific studies.</p>
        <form className="article-search" style={{ marginTop: 20 }} onSubmit={handleSearch}>
          <input type="text" placeholder="Search research papers..." value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="simple-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="no-results">No research papers found.</div>
        ) : (
          <div className="article-grid">
            {articles.map(article => (
              <div key={article._id} className="article-card" style={{ flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden' }}>
                {article.image ? (
                  <img src={article.image} alt={article.title}
                    style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '2.5rem', textAlign: 'center', padding: '24px 0 8px' }}>🔬</div>
                )}
                <div className="article-card-body" style={{ padding: '16px 20px 20px' }}>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <div className="article-meta">
                    {article.fileSize && <span>{formatSize(article.fileSize)}</span>}
                    <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="article-actions">
                    <button className="btn-view" onClick={() => setSelectedPaper(article)}>View</button>
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

      {selectedPaper && (
        <div className="doc-modal-overlay" onClick={closeViewer}>
          <div className="doc-modal" onClick={e => e.stopPropagation()}>
            <div className="doc-modal-header">
              <h3>{selectedPaper.title}</h3>
              <button className="doc-close" onClick={closeViewer}>×</button>
            </div>
            <div className="doc-modal-meta">
              {selectedPaper.fileSize && <span>{formatSize(selectedPaper.fileSize)}</span>}
              {selectedPaper.createdAt && <span>{new Date(selectedPaper.createdAt).toLocaleDateString()}</span>}
            </div>
            <p className="doc-modal-desc">{selectedPaper.description}</p>

            {selectedPaper.pdf ? (
              <div className="doc-preview">
                <iframe src={`${API}${selectedPaper.pdf}`} title={selectedPaper.title} />
              </div>
            ) : (
              <div className="no-results" style={{ padding: '28px 10px' }}>PDF file is not available for preview.</div>
            )}

            {selectedPaper.pdf && (
              <div className="doc-modal-actions">
                <a href={`${API}${selectedPaper.pdf}`} target="_blank" rel="noreferrer" className="btn-download">
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

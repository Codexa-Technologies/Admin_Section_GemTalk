import React, { useState, useEffect, useCallback } from 'react';
import { getArticles, deleteArticle, bulkDeleteArticles, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditArticleModal from '../components/EditArticleModal';
import Toast from '../components/Toast';
import '../styles/manage-articles.css';

/* ── Icons ─────────────────────────────────────────── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const TableIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/><line x1="15" y1="9" x2="15" y2="21"/>
  </svg>
);
const CardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const SortAscIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}>
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);
const SortDescIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}>
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{width:14,height:14,transition:'transform 0.2s',transform: open ? 'rotate(180deg)' : 'rotate(0deg)'}}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

/* ── Helpers ────────────────────────────────────────── */
const fmtDate  = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtSize  = b => b ? `${(b / 1024 / 1024).toFixed(2)} MB` : '—';
const getTypeLabel = (type) => {
  if (type === 'research') return 'Research';
  if (type === 'article') return 'Article';
  if (type === 'event') return 'Event';
  return 'News';
};

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Upload Date' },
  { value: 'title',     label: 'Title'       },
  { value: 'fileSize',  label: 'File Size'   },
];

/* ── Component ──────────────────────────────────────── */
const ManageArticlesPage = ({ defaultType = '' }) => {
  const [articles,      setArticles]      = useState([]);
  const [totalPages,    setTotalPages]    = useState(1);
  const [totalCount,    setTotalCount]    = useState(0);
  const [currentPage,   setCurrentPage]   = useState(1);
  const [search,        setSearch]        = useState('');
  const [sortField,     setSortField]     = useState('createdAt');
  const [sortOrder,     setSortOrder]     = useState('desc');
  const [dateFrom,      setDateFrom]      = useState('');
  const [dateTo,        setDateTo]        = useState('');
  const [viewMode,      setViewMode]      = useState('table'); // 'table' | 'card'
  const [expandedRow,   setExpandedRow]   = useState(null);
  const [selected,      setSelected]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');
  const [editingArticle,setEditingArticle]= useState(null);
  const { token } = useAuth();
  const ITEMS_PER_PAGE = 10;

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true); setError(''); setSelected([]);
      const res = await getArticles(token, currentPage, ITEMS_PER_PAGE, search, sortField, sortOrder, dateFrom, dateTo, defaultType || 'article');
      if (res.success) {
        setArticles(res.articles);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.pagination.totalCount);
      } else setError(res.message || 'Failed to load articles');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, search, sortField, sortOrder, dateFrom, dateTo, defaultType]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  /* Search resets page */
  const handleSearch = e => { setSearch(e.target.value); setCurrentPage(1); };

  /* Sort toggle */
  const handleSort = (field) => {
    if (sortField === field) setSortOrder(o => o === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortOrder('desc'); }
    setCurrentPage(1);
  };

  /* Date filter */
  const handleDateFilter = (key, val) => {
    if (key === 'from') setDateFrom(val);
    else setDateTo(val);
    setCurrentPage(1);
  };

  const clearFilters = () => { setDateFrom(''); setDateTo(''); setSearch(''); setCurrentPage(1); };

  /* Expand row */
  const toggleExpand = (id) => setExpandedRow(p => p === id ? null : id);

  /* Checkboxes */
  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleSelectAll = () => setSelected(selected.length === articles.length ? [] : articles.map(a => a._id));

  const label = defaultType === 'news' ? 'news article' : defaultType === 'research' ? 'research paper' : 'article';
  const labelPlural = defaultType === 'news' ? 'news articles' : defaultType === 'research' ? 'research papers' : 'articles';

  const handleViewPdf = async (url) => {
    if (!url) return;

    // Open the proxy URL directly in a new tab (same as pasting the proxy URL in browser).
    const proxyUrl = `${API_BASE_URL}/public/file?url=${encodeURIComponent(url)}`;
    const opened = window.open(proxyUrl, '_blank', 'noopener');
    if (!opened) {
      // Popup blocked — fallback to opening the original URL
      window.open(url, '_blank', 'noopener');
    }
  };

  

  /* Single delete */
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${label}?`)) return;
    try {
      const res = await deleteArticle(token, id, defaultType || 'article');
      if (res.success) {
        setArticles(p => p.filter(a => a._id !== id));
        setTotalCount(c => c - 1);
        setSuccess(`${label} deleted successfully`);
      }
      else setError(res.message || 'Failed to delete');
    } catch (err) { setError(err.message || 'Failed to delete'); }
  };

  /* Bulk delete */
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.length} selected ${label}(s)?`)) return;
    try {
      const res = await bulkDeleteArticles(token, selected, defaultType || 'article');
      if (res.success) {
        setSuccess(`${selected.length} ${label}(s) deleted`);
        fetchArticles();
      }
      else setError(res.message || 'Bulk delete failed');
    } catch (err) { setError(err.message || 'Bulk delete failed'); }
  };

  const SortBtn = ({ field }) => (
    <button className={`sort-btn${sortField === field ? ' sort-btn--active' : ''}`} onClick={() => handleSort(field)}>
      {sortField === field ? (sortOrder === 'asc' ? <SortAscIcon /> : <SortDescIcon />) : <SortDescIcon />}
    </button>
  );

  /* ── Table Row ──────────────────────────────────────── */
  const resolveItemType = (item) => {
    if (defaultType === 'news') return item.type || 'news';
    return defaultType || item.type || 'article';
  };

  const TableRow = ({ article, idx }) => {
    const isExpanded = expandedRow === article._id;
    const isSelected = selected.includes(article._id);
    const itemType = resolveItemType(article);
    return (
      <>
        <tr className={`${isSelected ? 'row-selected' : ''}${isExpanded ? ' row-expanded' : ''}`}>
          <td className="cb-cell">
            <input type="checkbox" className="row-checkbox" checked={isSelected} onChange={() => toggleSelect(article._id)} />
          </td>
          <td className="num-cell">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
          <td className="title-cell">
            <button className="expand-btn" onClick={() => toggleExpand(article._id)}>
              <ChevronIcon open={isExpanded} />
            </button>
            <span>{article.title}</span>
          </td>
          <td className="file-cell">
            <div className="file-name-badge">
              <FileIcon />
              <span>{article.fileName || '—'}</span>
            </div>
          </td>
          <td className="date-cell">{fmtDate(article.createdAt)}</td>
          <td className="date-cell">{fmtDate(article.publishedDate)}</td>
          <td className="size-cell">{fmtSize(article.fileSize)}</td>
          <td>
            <span className={`type-badge type-badge--${itemType}`}>
              {getTypeLabel(itemType)}
            </span>
          </td>
          <td className="actions-cell">
            {article.pdf ? (
                <>
                  <button type="button" className="act-btn act-view" onClick={() => handleViewPdf(article.pdf)}>View</button>
                </>
              ) : (
                <button className="act-btn" disabled>No PDF</button>
              )}
            <button type="button" className="act-btn act-edit"   onClick={() => setEditingArticle(article)}>Edit</button>
            <button type="button" className="act-btn act-delete" onClick={() => handleDelete(article._id)}>Delete</button>
          </td>
        </tr>
        {isExpanded && (
          <tr className="expanded-row">
            <td colSpan={9}>
              <div className="expanded-content">
                <div className="expanded-label">Description</div>
                <div className="expanded-text">{article.description}</div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  /* ── Card Item ──────────────────────────────────────── */
  const CardItem = ({ article, idx }) => {
    const isSelected = selected.includes(article._id);
    const isExpanded = expandedRow === article._id;
    const itemType = resolveItemType(article);
    return (
      <div className={`article-card${isSelected ? ' article-card--selected' : ''}`}>
        <div className="article-card-top">
          <div className="card-top-left">
            <input type="checkbox" className="row-checkbox" checked={isSelected} onChange={() => toggleSelect(article._id)} />
            <span className="card-num">#{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</span>
          </div>
          <div className="card-chips">
            <span className={`type-badge type-badge--${itemType}`}>
              {getTypeLabel(itemType)}
            </span>
            <span className="chip-size">{fmtSize(article.fileSize)}</span>
          </div>
        </div>

        <div className="article-card-title">{article.title}</div>

        <div className="article-card-file">
          <FileIcon />

      {/* PDF preview removed — View now opens PDF in a new tab */}
          <span>{article.fileName || '—'}</span>
        </div>

        <div className="article-card-dates">
          <div className="card-date-item">
            <span className="card-date-label">Uploaded</span>
            <span className="card-date-val">{fmtDate(article.createdAt)}</span>
          </div>
          <div className="card-date-item">
            <span className="card-date-label">Published</span>
            <span className="card-date-val">{fmtDate(article.publishedDate)}</span>
          </div>
        </div>

        <button className="card-expand-btn" onClick={() => toggleExpand(article._id)}>
          {isExpanded ? 'Hide description' : 'Show description'} <ChevronIcon open={isExpanded} />
        </button>

        {isExpanded && (
          <div className="card-expanded-desc">{article.description}</div>
        )}

        <div className="article-card-actions">
          {article.pdf ? (
            <>
              <button className="act-btn act-view" onClick={() => handleViewPdf(article.pdf)}>View</button>
            </>
          ) : (
            <button className="act-btn" disabled>No PDF</button>
          )}
          <button className="act-btn act-edit"   onClick={() => setEditingArticle(article)}>Edit</button>
          <button className="act-btn act-delete" onClick={() => handleDelete(article._id)}>Delete</button>
        </div>
      </div>
    );
  };

  const hasFilters = search || dateFrom || dateTo;

  return (
    <div className="manage-page">
      <Toast message={error} type="error" onClose={() => setError('')} />
      <Toast message={success} type="success" onClose={() => setSuccess('')} />

      {/* ── Toolbar ── */}
      <div className="manage-toolbar">
        {/* Search */}
        <div className="search-box">
          <SearchIcon />
          <input type="text" className="search-input" placeholder="Search by title or description..." value={search} onChange={handleSearch} />
        </div>

        {/* Date Range */}
        <div className="date-range">
          <input type="date" className="date-input" value={dateFrom} onChange={e => handleDateFilter('from', e.target.value)} title="From date" />
          <span className="date-sep">to</span>
          <input type="date" className="date-input" value={dateTo}   onChange={e => handleDateFilter('to',   e.target.value)} title="To date" />
          {hasFilters && <button className="clear-btn" onClick={clearFilters}>Clear</button>}
        </div>

        {/* Right controls */}
        <div className="toolbar-right">
          {/* Sort */}
          <div className="sort-group">
            <span className="sort-label">Sort:</span>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`sort-pill${sortField === opt.value ? ' sort-pill--active' : ''}`}
                onClick={() => handleSort(opt.value)}
              >
                {opt.label}
                {sortField === opt.value && (sortOrder === 'asc' ? <SortAscIcon /> : <SortDescIcon />)}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="view-toggle">
            <button className={`view-btn${viewMode === 'table' ? ' view-btn--active' : ''}`} onClick={() => setViewMode('table')} title="Table view"><TableIcon /></button>
            <button className={`view-btn${viewMode === 'card'  ? ' view-btn--active' : ''}`} onClick={() => setViewMode('card')}  title="Card view"><CardIcon /></button>
          </div>
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selected.length > 0 && (
        <div className="bulk-bar">
          <span className="bulk-count">{selected.length} {label}{selected.length > 1 ? 's' : ''} selected</span>
          <button className="bulk-delete-btn" onClick={handleBulkDelete}>
            <TrashIcon /> Delete Selected
          </button>
          <button className="bulk-clear-btn" onClick={() => setSelected([])}>Deselect All</button>
        </div>
      )}

      {/* ── Stats strip ── */}
      <div className="stats-strip">
        <span>Total: <strong>{totalCount}</strong> {labelPlural}</span>
        {hasFilters && <span className="filter-badge">Filtered results</span>}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="loading-state">Loading {labelPlural}...</div>
      ) : articles.length > 0 ? (
        <>
          {viewMode === 'table' ? (
            <div className="table-card">
              <table className="articles-table">
                <thead>
                  <tr>
                    <th className="cb-cell">
                      <input type="checkbox" className="row-checkbox" checked={selected.length === articles.length && articles.length > 0} onChange={toggleSelectAll} />
                    </th>
                    <th className="num-cell">#</th>
                    <th>Title <SortBtn field="title" /></th>
                    <th>File Name</th>
                    <th>Upload Date <SortBtn field="createdAt" /></th>
                    <th>Published Date</th>
                    <th>Size <SortBtn field="fileSize" /></th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, idx) => (
                    <TableRow key={article._id} article={article} idx={idx} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="cards-grid">
              {articles.map((article, idx) => (
                <CardItem key={article._id} article={article} idx={idx} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="pagination">
            <button className="pag-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</button>
            <span className="pag-info">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
            <button className="pag-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          No {labelPlural} found.{hasFilters && ' Try clearing the filters.'}
        </div>
      )}

      {editingArticle && (
        <EditArticleModal
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          onSuccess={() => { setEditingArticle(null); fetchArticles(); }}
        />
      )}
    </div>
  );
};

export default ManageArticlesPage;

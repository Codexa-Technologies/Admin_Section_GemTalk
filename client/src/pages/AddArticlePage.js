import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/api';
import { useAuth } from '../context/AuthContext';
// pdf preview removed: no pdfjs imports
import Toast from '../components/Toast';
import '../styles/form.css';

// (pdf worker not used since preview removed)

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
};

// Pdf preview removed to avoid worker/import issues

const getInitialFormData = () => {
  const today = new Date().toISOString().split('T')[0];
  return {
    title: '',
    description: '',
    pdf: null,
    image: null,
    images: [],
    publishedDate: today,
    downloadAvailable: true,
    type: '',
  };
};

const AddArticlePage = ({ defaultType = 'article' }) => {
  const isNews     = defaultType === 'news';
  const isResearch = defaultType === 'research';
  const contentType = isNews ? 'news' : isResearch ? 'research' : 'article';

  const [formData, setFormData] = useState(() => getInitialFormData());
  const imagesInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);
  const pdfInputRef   = useRef(null);
  const imageInputRef = useRef(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    setFormData(p => ({ ...getInitialFormData(), type: contentType }));
    setError('');
    setSuccess('');
    setDragOver(false);
    if (pdfInputRef.current) pdfInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (imagesInputRef.current) imagesInputRef.current.value = '';
  }, [contentType]);

  const handleInput = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleCheckbox = e => setFormData(p => ({ ...p, [e.target.name]: e.target.checked }));

  const validatePdf = useCallback((file) => {
    if (file.type !== 'application/pdf') { setError('Only PDF files are allowed'); return false; }
    if (file.size > 10 * 1024 * 1024)   { setError('PDF must be less than 10MB'); return false; }
    return true;
  }, []);

  const validateImage = useCallback((file) => {
    if (!file.type.startsWith('image/'))  { setError('Only image files are allowed'); return false; }
    if (file.size > 5 * 1024 * 1024)     { setError('Image must be less than 5MB'); return false; }
    return true;
  }, []);

  const applyPdf = (file) => { if (file && validatePdf(file)) { setFormData(p => ({ ...p, pdf: file })); setError(''); } };
  const applyImage = (file) => { if (file && validateImage(file)) { setFormData(p => ({ ...p, image: file })); setError(''); } };
  const applyImages = (files) => {
    if (!files) return;
    const incoming = Array.from(files);
    const merged = [...(formData.images || []), ...incoming];
    const limited = merged.slice(0, 5);
    if (merged.length > 5) {
      setError('You can upload up to 5 images');
    }
    for (const f of limited) {
      if (!f.type.startsWith('image/')) { setError('Only image files are allowed'); return; }
      if (f.size > 5 * 1024 * 1024) { setError('Each image must be less than 5MB'); return; }
    }
    setFormData(p => ({ ...p, images: limited }));
    setError('');
    if (imagesInputRef.current) imagesInputRef.current.value = '';
  };

  const handleDrop = e => { e.preventDefault(); setDragOver(false); applyPdf(e.dataTransfer.files[0]); };

  const removePdf = (e) => {
    e.stopPropagation();
    setFormData(p => ({ ...p, pdf: null }));
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };
  const removeImage = (e) => {
    e.stopPropagation();
    setFormData(p => ({ ...p, image: null }));
    if (imageInputRef.current) imageInputRef.current.value = '';
  };
  const removeEventImage = (index) => {
    setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!formData.title || !formData.description) { setError('Please fill in all fields'); return; }
    if (!isNews && !formData.pdf) { setError('Please upload a PDF file'); return; }
    if (isNews) {
      if (formData.type === 'news' && !formData.image) { setError('Please upload a cover image'); return; }
      if (formData.type === 'event' && (!formData.images || formData.images.length === 0)) { /* images optional, allow */ }
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      if (formData.pdf)   data.append('pdf', formData.pdf);
      if (formData.image) data.append('image', formData.image);
      // for events, append multiple images
      if (formData.images && formData.images.length) {
        formData.images.slice(0,5).forEach(f => data.append('images', f));
      }
      if (formData.type) data.append('type', formData.type);
      if (formData.publishedDate) data.append('publishedDate', formData.publishedDate);
        if (isResearch && formData.downloadAvailable !== undefined) data.append('downloadAvailable', formData.downloadAvailable);

      const res = await createArticle(token, data, contentType);
      if (res.success) {
        setSuccess(isResearch ? 'Research paper added!' : isNews ? 'News article added!' : 'Article created!');
        setTimeout(() => navigate(isResearch ? '/manage-research' : isNews ? '/manage-news' : '/manage-articles'), 1500);
      } else {
        setError(res.message || 'Failed to create');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = isResearch ? 'Add Research Paper' : isNews ? 'Add Latest News' : 'Add Article';
  const pageDesc  = isResearch ? 'Upload a research paper to the knowledge base' : isNews ? 'Upload a news article with cover image' : 'Upload a PDF article to the knowledge base';

  return (
    <div className="form-page">
      <Toast message={error} type="error" onClose={() => setError('')} />
      <Toast message={success} type="success" onClose={() => setSuccess('')} />

      <div className="form-card">
        <div className="form-card-header">
          <h1>{pageTitle}</h1>
          <p>{pageDesc}</p>
        </div>

        <form onSubmit={handleSubmit} className="form-body">

          {isNews && (
            <div className="field">
              <label htmlFor="type">Type</label>
              <div className="select-wrap">
                <select id="type" name="type" value={formData.type || 'news'} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))} disabled={loading}>
                  <option value="news">News</option>
                  <option value="event">Event</option>
                </select>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="field">
            <label htmlFor="title">{isResearch ? 'Paper Title' : isNews ? (formData.type === 'event' ? 'Event Title' : 'News Title') : 'Article Title'}</label>
            <span className="char-count">{formData.title.length}/100</span>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInput}
              placeholder={isResearch ? 'Enter research paper title' : isNews ? (formData.type === 'event' ? 'Enter event title' : 'Enter news title') : 'Enter article title'}
              required disabled={loading} maxLength="100" />
          </div>

          {/* Description */}
          <div className="field">
            <label htmlFor="description">{isResearch ? 'Abstract / Summary' : 'Description'}</label>
            <span className="char-count">{formData.description.length}/500</span>
            <textarea id="description" name="description" value={formData.description} onChange={handleInput}
              placeholder={isResearch ? 'Enter abstract or summary' : isNews ? 'Enter a brief description' : 'Enter article description'}
              required disabled={loading} maxLength="500" rows="4" />
          </div>

          {/* Published Date */}
          <div className="field">
            <label htmlFor="publishedDate">
              <span className="label-icon"><CalendarIcon /></span>
              {isNews && formData.type === 'event' ? 'Event Date' : 'Published Date'} <span className="label-optional">(optional)</span>
            </label>
            <div className="date-input-wrap">
              <input type="date" id="publishedDate" name="publishedDate" value={formData.publishedDate}
                onChange={handleInput} disabled={loading} {...(formData.type === 'event' ? {} : { max: new Date().toISOString().split('T')[0] })} />
            </div>
          </div>

          {/* Cover Image (for news) or Event Images (for event) */}
          {!(isNews && formData.type === 'event') && (
            <div className="field">
              <label>
                Cover Image
                {!isNews && <span className="label-optional"> (optional)</span>}
              </label>
              <div className="pdf-upload-area" style={{ cursor: 'pointer' }} onClick={() => !formData.image && imageInputRef.current?.click()}>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={e => applyImage(e.target.files[0])} disabled={loading} style={{ display: 'none' }} />
                {formData.image ? (
                  <div className="pdf-file-badge">
                    <img src={URL.createObjectURL(formData.image)} alt="preview"
                      style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    <div className="pdf-badge-info">
                      <div className="pdf-badge-name">{formData.image.name}</div>
                      <div className="pdf-badge-meta">
                        <span className="pdf-size-chip">{formatBytes(formData.image.size)}</span>
                        <span className="pdf-type-chip">IMAGE</span>
                      </div>
                    </div>
                    <button type="button" className="pdf-remove-btn" onClick={removeImage} disabled={loading}><TrashIcon /></button>
                  </div>
                ) : (
                  <div className="pdf-empty-state" style={{ cursor: 'pointer' }}>
                    <div className="pdf-upload-icon"><UploadIcon /></div>
                    <div className="pdf-upload-title">Click to upload cover image</div>
                    <div className="pdf-upload-sub">JPG, PNG, WebP — Max 5MB</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Event images */}
          {isNews && formData.type === 'event' && (
            <div className="field">
              <label>Event Images (up to 5)</label>
              <div className="pdf-upload-area" style={{ cursor: 'pointer' }} onClick={() => imagesInputRef.current?.click()}>
                <input ref={imagesInputRef} type="file" accept="image/*" multiple onChange={e => applyImages(e.target.files)} disabled={loading} style={{ display: 'none' }} />
                {formData.images && formData.images.length ? (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {formData.images.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={URL.createObjectURL(img)} alt={img.name} style={{ width: 92, height: 92, objectFit: 'cover', borderRadius: 8 }} />
                        <button type="button" className="pdf-remove-btn" onClick={() => removeEventImage(idx)} style={{ position: 'absolute', right: -6, top: -6 }} disabled={loading}><TrashIcon /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pdf-empty-state">
                    <div className="pdf-upload-icon"><UploadIcon /></div>
                    <div className="pdf-upload-title">Click to add event images</div>
                    <div className="pdf-upload-sub">JPG, PNG, WebP — Max 5 images, 5MB each</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PDF Upload — hidden for news */}
          {!isNews && (
            <div className="field">
              <label>
                PDF File
                {isResearch ? '' : <span className="label-optional"> (required)</span>}
              </label>
              <div
                className={`pdf-upload-area${dragOver ? ' drag-over' : ''}${formData.pdf ? ' has-file' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !formData.pdf && pdfInputRef.current?.click()}
              >
                <input ref={pdfInputRef} type="file" accept=".pdf" onChange={e => applyPdf(e.target.files[0])} disabled={loading} style={{ display: 'none' }} />
                {formData.pdf ? (
                  <div className="pdf-selected-state">
                    <div className="pdf-file-badge">
                      <div className="pdf-badge-icon"><FileIcon /></div>
                      <div className="pdf-badge-info">
                        <div className="pdf-badge-name">{formData.pdf.name}</div>
                        <div className="pdf-badge-meta">
                          <span className="pdf-size-chip">{formatBytes(formData.pdf.size)}</span>
                          <span className="pdf-type-chip">PDF</span>
                        </div>
                      </div>
                      <button type="button" className="pdf-remove-btn" onClick={removePdf} disabled={loading}><TrashIcon /></button>
                    </div>
                    {/* preview removed */}
                  </div>
                ) : (
                  <div className="pdf-empty-state">
                    <div className="pdf-upload-icon"><UploadIcon /></div>
                    <div className="pdf-upload-title">Drag and drop your PDF here</div>
                    <div className="pdf-upload-sub">or click to browse — Max 10MB</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Research-specific: allow choosing if download is available */}
          {isResearch && (
            <div className="field">
              <label htmlFor="downloadAvailable">Allow Download</label>
              <div className="checkbox-wrap">
                <label className="switch">
                  <input id="downloadAvailable" name="downloadAvailable" type="checkbox"
                    checked={!!formData.downloadAvailable} onChange={handleCheckbox} disabled={loading} />
                  <span className="slider" />
                </label>
                <span className="label-optional"> Allow users to download the PDF</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary"
              onClick={() => navigate(isResearch ? '/manage-research' : isNews ? '/manage-news' : '/manage-articles')}
              disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isResearch ? 'Add Research Paper' : isNews ? 'Add News Article' : 'Add Article'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddArticlePage;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/api';
import { useAuth } from '../context/AuthContext';
import * as pdfjsLib from 'pdfjs-dist';
import '../styles/form.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/* ── Icons ─────────────────────────────────────────── */
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
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

/* ── Helpers ────────────────────────────────────────── */
const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
};

/* ── PDF Preview Component ──────────────────────────── */
const PdfPreview = ({ file }) => {
  const canvasRef = useRef(null);
  const [previewError, setPreviewError] = useState(false);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    if (!file) return;
    setRendering(true);
    setPreviewError(false);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = canvas.parentElement?.clientWidth || 300;
        const scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        await page.render({ canvasContext: canvas.getContext('2d'), viewport: scaledViewport }).promise;
        setRendering(false);
      } catch {
        setPreviewError(true);
        setRendering(false);
      }
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  if (previewError) {
    return (
      <div className="pdf-preview-error">
        <FileIcon />
        <span>Preview not available</span>
      </div>
    );
  }

  return (
    <div className="pdf-preview-wrap">
      {rendering && <div className="pdf-preview-loading">Generating preview...</div>}
      <canvas ref={canvasRef} className="pdf-preview-canvas" style={{ display: rendering ? 'none' : 'block' }} />
    </div>
  );
};

/* ── Main Component ─────────────────────────────────── */
const AddArticlePage = () => {
  const [formData, setFormData] = useState({ title: '', description: '', pdf: null, publishedDate: '' });
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleInput = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const validateFile = useCallback((file) => {
    if (file.type !== 'application/pdf') { setError('Only PDF files are allowed'); return false; }
    if (file.size > 10 * 1024 * 1024) { setError('File size must be less than 10MB'); return false; }
    return true;
  }, []);

  const applyFile = (file) => {
    if (file && validateFile(file)) {
      setFormData(p => ({ ...p, pdf: file }));
      setError('');
    }
  };

  const handleFileChange = e => applyFile(e.target.files[0]);

  const handleDrop = e => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFormData(p => ({ ...p, pdf: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.title || !formData.description || !formData.pdf) {
      setError('Please fill in all fields and select a PDF file');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('pdf', formData.pdf);
      if (formData.publishedDate) data.append('publishedDate', formData.publishedDate);

      const res = await createArticle(token, data);
      if (res.success) {
        setSuccess('Article created successfully!');
        setTimeout(() => navigate('/manage-articles'), 1500);
      } else {
        setError(res.message || 'Failed to create article');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      {error   && <div className="error-message"   style={{ maxWidth: 680, marginBottom: 16 }}>{error}</div>}
      {success && <div className="success-message" style={{ maxWidth: 680, marginBottom: 16 }}>{success}</div>}

      <div className="form-card">
        <div className="form-card-header">
          <h1>Add New Article</h1>
          <p>Upload a PDF article to the knowledge base</p>
        </div>

        <form onSubmit={handleSubmit} className="form-body">

          {/* Title */}
          <div className="field">
            <label htmlFor="title">Article Title</label>
            <span className="char-count">{formData.title.length}/100</span>
            <input
              type="text" id="title" name="title"
              value={formData.title} onChange={handleInput}
              placeholder="Enter article title"
              required disabled={loading} maxLength="100"
            />
          </div>

          {/* Description */}
          <div className="field">
            <label htmlFor="description">Description</label>
            <span className="char-count">{formData.description.length}/500</span>
            <textarea
              id="description" name="description"
              value={formData.description} onChange={handleInput}
              placeholder="Enter article description"
              required disabled={loading} maxLength="500" rows="4"
            />
          </div>

          {/* Published Date */}
          <div className="field">
            <label htmlFor="publishedDate">
              <span className="label-icon"><CalendarIcon /></span>
              Published Date <span className="label-optional">(optional)</span>
            </label>
            <div className="date-input-wrap">
              <input
                type="date" id="publishedDate" name="publishedDate"
                value={formData.publishedDate} onChange={handleInput}
                disabled={loading}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* PDF Upload */}
          <div className="field">
            <label>PDF File</label>
            <div
              className={`pdf-upload-area${dragOver ? ' drag-over' : ''}${formData.pdf ? ' has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !formData.pdf && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file" accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
                style={{ display: 'none' }}
              />

              {formData.pdf ? (
                <div className="pdf-selected-state">
                  {/* File Info Badge */}
                  <div className="pdf-file-badge">
                    <div className="pdf-badge-icon"><FileIcon /></div>
                    <div className="pdf-badge-info">
                      <div className="pdf-badge-name">{formData.pdf.name}</div>
                      <div className="pdf-badge-meta">
                        <span className="pdf-size-chip">{formatBytes(formData.pdf.size)}</span>
                        <span className="pdf-type-chip">PDF</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="pdf-remove-btn"
                      onClick={removeFile}
                      disabled={loading}
                      title="Remove file"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  {/* PDF Preview */}
                  <div className="pdf-preview-section">
                    <div className="pdf-preview-label">Page 1 Preview</div>
                    <PdfPreview file={formData.pdf} />
                  </div>
                </div>
              ) : (
                <div className="pdf-empty-state">
                  <div className="pdf-upload-icon"><UploadIcon /></div>
                  <div className="pdf-upload-title">Drag and drop your PDF here</div>
                  <div className="pdf-upload-sub">or click to browse &mdash; Max 10MB</div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/manage-articles')} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Article'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddArticlePage;

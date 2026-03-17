import React, { useState, useRef } from 'react';
import { updateArticle } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';
import '../styles/modal.css';
import '../styles/form.css';

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const EditArticleModal = ({ article, onClose, onSuccess }) => {
  const isNews     = article.type === 'news';
  const isResearch = article.type === 'research';

  const [formData, setFormData] = useState({
    title: article.title,
    description: article.description,
    pdf: null,
    image: null,
    type: article.type || 'news',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const pdfInputRef   = useRef(null);
  const imageInputRef = useRef(null);
  const { token } = useAuth();

  const handleInput = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePdfChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Only PDF files are allowed'); return; }
    if (file.size > 10 * 1024 * 1024)   { setError('File size must be less than 10MB'); return; }
    setFormData(p => ({ ...p, pdf: file })); setError('');
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed'); return; }
    if (file.size > 5 * 1024 * 1024)    { setError('Image must be less than 5MB'); return; }
    setFormData(p => ({ ...p, image: file })); setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!formData.title || !formData.description) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      if (formData.pdf)   data.append('pdf', formData.pdf);
      if (formData.image) data.append('image', formData.image);
      const res = await updateArticle(token, article._id, data, article.type || 'article');
      if (res.success) onSuccess();
      else setError(res.message || 'Failed to update');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && !loading && onClose()}>
      <div className="modal-box">
        <div className="modal-head">
          <h2>Edit {isResearch ? 'Research Paper' : isNews ? 'News Article' : 'Article'}</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>&#x2715;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <Toast message={error} type="error" onClose={() => setError('')} />

            <div className="field">
              <label htmlFor="m-title">{isResearch ? 'Paper Title' : 'Title'}</label>
              <span className="char-count">{formData.title.length}/100</span>
              <input type="text" id="m-title" name="title" value={formData.title} onChange={handleInput}
                required disabled={loading} maxLength="100" />
            </div>

            <div className="field">
              <label htmlFor="m-desc">{isResearch ? 'Abstract / Summary' : 'Description'}</label>
              <span className="char-count">{formData.description.length}/500</span>
              <textarea id="m-desc" name="description" value={formData.description} onChange={handleInput}
                required disabled={loading} maxLength="500" rows="4" />
            </div>

            {/* Replace Image */}
            <div className="field">
              <label>Replace Cover Image <span className="label-optional">(optional)</span></label>
              {article.image && !formData.image && (
                <div style={{ marginBottom: 8 }}>
                  <img src={article.image} alt="current" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e0e0e0' }} />
                  <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Current image</div>
                </div>
              )}
              <div className="pdf-upload-area" style={{ padding: '16px 20px', cursor: 'pointer' }}
                onClick={() => imageInputRef.current?.click()}>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} disabled={loading} style={{ display: 'none' }} />
                {formData.image ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={URL.createObjectURL(formData.image)} alt="new" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />
                    <div style={{ flex: 1, fontSize: 13 }}>{formData.image.name}</div>
                    <button type="button" className="pdf-remove-btn"
                      onClick={e => { e.stopPropagation(); setFormData(p => ({ ...p, image: null })); imageInputRef.current.value = ''; }}
                      disabled={loading}><TrashIcon /></button>
                  </div>
                ) : (
                  <div className="pdf-upload-title" style={{ fontSize: 13 }}>Click to select a new image</div>
                )}
              </div>
            </div>

            {/* Replace PDF — hidden for news */}
            {!isNews && (
              <div className="field">
                <label>Replace PDF <span className="label-optional">(optional)</span></label>
                <div className="pdf-upload-area" style={{ padding: '20px 24px', cursor: 'pointer' }}
                  onClick={() => pdfInputRef.current?.click()}>
                  <input ref={pdfInputRef} type="file" accept=".pdf" onChange={handlePdfChange} disabled={loading} style={{ display: 'none' }} />
                  <div className="pdf-upload-title" style={{ fontSize: 13 }}>
                    {formData.pdf ? formData.pdf.name : 'Click to select a new PDF file'}
                  </div>
                  {!formData.pdf && <div className="pdf-upload-sub">Leave empty to keep the current file</div>}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticleModal;

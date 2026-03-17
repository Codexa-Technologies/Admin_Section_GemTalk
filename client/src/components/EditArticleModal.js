import React, { useState } from 'react';
import { updateArticle } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/modal.css';
import '../styles/form.css';

const EditArticleModal = ({ article, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ title: article.title, description: article.description, pdf: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleInput = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Only PDF files are allowed'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('File size must be less than 10MB'); return; }
    setFormData(p => ({ ...p, pdf: file }));
    setError('');
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
      if (formData.pdf) data.append('pdf', formData.pdf);
      const res = await updateArticle(token, article._id, data);
      if (res.success) onSuccess();
      else setError(res.message || 'Failed to update article');
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
          <h2>Edit Article</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>&#x2715;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="field">
              <label htmlFor="m-title">Article Title</label>
              <span className="char-count">{formData.title.length}/100</span>
              <input
                type="text" id="m-title" name="title"
                value={formData.title} onChange={handleInput}
                placeholder="Enter article title"
                required disabled={loading} maxLength="100"
              />
            </div>

            <div className="field">
              <label htmlFor="m-desc">Description</label>
              <span className="char-count">{formData.description.length}/500</span>
              <textarea
                id="m-desc" name="description"
                value={formData.description} onChange={handleInput}
                placeholder="Enter article description"
                required disabled={loading} maxLength="500" rows="4"
              />
            </div>

            <div className="field">
              <label htmlFor="m-pdf">Replace PDF (optional)</label>
              <div className="pdf-upload-area" style={{padding:'20px 24px'}} onClick={() => document.getElementById('m-pdf').click()}>
                <input type="file" id="m-pdf" accept=".pdf" onChange={handleFileChange} disabled={loading} style={{display:'none'}} />
                <div className="pdf-upload-title" style={{fontSize:13}}>
                  {formData.pdf ? formData.pdf.name : 'Click to select a new PDF file'}
                </div>
                {!formData.pdf && <div className="pdf-upload-sub">Leave empty to keep the current file</div>}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticleModal;

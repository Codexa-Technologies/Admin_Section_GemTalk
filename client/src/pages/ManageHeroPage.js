import React, { useState, useEffect, useRef } from 'react';
import { getHero, uploadHeroImage, deleteHeroImage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import '../styles/manage-articles.css';
import ImageModal from '../components/ImageModal';

export default function ManageHeroPage() {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true); setError('');
      const res = await getHero();
      if (res.success) setImages(res.data.images || []);
      else setError(res.message || 'Failed to load');
    } catch (err) { setError(err.message || 'Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleUploadClick = () => fileRef.current && fileRef.current.click();

  const handleUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append('image', f);
    try {
      setLoading(true); setError(''); setSuccess('');
      const res = await uploadHeroImage(token, fd);
      if (res.success) {
        setImages(res.data.images || []);
        setSuccess('Image uploaded');
        fileRef.current.value = '';
      } else setError(res.message || 'Upload failed');
    } catch (err) { setError(err.message || 'Upload failed'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (publicId) => {
    if (!window.confirm('Delete this hero image?')) return;
    try {
      setLoading(true); setError(''); setSuccess('');
      const res = await deleteHeroImage(token, publicId);
      if (res.success) {
        setImages(prev => prev.filter(i => i.publicId !== publicId));
        setSuccess('Deleted');
      } else setError(res.message || 'Delete failed');
    } catch (err) { setError(err.message || 'Delete failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="manage-page">
      <Toast message={error} type="error" onClose={() => setError('')} />
      <Toast message={success} type="success" onClose={() => setSuccess('')} />

      <div className="manage-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ margin: 0 }}>Hero Images</h3>
        </div>

        <div className="toolbar-right">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          <button type="button" className="act-btn" onClick={handleUploadClick}>Upload Image</button>
        </div>
      </div>

      <div className="stats-strip">
        <span>Total: <strong>{images.length}</strong> image{images.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading hero images...</div>
      ) : (
        <>
          <div className="cards-grid">
            {images.length ? images.map(img => (
              <div key={img.publicId} className="card-item">
                <div className="card-thumb">
                  <img src={img.url} alt={img.fileName || ''} />
                </div>
                <div className="card-body">
                  <div className="card-title" title={img.fileName}>{img.fileName || 'untitled'}</div>
                  <div className="card-actions">
                    <button type="button" className="act-btn act-view" onClick={() => setPreview(img)}>View</button>
                    <button type="button" className="act-btn act-delete" onClick={() => handleDelete(img.publicId)}>Delete</button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-state">No hero images configured.</div>
            )}
          </div>
          {preview && (
            <ImageModal src={preview.url} alt={preview.fileName} onClose={() => setPreview(null)} />
          )}
        </>
      )}
    </div>
  );
}

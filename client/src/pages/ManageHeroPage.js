import React, { useState, useEffect, useRef } from 'react';
import { getHero, uploadHeroImage, deleteHeroImage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function ManageHeroPage() {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedName, setSelectedName] = useState('');

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

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSelectedFile(f);
    setSelectedName(f.name);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return setError('Choose a file first');
    const fd = new FormData();
    fd.append('image', selectedFile);
    try {
      setLoading(true); setError(''); setSuccess('');
      const res = await uploadHeroImage(token, fd);
      if (res.success) {
        setImages(res.data.images || []);
        setSuccess('Image uploaded');
        setSelectedFile(null);
        setSelectedName('');
        if (fileRef.current) fileRef.current.value = '';
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

  const handleView = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="manage-page">
      <h2 style={{ marginBottom: 12 }}>Hero Images</h2>
      <Toast message={error} type="error" onClose={() => setError('')} />
      <Toast message={success} type="success" onClose={() => setSuccess('')} />

      <div className="manage-toolbar" style={{ padding: 0, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
          <div className="file-chooser">
            <button type="button" className="view-btn" onClick={() => fileRef.current && fileRef.current.click()}>Choose Image</button>
            <div className="file-chooser__name">{selectedName || 'No file chosen'}</div>
            <button type="button" className="bulk-delete-btn" onClick={handleUploadSubmit} style={{ marginLeft: 8 }}>Upload</button>
          </div>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="hero-grid">
          {images.length ? images.map(img => (
            <div key={img.publicId} className="hero-card">
              <div className="hero-card__img">
                <img src={img.url} alt={img.fileName || ''} />
              </div>
              <div className="hero-card__meta">
                <div className="hero-card__title">{img.fileName || 'Untitled'}</div>
              </div>
              <div className="hero-card__actions">
                <button type="button" className="act-view" onClick={() => handleView(img.url)}>View</button>
                <button type="button" className="act-delete" onClick={() => handleDelete(img.publicId)}>Delete</button>
              </div>
            </div>
          )) : <div>No hero images configured.</div>}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { getHero,deleteHeroImage, API_BASE_URL } from '../services/api';
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
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

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
    try { setPreviewUrl(URL.createObjectURL(f)); } catch (e) { setPreviewUrl(''); }
  };

  

  const handleUploadSubmit = async () => {
    if (!selectedFile) return setError('Choose a file first');
    const fd = new FormData();
    fd.append('image', selectedFile);

    // Use XHR to provide upload progress feedback
    try {
      setLoading(true); setError(''); setSuccess(''); setUploadProgress(0);

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE_URL}/hero`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const pct = Math.round((ev.loaded / ev.total) * 100);
            setUploadProgress(pct);
          }
        };

        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText || '{}');
            if (xhr.status >= 200 && xhr.status < 300 && json.success) {
              setImages(json.data.images || []);
              setSuccess('Image uploaded');
              setSelectedFile(null);
              setSelectedName('');
              if (fileRef.current) fileRef.current.value = '';
              setPreviewUrl('');
              setUploadProgress(0);
              resolve();
            } else {
              reject(new Error(json.message || 'Upload failed'));
            }
          } catch (err) { reject(err); }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(fd);
      });

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

      <div className="manage-toolbar">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {selectedName ? (
            <div style={{ marginLeft: 0, fontSize: 14, color: '#6b7280' }}>{selectedName}</div>
          ) : null}
          {previewUrl && (
            <div style={{ marginLeft: 12 }}>
              <img src={previewUrl} alt="preview" style={{ height: 48, borderRadius: 6, objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <div className="toolbar-right">
          <button
            type="button"
            className="bulk-delete-btn"
            onClick={async () => {
              if (!selectedFile) {
                if (fileRef.current) fileRef.current.click();
                return;
              }
              await handleUploadSubmit();
            }}
            disabled={loading}
          >
            {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : (selectedFile ? 'Upload' : 'Choose Image')}
          </button>
        </div>
      </div>

      {uploadProgress > 0 && (
        <div style={{ padding: '8px 0 0 0' }}>
          <div style={{ height: 6, background: '#eef2f7', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#1e95b5' }} />
          </div>
        </div>
      )}

      <div className="stats-strip">
        <span>Total: <strong>{images.length}</strong> images</span>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="cards-grid">
          {images.length ? images.map(img => (
            <div key={img.publicId} className="article-card">
              <div className="article-card-top">
                <div className="card-top-left">
                  <span className="card-num">&nbsp;</span>
                </div>
                <div className="card-chips">
                  <span className="chip-size">{img.fileSize ? `${(img.fileSize/1024/1024).toFixed(2)} MB` : ''}</span>
                </div>
              </div>

              <div className="article-card-file" style={{ padding: 0 }}>
                <div className="article-thumb">
                  <img src={img.url} alt={img.fileName || ''} />
                  <div className="article-thumb-overlay">
                    <div className="article-thumb-title">{img.fileName || 'Untitled'}</div>
                  </div>
                </div>
              </div>

              <div className="article-card-actions">
                <button className="act-btn act-view" onClick={() => handleView(img.url)}>View</button>
                <button className="act-btn act-delete" onClick={() => handleDelete(img.publicId)}>Delete</button>
              </div>
            </div>
          )) : <div>No hero images configured.</div>}
        </div>
      )}
    </div>
  );
}

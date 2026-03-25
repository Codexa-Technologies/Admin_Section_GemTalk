import React from 'react';
import '../styles/modal.css';

const ImageModal = ({ src, alt = '', onClose }) => {
  if (!src) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '90vw', padding: 12 }}>
        <div className="modal-head">
          <h2 style={{ fontSize: 16, margin: 0 }}>Preview</h2>
          <button className="modal-close" onClick={onClose}>&#x2715;</button>
        </div>
        <div className="modal-body" style={{ padding: 12, display: 'flex', justifyContent: 'center' }}>
          <img src={src} alt={alt} style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;

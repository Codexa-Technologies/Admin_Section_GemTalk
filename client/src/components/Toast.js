import React, { useEffect } from 'react';

const Toast = ({ message, type = 'error', duration = 3200, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timerId = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timerId);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`app-toast app-toast--${type}`} role="alert" aria-live="polite">
      <span className="app-toast-text">{message}</span>
      <button type="button" className="app-toast-close" onClick={onClose} aria-label="Close notification">
        x
      </button>
    </div>
  );
};

export default Toast;

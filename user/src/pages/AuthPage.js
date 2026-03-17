import React, { useEffect, useMemo, useState } from 'react';
import '../styles/auth.css';

const API = 'http://localhost:5000';

const initialLogin = { email: '', password: '' };
const initialSignup = { name: '', email: '', password: '', confirmPassword: '' };

export default function AuthPage({ isOpen, onClose }) {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [signupForm, setSignupForm] = useState(initialSignup);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const title = useMemo(() => (mode === 'login' ? 'User Login' : 'Create Account'), [mode]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onEsc = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEsc);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setSuccess('');
  };

  const saveSession = (payload) => {
    localStorage.setItem('gemtalk_user_token', payload.token);
    localStorage.setItem('gemtalk_user', JSON.stringify(payload.user));
    window.dispatchEvent(new Event('gemtalk-auth-changed'));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      saveSession(data);
      setSuccess(`Welcome back, ${data.user.name}!`);
      setLoginForm(initialLogin);
      setTimeout(() => {
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (signupForm.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (signupForm.password !== signupForm.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const payload = {
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
      };

      const response = await fetch(`${API}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Signup failed');
      }

      saveSession(data);
      setSuccess(`Account created for ${data.user.name}. You are now logged in.`);
      setSignupForm(initialSignup);
      setTimeout(() => {
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={() => onClose && onClose()}>
      <main className="auth-page" onClick={(e) => e.stopPropagation()}>
        <div className="auth-watermark">GemTalk</div>
        <section className="auth-card">
          <button className="auth-close" onClick={() => onClose && onClose()}>×</button>
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => handleMode('login')}>Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => handleMode('signup')}>Signup</button>
        </div>

        <h2>{title}</h2>

        {error && <div className="auth-msg error">{error}</div>}
        {success && <div className="auth-msg success">{success}</div>}

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />

            <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'SIGN IN'}</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignup}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={signupForm.name}
              onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={signupForm.confirmPassword}
              onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
              required
            />

            <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'CREATE ACCOUNT'}</button>
          </form>
        )}
        </section>
      </main>
    </div>
  );
}

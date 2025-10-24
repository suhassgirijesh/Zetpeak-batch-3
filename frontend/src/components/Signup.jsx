import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Auth.modern.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        alert(`Signup failed: ${error.message}`);
      } else {
        alert('Signup successful! Please check your email to verify your account.');
        navigate('/login');
      }
    } catch (error) {
      alert('An error occurred during signup.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* CiniKraft Logo - Navigate to Landing */}
      <Link to="/" className="auth-logo-link">
        <div className="auth-logo-container">
          <svg width="40" height="40" viewBox="0 0 40 40" className="auth-logo-icon">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
            <text x="20" y="20" textAnchor="middle" dominantBaseline="central"
                  fill="white" fontSize="22" fontWeight="700">
              C
            </text>
          </svg>
          <span className="auth-logo-text">CiniKraft</span>
        </div>
      </Link>

      {/* Animated Background Orbs */}
      <div className="auth-bg-animated">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
        <div className="auth-orb auth-orb-3"></div>
      </div>

      <form className="auth-form animate-slide-up" onSubmit={handleSubmit}>
        {/* Icon Badge Header */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <polyline points="17 11 19 13 23 9"/>
            </svg>
          </div>
          <h2 className="auth-title text-glow">Create Your Account</h2>
          <p className="auth-subtitle">Get started with your first storyboard project today.</p>
        </div>

        <div className="auth-fieldset">
          <label className="auth-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="label-icon">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Email Address
          </label>
          <div className="input-wrapper">
            <input 
              type="email"
              className="auth-input" 
              placeholder="you@example.com" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="auth-fieldset">
          <label className="auth-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="label-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Password
          </label>
          <div className="input-wrapper">
            <input 
              type="password"
              className="auth-input" 
              placeholder="Create a strong password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="auth-fieldset">
          <label className="auth-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="label-icon">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Confirm Password
          </label>
          <div className="input-wrapper">
            <input 
              type="password"
              className="auth-input" 
              placeholder="Re-enter your password" 
              required 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>
        </div>

        <button type="submit" className="auth-submit-btn btn-glow" disabled={loading}>
          {loading ? (
            <>
              <svg className="spinner-icon" width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
              </svg>
              Creating Account...
            </>
          ) : (
            <>
              Sign Up
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </>
          )}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <p className="auth-redirect">
          Already have an account? <Link to="/login" className="link-gradient">Login →</Link>
        </p>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Auth.modern.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        alert(`Login failed: ${error.message}`);
      } else {
        localStorage.setItem('token', data.session.access_token);
        navigate('/dashboard');
      }
    } catch (error) {
      alert('An error occurred during login.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-subtitle">Log in to continue to your projects.</p>
        <div className="auth-fieldset">
          <label className="auth-label">Email</label>
          <input 
            type="email"
            className="auth-input" 
            placeholder="you@example.com" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className="auth-fieldset">
          <label className="auth-label">Password</label>
          <input 
            type="password"
            className="auth-input" 
            placeholder="••••••••" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="auth-redirect">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

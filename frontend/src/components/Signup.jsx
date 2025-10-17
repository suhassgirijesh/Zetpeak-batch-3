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
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Get started with your first storyboard project.</p>
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
        <div className="auth-fieldset">
          <label className="auth-label">Confirm Password</label>
          <input 
            type="password"
            className="auth-input" 
            placeholder="••••••••" 
            required 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
          />
        </div>
        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

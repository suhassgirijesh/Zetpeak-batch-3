import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.modern.css';

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: '🎬', title: 'AI-Powered Generation', description: 'Transform scripts into stunning visual storyboards using advanced AI technology', color: 'var(--accent-purple)' },
    { icon: '⚡', title: 'Lightning Fast', description: 'Generate professional storyboards in seconds, not hours', color: 'var(--accent-cyan)' },
    { icon: '🎨', title: 'Cinema Quality', description: 'Professional-grade illustrations perfect for film and video production', color: 'var(--accent-pink)' },
  ];

  return (
    <div className="landing-modern">
      <div className="landing-bg-animated">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <section className={`hero-section ${isVisible ? 'visible' : ''}`}>
        <div className="hero-container">
          <div className="hero-badge animate-slide-up">
            <span className="badge-dot"></span>
            Powered by AI Technology
          </div>

          <h1 className="hero-title animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Bring Your Stories to <span className="gradient-text">Life</span>
          </h1>

          <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Transform your scripts into professional storyboards with the power of AI.
          </p>

          <div className="hero-buttons animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup" className="btn btn-primary btn-hero">
              <span>Get Started Free</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/login" className="btn btn-secondary btn-hero">Sign In</Link>
          </div>

          <div className="hero-stats animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="stat-item">
              <div className="stat-number">10k+</div>
              <div className="stat-label">Storyboards Created</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">AI Models</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="section-header animate-slide-up">
            <h2 className="section-title">Everything You Need to Create <span className="gradient-text">Amazing Storyboards</span></h2>
            <p className="section-subtitle">Powerful features designed for creative professionals</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card animate-slide-up hover-lift" style={{ animationDelay: `${0.1 * index}s` }}>
                <div className="feature-icon" style={{ color: feature.color }}>{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-glow" style={{ background: feature.color }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container glass-effect">
          <h2 className="cta-title animate-slide-up">Ready to Transform Your Stories?</h2>
          <p className="cta-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>Join thousands of creators bringing their visions to life</p>
          <Link to="/signup" className="btn btn-primary btn-cta animate-slide-up hover-glow" style={{ animationDelay: '0.2s' }}>Start Creating Now</Link>
        </div>
      </section>
    </div>
  );
}

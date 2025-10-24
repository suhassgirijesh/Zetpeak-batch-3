import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.modern.css';

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const projectTypes = [
    { 
      icon: '📺', 
      title: 'Ads & Commercials', 
      description: 'Create compelling visual narratives for advertising campaigns',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      icon: '🎬', 
      title: 'Short Films', 
      description: 'Bring your short film concepts to life with detailed storyboards',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      icon: '🎥', 
      title: 'Feature Films', 
      description: 'Professional-grade storyboards for full-length productions',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      icon: '📱', 
      title: 'Shorts & Reels', 
      description: 'Fast, engaging storyboards for social media content',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
  ];

  const features = [
    { 
      icon: '🤖', 
      title: 'AI Scene Generation', 
      description: 'Advanced AI transforms your script into professional storyboard scenes automatically',
      color: '#06b6d4' 
    },
    { 
      icon: '💰', 
      title: 'Budget Estimation', 
      description: 'Get accurate production cost estimates based on your storyboard complexity',
      color: '#8b5cf6' 
    },
    { 
      icon: '📊', 
      title: 'Project Management', 
      description: 'Organize, track, and collaborate on multiple projects seamlessly',
      color: '#3b82f6' 
    },
    { 
      icon: '📤', 
      title: 'Export & Share', 
      description: 'Export to PDF, image sequences, or share with your team instantly',
      color: '#ec4899' 
    },
  ];

  const benefits = [
    { title: 'Save Time', value: '10x Faster', description: 'Than traditional storyboarding' },
    { title: 'Creative Control', value: '100%', description: 'Full customization options' },
    { title: 'Industry Trust', value: '50K+', description: 'Storyboards created' },
    { title: 'Team Collaboration', value: 'Real-time', description: 'Work together seamlessly' },
  ];

  return (
    <div className="landing-modern">
      {/* Animated background with 6 orbs like wireframe */}
      <div className="landing-bg-animated">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="gradient-orb orb-5"></div>
        <div className="gradient-orb orb-6"></div>
      </div>

      {/* Landing topbar */}
      <div className="landing-topbar">
        <div className="ck-container landing-topbar-inner">
          <div className="landing-logo">
            <div className="logo-icon">C</div>
            <div className="logo-text">CiniKraft</div>
          </div>
          <div className="landing-cta">
            <Link to="/login" className="btn btn-primary small">Login / Sign Up</Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'visible' : ''}`}>
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-badge animate-slide-up">
              <span className="badge-dot"></span>
              AI-Powered Storyboarding Platform
            </div>

            <h1 className="hero-title animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Transform Your Script Into <span className="gradient-text">Stunning</span> Storyboards
            </h1>

            <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Create professional visual narratives for any project type with our AI-powered platform. From advertising campaigns to feature films, bring your stories to life instantly.
            </p>

            <div className="hero-buttons animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup" className="btn btn-primary btn-hero btn-glow">
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

          {/* Right media card */}
          <div className="hero-media">
            <div className="hero-media-card card-hover">
              <div className="hero-media-inner">
                <img 
                  src="/professional-storyboard.jpg" 
                  alt="Professional Storyboards" 
                  className="hero-media-img" 
                  onError={(e)=>{e.target.style.background='linear-gradient(135deg,#06b6d4,#3b82f6)'}} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Types Section */}
      <section className="project-types-section">
        <div className="ck-container">
          <div className="section-header animate-slide-up">
            <h2 className="section-title">Perfect For <span className="gradient-text">Any Project Type</span></h2>
            <p className="section-subtitle">From quick social media content to full feature films</p>
          </div>

          <div className="project-types-grid">
            {projectTypes.map((type, index) => (
              <div 
                key={index} 
                className="project-type-card card-hover animate-slide-up" 
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="project-type-gradient" style={{ background: type.gradient }}></div>
                <div className="project-type-icon">{type.icon}</div>
                <h3 className="project-type-title">{type.title}</h3>
                <p className="project-type-description">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="ck-container">
          <div className="section-header animate-slide-up">
            <h2 className="section-title">Everything You Need to Create <span className="gradient-text">Amazing Storyboards</span></h2>
            <p className="section-subtitle">Powerful features designed for creative professionals</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card-hover animate-slide-up hover-lift" style={{ animationDelay: `${0.1 * index}s` }}>
                <div className="feature-icon" style={{ color: feature.color }}>{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-glow" style={{ background: feature.color }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="ck-container">
          <div className="section-header animate-slide-up">
            <h2 className="section-title">Why Choose <span className="gradient-text">CiniKraft</span></h2>
            <p className="section-subtitle">Join thousands of creative professionals worldwide</p>
          </div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card glass-effect card-hover animate-scale-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <div className="benefit-label">{benefit.title}</div>
                <div className="benefit-value gradient-text">{benefit.value}</div>
                <div className="benefit-description">{benefit.description}</div>
              </div>
            ))}
          </div>

          <div className="benefits-image-grid">
            <div className="benefit-image-card card-hover">
              <img 
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600" 
                alt="Creative Team Collaboration" 
                className="benefit-img"
                onError={(e)=>{e.target.style.background='linear-gradient(135deg,#667eea,#764ba2)'}}
              />
              <div className="benefit-img-overlay">
                <div className="benefit-img-title">Collaborative Workspace</div>
              </div>
            </div>
            <div className="benefit-image-card card-hover">
              <img 
                src="/ai-powered-generation.jpg" 
                alt="AI-Powered Generation" 
                className="benefit-img"
                onError={(e)=>{e.target.style.background='linear-gradient(135deg,#f093fb,#f5576c)'}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg-animated">
          <div className="cta-orb cta-orb-1"></div>
          <div className="cta-orb cta-orb-2"></div>
        </div>
        <div className="ck-container">
          <div className="cta-content">
            <h2 className="cta-title text-neon animate-slide-up">Ready to Transform Your Stories?</h2>
            <p className="cta-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Join creative professionals worldwide who trust CiniKraft to bring their visions to life. 
              Start your free trial today and experience the future of storyboarding.
            </p>
            <div className="cta-buttons animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup" className="btn btn-primary btn-cta btn-glow">
                Start Free Trial
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginLeft: '8px' }}>
                  <path d="M10 3L17 10L10 17M17 10H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <button 
                onClick={() => navigate('/contact')} 
                className="btn btn-secondary btn-cta"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react'
import { Link } from 'react-router-dom'
import { FaRocket, FaBrain, FaChartLine, FaUsers } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

const Landing = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="company-badge">
            <span className="badge-text">Powered by Infosys</span>
          </div>
          <h1 className="hero-title">
            Master Your Interview Skills with <span className="highlight">AI</span>
          </h1>
          <p className="hero-subtitle">
            Practice with realistic mock interviews, get instant AI-powered feedback, 
            and land your dream job at top companies like Infosys.
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                <FaRocket /> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">
                  <FaRocket /> Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <FaBrain className="card-icon" />
            <span>AI-Powered Feedback</span>
          </div>
          <div className="floating-card card-2">
            <FaChartLine className="card-icon" />
            <span>Track Progress</span>
          </div>
          <div className="floating-card card-3">
            <FaUsers className="card-icon" />
            <span>5000+ Users</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose InterviewPro?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaBrain />
            </div>
            <h3>AI-Powered Evaluation</h3>
            <p>Get detailed feedback on communication, technical knowledge, and confidence from our advanced AI system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Performance Analytics</h3>
            <p>Track your progress over time with detailed analytics and identify areas for improvement.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaRocket />
            </div>
            <h3>Real Interview Questions</h3>
            <p>Practice with questions from actual interviews at top tech companies including Infosys.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up for free and set up your profile</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Start Interview</h3>
            <p>Choose your interview type and begin practicing</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Feedback</h3>
            <p>Receive AI-generated feedback and improve</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Ace Your Next Interview?</h2>
          <p>Join thousands of candidates who have improved their interview skills with InterviewPro.</p>
          {!isAuthenticated && (
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Practicing Now
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-icon">IP</span>
            <span className="logo-text">InterviewPro</span>
          </div>
          <p className="footer-text">
            © 2024 InterviewPro. A project for Infosys interview preparation.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing

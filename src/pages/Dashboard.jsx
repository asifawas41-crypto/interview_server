import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlay, FaHistory, FaChartLine, FaTrophy, FaClock } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    { icon: <FaPlay />, label: 'Interviews Taken', value: '0' },
    { icon: <FaTrophy />, label: 'Average Score', value: 'N/A' },
    { icon: <FaClock />, label: 'Practice Time', value: '0 min' },
  ]

  const handleStartInterview = () => {
    navigate('/interview')
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Ready to ace your next interview? Let's get practicing!</p>
          </div>
          <div className="welcome-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card primary" onClick={handleStartInterview}>
              <div className="action-icon">
                <FaPlay />
              </div>
              <div className="action-content">
                <h3>Start Mock Interview</h3>
                <p>Practice with AI-generated questions and get instant feedback</p>
              </div>
            </div>
            
            <Link to="/history" className="action-card">
              <div className="action-icon secondary">
                <FaHistory />
              </div>
              <div className="action-content">
                <h3>View Past Performance</h3>
                <p>Review your previous interviews and track improvement</p>
              </div>
            </Link>
            
            <div className="action-card">
              <div className="action-icon tertiary">
                <FaChartLine />
              </div>
              <div className="action-content">
                <h3>Analytics</h3>
                <p>Detailed insights on your interview performance</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interview Categories */}
        <section className="interview-categories">
          <h2>Interview Categories</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-header">
                <span className="category-badge technical">Technical</span>
              </div>
              <h3>Technical Interview</h3>
              <p>Programming, system design, and technical concepts</p>
              <button className="btn btn-outline btn-sm" onClick={handleStartInterview}>
                Start Practice
              </button>
            </div>
            
            <div className="category-card">
              <div className="category-header">
                <span className="category-badge behavioral">Behavioral</span>
              </div>
              <h3>Behavioral Interview</h3>
              <p>Situational questions and soft skills assessment</p>
              <button className="btn btn-outline btn-sm" onClick={handleStartInterview}>
                Start Practice
              </button>
            </div>
            
            <div className="category-card">
              <div className="category-header">
                <span className="category-badge hr">HR</span>
              </div>
              <h3>HR Interview</h3>
              <p>Company fit, career goals, and cultural alignment</p>
              <button className="btn btn-outline btn-sm" onClick={handleStartInterview}>
                Start Practice
              </button>
            </div>
            
            <div className="category-card">
              <div className="category-header">
                <span className="category-badge aptitude">Aptitude</span>
              </div>
              <h3>Aptitude Test</h3>
              <p>Logical reasoning and problem-solving questions</p>
              <button className="btn btn-outline btn-sm" onClick={handleStartInterview}>
                Start Practice
              </button>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="tips-section">
          <h2>Interview Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-number">1</span>
              <p>Research the company thoroughly before your interview</p>
            </div>
            <div className="tip-card">
              <span className="tip-number">2</span>
              <p>Practice the STAR method for behavioral questions</p>
            </div>
            <div className="tip-card">
              <span className="tip-number">3</span>
              <p>Prepare questions to ask the interviewer</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard

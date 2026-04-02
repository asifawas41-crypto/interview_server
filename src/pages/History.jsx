import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCalendar, FaChartLine, FaArrowRight, FaClipboardList } from 'react-icons/fa'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const History = () => {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/interview/history/`)
      setSessions(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch history:', error)
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score) => {
    if (!score) return 'pending'
    if (score >= 8) return 'excellent'
    if (score >= 6) return 'good'
    if (score >= 4) return 'average'
    return 'needs-improvement'
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'completed': { class: 'completed', text: 'Completed' },
      'in_progress': { class: 'in-progress', text: 'In Progress' },
      'abandoned': { class: 'abandoned', text: 'Abandoned' }
    }
    return statusMap[status] || { class: 'unknown', text: status }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading history...</p>
      </div>
    )
  }

  return (
    <div className="history-page">
      <div className="history-container">
        {/* Header */}
        <div className="history-header">
          <h1><FaClipboardList /> Interview History</h1>
          <p>Track your progress and review past interviews</p>
        </div>

        {/* Stats Overview */}
        {sessions.length > 0 && (
          <div className="history-stats">
            <div className="stat-box">
              <span className="stat-value">{sessions.length}</span>
              <span className="stat-label">Total Sessions</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">
                {sessions.filter(s => s.status === 'completed').length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">
                {sessions.filter(s => s.total_score).length > 0
                  ? (sessions.reduce((sum, s) => sum + (s.total_score || 0), 0) / 
                     sessions.filter(s => s.total_score).length).toFixed(1)
                  : 'N/A'}
              </span>
              <span className="stat-label">Avg Score</span>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="sessions-list">
          {sessions.length === 0 ? (
            <div className="empty-state">
              <FaClipboardList className="empty-icon" />
              <h3>No interviews yet</h3>
              <p>Start your first mock interview to see your history here</p>
              <button className="btn btn-primary" onClick={() => navigate('/interview')}>
                Start Interview
              </button>
            </div>
          ) : (
            sessions.map((session) => {
              const statusBadge = getStatusBadge(session.status)
              return (
                <div key={session.id} className="session-card">
                  <div className="session-info">
                    <div className="session-header">
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                      <span className="session-date">
                        <FaCalendar /> {formatDate(session.started_at)}
                      </span>
                    </div>
                    
                    <div className="session-details">
                      <div className="detail-item">
                        <FaClipboardList />
                        <span>{session.answer_count} Questions Answered</span>
                      </div>
                      {session.total_score && (
                        <div className="detail-item">
                          <FaChartLine />
                          <span>Score: </span>
                          <span className={`score-value ${getScoreColor(session.total_score)}`}>
                            {session.total_score}/10
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="session-actions">
                    {session.status === 'completed' && (
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/feedback/${session.id}`)}
                      >
                        View Feedback <FaArrowRight />
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default History

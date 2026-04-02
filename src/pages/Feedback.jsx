import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaRedo, FaTrophy, FaChartBar } from 'react-icons/fa'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const Feedback = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [sessionData, setSessionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessionDetails()
  }, [sessionId])

  const fetchSessionDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/interview/session/${sessionId}/`)
      setSessionData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch session details:', error)
      setLoading(false)
    }
  }

  const calculateAverageScore = () => {
    if (!sessionData?.answers?.length) return 0
    const total = sessionData.answers.reduce((sum, ans) => {
      return sum + (ans.feedback?.overall_score || 0)
    }, 0)
    return (total / sessionData.answers.length).toFixed(1)
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'excellent'
    if (score >= 6) return 'good'
    if (score >= 4) return 'average'
    return 'needs-improvement'
  }

  const getScoreMessage = (score) => {
    if (score >= 8) return 'Excellent performance!'
    if (score >= 6) return 'Good job! Room for improvement.'
    if (score >= 4) return 'Average performance. Keep practicing!'
    return 'Needs improvement. Don\'t give up!'
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading feedback...</p>
      </div>
    )
  }

  const averageScore = calculateAverageScore()

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        {/* Header */}
        <div className="feedback-header">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>Interview Feedback</h1>
        </div>

        {/* Overall Score Card */}
        <div className="overall-feedback-card">
          <div className={`score-circle ${getScoreColor(parseFloat(averageScore))}`}>
            <FaTrophy className="trophy-icon" />
            <span className="score-value">{averageScore}</span>
            <span className="score-total">/ 10</span>
          </div>
          <div className="score-message">
            <h2>{getScoreMessage(parseFloat(averageScore))}</h2>
            <p>You completed {sessionData?.answers?.length || 0} questions in this session</p>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="performance-section">
          <h3><FaChartBar /> Performance Breakdown</h3>
          
          {sessionData?.answers?.map((answer, index) => (
            <div key={index} className="answer-feedback-card">
              <div className="answer-header">
                <span className="question-number">Q{index + 1}</span>
                <span className={`score-badge ${getScoreColor(answer.feedback?.overall_score)}`}>
                  {answer.feedback?.overall_score || 0}/10
                </span>
              </div>
              
              <div className="question-text">
                <p>{answer.question?.text}</p>
              </div>

              <div className="your-answer">
                <h4>Your Answer:</h4>
                <p>{answer.answer_text}</p>
              </div>

              <div className="detailed-scores">
                <div className="score-row">
                  <span>Communication</span>
                  <div className="mini-bar">
                    <div 
                      className="mini-fill" 
                      style={{ width: `${(answer.feedback?.communication_score || 0) * 10}%` }}
                    ></div>
                  </div>
                  <span>{answer.feedback?.communication_score || 0}</span>
                </div>
                <div className="score-row">
                  <span>Technical</span>
                  <div className="mini-bar">
                    <div 
                      className="mini-fill" 
                      style={{ width: `${(answer.feedback?.technical_score || 0) * 10}%` }}
                    ></div>
                  </div>
                  <span>{answer.feedback?.technical_score || 0}</span>
                </div>
                <div className="score-row">
                  <span>Confidence</span>
                  <div className="mini-bar">
                    <div 
                      className="mini-fill" 
                      style={{ width: `${(answer.feedback?.confidence_score || 0) * 10}%` }}
                    ></div>
                  </div>
                  <span>{answer.feedback?.confidence_score || 0}</span>
                </div>
                <div className="score-row">
                  <span>Grammar</span>
                  <div className="mini-bar">
                    <div 
                      className="mini-fill" 
                      style={{ width: `${(answer.feedback?.grammar_score || 0) * 10}%` }}
                    ></div>
                  </div>
                  <span>{answer.feedback?.grammar_score || 0}</span>
                </div>
                <div className="score-row">
                  <span>Relevance</span>
                  <div className="mini-bar">
                    <div 
                      className="mini-fill" 
                      style={{ width: `${(answer.feedback?.relevance_score || 0) * 10}%` }}
                    ></div>
                  </div>
                  <span>{answer.feedback?.relevance_score || 0}</span>
                </div>
              </div>

              <div className="ai-feedback">
                <h4>AI Feedback:</h4>
                <p>{answer.feedback?.feedback_text}</p>
              </div>

              <div className="suggestions-box">
                <h4>Suggestions for Improvement:</h4>
                <p>{answer.feedback?.suggestions}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="feedback-actions">
          <button className="btn btn-outline" onClick={() => navigate('/history')}>
            <FaChartBar /> View All History
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/interview')}>
            <FaRedo /> Practice Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default Feedback

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMicrophone, FaMicrophoneSlash, FaClock, FaArrowRight, FaCheck } from 'react-icons/fa'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const Interview = () => {
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes per question
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    startInterview()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !feedback) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSubmitAnswer()
    }
    return () => clearInterval(timerRef.current)
  }, [timeLeft, feedback])

  const startInterview = async () => {
    try {
      // Start new session
      const sessionRes = await axios.post(`${API_URL}/interview/start/`)
      setSessionId(sessionRes.data.session_id)

      // Fetch questions
      const questionsRes = await axios.get(`${API_URL}/questions/?limit=5`)
      setQuestions(questionsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to start interview:', error)
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || submitting) return

    setSubmitting(true)
    const timeTaken = 120 - timeLeft

    try {
      const response = await axios.post(`${API_URL}/interview/submit-answer/`, {
        session_id: sessionId,
        question_id: questions[currentQuestionIndex].id,
        answer_text: answer,
        time_taken: timeTaken
      })

      setFeedback(response.data.feedback)
    } catch (error) {
      console.error('Failed to submit answer:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setAnswer('')
      setTimeLeft(120)
      setFeedback(null)
    } else {
      completeInterview()
    }
  }

  const completeInterview = async () => {
    try {
      await axios.post(`${API_URL}/interview/complete/${sessionId}/`)
      navigate(`/feedback/${sessionId}`)
    } catch (error) {
      console.error('Failed to complete interview:', error)
    }
  }

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser')
      return
    }

    if (isListening) {
      setIsListening(false)
    } else {
      setIsListening(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        setAnswer(transcript)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognition.start()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Preparing your interview...</p>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="interview-page">
      <div className="interview-container">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-info">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-header">
            <span className={`category-badge ${currentQuestion?.category}`}>
              {currentQuestion?.category}
            </span>
            <div className={`timer ${timeLeft < 30 ? 'warning' : ''}`}>
              <FaClock /> {formatTime(timeLeft)}
            </div>
          </div>
          
          <h2 className="question-text">{currentQuestion?.text}</h2>
        </div>

        {/* Answer Section */}
        {!feedback ? (
          <div className="answer-section">
            <div className="answer-input-container">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                disabled={submitting}
              />
              <button
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleVoiceInput}
                title={isListening ? 'Stop recording' : 'Start voice input'}
              >
                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
            </div>
            
            <button
              className="btn btn-primary btn-full"
              onClick={handleSubmitAnswer}
              disabled={!answer.trim() || submitting}
            >
              {submitting ? 'Submitting...' : <><FaCheck /> Submit Answer</>}
            </button>
          </div>
        ) : (
          <div className="feedback-section">
            <div className="feedback-card">
              <h3>AI Feedback</h3>
              
              <div className="score-display">
                <div className="overall-score">
                  <span className="score-value">{feedback.overall_score}</span>
                  <span className="score-label">/ 10</span>
                </div>
              </div>

              <div className="score-breakdown">
                <div className="score-item">
                  <span>Communication</span>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${feedback.communication_score * 10}%` }}></div>
                  </div>
                  <span>{feedback.communication_score}</span>
                </div>
                <div className="score-item">
                  <span>Technical</span>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${feedback.technical_score * 10}%` }}></div>
                  </div>
                  <span>{feedback.technical_score}</span>
                </div>
                <div className="score-item">
                  <span>Confidence</span>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${feedback.confidence_score * 10}%` }}></div>
                  </div>
                  <span>{feedback.confidence_score}</span>
                </div>
              </div>

              <div className="feedback-text">
                <h4>Feedback</h4>
                <p>{feedback.feedback_text}</p>
              </div>

              <div className="suggestions">
                <h4>Suggestions</h4>
                <p>{feedback.suggestions}</p>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <><FaArrowRight /> Next Question</>
              ) : (
                <><FaCheck /> Complete Interview</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Interview

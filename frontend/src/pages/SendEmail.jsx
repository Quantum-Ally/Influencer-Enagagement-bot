import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, FileText, Edit, Tag, Signal, Send, CheckCircle, XCircle, Loader } from 'lucide-react'
import { sendEmail } from '../services/api'
import Toast from '../components/Toast'
import './SendEmail.css'

const SendEmail = () => {
  const [formData, setFormData] = useState({
    influencerName: '',
    email: '',
    subject: '',
    description: '',
    category: 'meeting',
    priority: 'medium'
  })
  
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})

  const categories = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'collaboration', label: 'Collaboration' }
  ]

  const priorities = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.influencerName.trim()) {
      newErrors.influencerName = 'Influencer name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setToast({ type: 'error', message: 'Please fix the errors in the form' })
      return
    }

    setLoading(true)
    
    try {
      const requestData = {
        request_type: 'send_email',
        supervisor_id: 'SUP_001',
        session_token: `SESSION_TOKEN_${Date.now()}`,
        influencer: {
          name: formData.influencerName,
          email: formData.email
        },
        email_details: {
          subject: formData.subject,
          description: formData.description,
          category: formData.category
        },
        meta: {
          priority: formData.priority,
          requested_at: new Date().toISOString()
        }
      }

      const response = await sendEmail(requestData)
      
      if (response.status === 'success') {
        setToast({ type: 'success', message: 'Email sent successfully!' })
        setFormData({
          influencerName: '',
          email: '',
          subject: '',
          description: '',
          category: 'meeting',
          priority: 'medium'
        })
        setErrors({})
      } else {
        setToast({ type: 'error', message: response.error || 'Failed to send email' })
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Failed to send email' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  return (
    <div className="send-email-page">
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="hero-title">
          Influencer Engagement Hub
        </h1>
        <p className="hero-subtitle">
          Connect and engage with influencers seamlessly
        </p>
      </motion.div>

      <motion.div
        className="email-composer-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-group">
            <label className="input-label">
              <User size={20} />
              <span>Influencer Name</span>
            </label>
            <input
              type="text"
              className={`glass-input ${errors.influencerName ? 'error' : ''}`}
              placeholder="Enter influencer name"
              value={formData.influencerName}
              onChange={(e) => handleChange('influencerName', e.target.value)}
            />
            {errors.influencerName && (
              <span className="error-message">{errors.influencerName}</span>
            )}
          </div>

          <div className="form-group">
            <label className="input-label">
              <Mail size={20} />
              <span>Email</span>
            </label>
            <input
              type="email"
              className={`glass-input ${errors.email ? 'error' : ''}`}
              placeholder="influencer@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label className="input-label">
              <FileText size={20} />
              <span>Subject</span>
            </label>
            <input
              type="text"
              className={`glass-input ${errors.subject ? 'error' : ''}`}
              placeholder="Email subject"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
            />
            {errors.subject && (
              <span className="error-message">{errors.subject}</span>
            )}
          </div>

          <div className="form-group">
            <label className="input-label">
              <Edit size={20} />
              <span>Description</span>
            </label>
            <textarea
              className={`glass-input glass-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Describe the purpose of this email..."
              rows={5}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="input-label">
                <Tag size={20} />
                <span>Category</span>
              </label>
              <select
                className="glass-input glass-select"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">
                <Signal size={20} />
                <span>Priority</span>
              </label>
              <div className="priority-buttons">
                {priorities.map(pri => (
                  <button
                    key={pri.value}
                    type="button"
                    className={`priority-btn ${formData.priority === pri.value ? 'active' : ''}`}
                    onClick={() => handleChange('priority', pri.value)}
                  >
                    {pri.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            className="send-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <Loader className="spinner" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Send Email</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default SendEmail


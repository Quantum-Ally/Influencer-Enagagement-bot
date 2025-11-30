import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, FileText, Edit, Tag, Signal, Send, CheckCircle, XCircle, Loader, Eye, X, Sparkles } from 'lucide-react'
import { sendEmail } from '../services/api'
import { emailTemplates, getTemplatesByCategory } from '../utils/templates'
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
  const [showPreview, setShowPreview] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

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

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      subject: template.subject,
      description: template.description,
      category: template.category,
      priority: template.priority
    }))
    setShowTemplates(false)
    setToast({ type: 'success', message: 'Template applied successfully!' })
  }

  const generatePreview = () => {
    if (!formData.influencerName || !formData.description) {
      return null
    }

    // Client-side preview generation (mimics what backend might generate)
    const preview = `Hi ${formData.influencerName},\n\n${formData.description}\n\nBest regards`
    return preview
  }

  const availableTemplates = getTemplatesByCategory(formData.category)

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
        <div className="composer-header">
          <h2>Compose Email</h2>
          <div className="header-actions">
            <button
              type="button"
              className="template-btn"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <Sparkles size={18} />
              <span>Templates</span>
            </button>
            <button
              type="button"
              className="preview-btn"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!formData.influencerName || !formData.description}
            >
              <Eye size={18} />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {showTemplates && (
          <motion.div
            className="templates-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="templates-header">
              <h3>Email Templates - {formData.category}</h3>
              <button className="close-templates" onClick={() => setShowTemplates(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="templates-grid">
              {availableTemplates.map(template => (
                <motion.div
                  key={template.id}
                  className="template-card"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <h4>{template.name}</h4>
                  <p className="template-subject">{template.subject}</p>
                  <p className="template-description">{template.description.substring(0, 80)}...</p>
                  <span className="template-priority">{template.priority}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {showPreview && (
          <motion.div
            className="preview-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="preview-header">
              <h3>Email Preview</h3>
              <button className="close-preview" onClick={() => setShowPreview(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="preview-content">
              <div className="preview-meta">
                <div><strong>To:</strong> {formData.email || '[Email]'}</div>
                <div><strong>Subject:</strong> {formData.subject || '[Subject]'}</div>
                <div><strong>Category:</strong> {formData.category}</div>
                <div><strong>Priority:</strong> {formData.priority}</div>
              </div>
              <div className="preview-body">
                {generatePreview() || 'Fill in the form to see preview'}
              </div>
            </div>
          </motion.div>
        )}

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


import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Search, Calendar, Tag, User, Clock, Copy, X, CheckCircle, AlertCircle } from 'lucide-react'
import { getSentEmails } from '../services/api'
import Toast from '../components/Toast'
import { formatDistanceToNow } from 'date-fns'
import './SentEmails.css'

const SentEmails = () => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [expandedEmail, setExpandedEmail] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    date_from: '',
    date_to: ''
  })
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    queued: 0
  })

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'collaboration', label: 'Collaboration' }
  ]

  useEffect(() => {
    fetchEmails()
  }, [filters])

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const filterParams = {}
      if (filters.category) filterParams.category = filters.category
      if (filters.date_from) {
        // Convert YYYY-MM-DD to ISO format with time
        filterParams.date_from = new Date(filters.date_from + 'T00:00:00Z').toISOString()
      }
      if (filters.date_to) {
        // Convert YYYY-MM-DD to ISO format with time
        filterParams.date_to = new Date(filters.date_to + 'T23:59:59Z').toISOString()
      }
      // Only use search as influencer_email if it looks like an email
      if (filters.search && filters.search.includes('@')) {
        filterParams.influencer_email = filters.search
      }

      const response = await getSentEmails(filterParams)
      
      if (response.status === 'success') {
        let filteredEmails = response.emails || []
        
        // Client-side search filter (for non-email searches)
        if (filters.search && !filters.search.includes('@')) {
          const searchLower = filters.search.toLowerCase()
          filteredEmails = filteredEmails.filter(email => 
            email.subject?.toLowerCase().includes(searchLower) ||
            email.to?.toLowerCase().includes(searchLower) ||
            email.influencer_name?.toLowerCase().includes(searchLower) ||
            email.body?.toLowerCase().includes(searchLower)
          )
        }
        
        setEmails(filteredEmails)
        
        // Calculate stats
        const total = filteredEmails.length
        const success = filteredEmails.filter(e => e.delivery_status === 'delivered').length
        const queued = filteredEmails.filter(e => e.delivery_status === 'queued').length
        
        setStats({ total, success, queued })
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Failed to fetch emails' })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyEmail = async (emailBody) => {
    try {
      await navigator.clipboard.writeText(emailBody)
      setToast({ type: 'success', message: 'Email copied to clipboard!' })
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to copy email' })
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      meeting: '#3b82f6',
      negotiation: '#f59e0b',
      'follow-up': '#10b981',
      collaboration: '#a855f7'
    }
    return colors[category] || '#6b7280'
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return dateString
    }
  }

  return (
    <div className="sent-emails-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="page-title">Sent Emails Dashboard</h1>
        <p className="page-subtitle">View and manage all sent emails</p>
      </motion.div>

      <motion.div
        className="stats-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <StatsCard
          title="Total Emails"
          value={stats.total}
          icon={Mail}
          color={getCategoryColor('meeting')}
        />
        <StatsCard
          title="Delivered"
          value={stats.success}
          icon={CheckCircle}
          color={getCategoryColor('follow-up')}
        />
        <StatsCard
          title="Queued"
          value={stats.queued}
          icon={AlertCircle}
          color={getCategoryColor('negotiation')}
        />
      </motion.div>

      <motion.div
        className="filter-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="filter-group">
          <Search size={20} className="filter-icon" />
          <input
            type="text"
            className="glass-input filter-input"
            placeholder="Search by email, subject, or name..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>

        <div className="filter-group">
          <Tag size={20} className="filter-icon" />
          <select
            className="glass-input glass-select filter-select"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <Calendar size={20} className="filter-icon" />
          <input
            type="date"
            className="glass-input filter-input"
            value={filters.date_from}
            onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
            placeholder="From"
          />
        </div>

        <div className="filter-group">
          <Calendar size={20} className="filter-icon" />
          <input
            type="date"
            className="glass-input filter-input"
            value={filters.date_to}
            onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
            placeholder="To"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading emails...</p>
        </div>
      ) : emails.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Mail size={64} className="empty-icon" />
          <h3>No emails found</h3>
          <p>Start sending emails to see them here</p>
        </motion.div>
      ) : (
        <motion.div
          className="emails-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {emails.map((email, index) => (
            <EmailCard
              key={email.email_id || index}
              email={email}
              isExpanded={expandedEmail === email.email_id}
              onExpand={() => setExpandedEmail(expandedEmail === email.email_id ? null : email.email_id)}
              onCopy={handleCopyEmail}
              getCategoryColor={getCategoryColor}
              formatDate={formatDate}
            />
          ))}
        </motion.div>
      )}

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

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      className="stats-card"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="stats-card-content">
        <div className="stats-icon" style={{ color }}>
          <Icon size={24} />
        </div>
        <div className="stats-info">
          <p className="stats-value">{value}</p>
          <p className="stats-title">{title}</p>
        </div>
      </div>
    </motion.div>
  )
}

const EmailCard = ({ email, isExpanded, onExpand, onCopy, getCategoryColor, formatDate }) => {
  return (
    <motion.div
      className={`email-card ${isExpanded ? 'expanded' : ''}`}
      whileHover={{ scale: 1.02 }}
      onClick={onExpand}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="email-card-header">
        <span className="email-id-badge">{email.email_id}</span>
        <span
          className="category-tag"
          style={{ backgroundColor: `${getCategoryColor(email.category)}20`, color: getCategoryColor(email.category) }}
        >
          {email.category}
        </span>
      </div>

      <h3 className="email-subject">{email.subject}</h3>
      <p className="email-preview">{email.body_preview || email.body?.substring(0, 100) + '...'}</p>

      <div className="email-meta">
        <div className="email-meta-item">
          <User size={16} />
          <span>{email.to || email.influencer_email}</span>
        </div>
        <div className="email-meta-item">
          <Clock size={16} />
          <span>{formatDate(email.sent_at)}</span>
        </div>
      </div>

      <div className="email-status">
        <span className={`status-badge ${email.delivery_status === 'delivered' ? 'delivered' : 'queued'}`}>
          {email.delivery_status || 'queued'}
        </span>
      </div>

      {isExpanded && (
        <motion.div
          className="email-expanded"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="email-expanded-header">
            <h4>Full Email Content</h4>
            <button className="close-btn" onClick={(e) => { e.stopPropagation(); onExpand(); }}>
              <X size={20} />
            </button>
          </div>
          <div className="email-body-full">
            <p>{email.body}</p>
          </div>
          <button
            className="copy-btn"
            onClick={(e) => { e.stopPropagation(); onCopy(email.body); }}
          >
            <Copy size={16} />
            <span>Copy to Clipboard</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default SentEmails


import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Mail, User, Tag, Calendar } from 'lucide-react'
import { getSentEmails } from '../services/api'
import { format, parseISO, isSameDay } from 'date-fns'
import { groupEmailsBy, filterEmails, sortEmails } from '../utils/dataUtils'
import Toast from '../components/Toast'
import './Timeline.css'

const Timeline = () => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [groupBy, setGroupBy] = useState('date')
  const [expandedGroups, setExpandedGroups] = useState(new Set())

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const response = await getSentEmails({})
      if (response.status === 'success') {
        const sorted = sortEmails(response.emails || [], 'date', 'desc')
        setEmails(sorted)
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Failed to fetch emails' })
    } finally {
      setLoading(false)
    }
  }

  const groupedEmails = groupEmailsBy(emails, groupBy)
  const sortedGroups = Object.keys(groupedEmails).sort((a, b) => {
    if (groupBy === 'date') {
      return b.localeCompare(a)
    }
    return a.localeCompare(b)
  })

  const toggleGroup = (key) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedGroups(newExpanded)
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

  const formatGroupLabel = (key) => {
    if (groupBy === 'date') {
      try {
        const date = parseISO(key)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (isSameDay(date, today)) return 'Today'
        if (isSameDay(date, yesterday)) return 'Yesterday'
        return format(date, 'MMMM d, yyyy')
      } catch {
        return key
      }
    }
    return key
  }

  return (
    <div className="timeline-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="page-title">Email Timeline</h1>
        <p className="page-subtitle">Chronological view of all your emails</p>
      </motion.div>

      <motion.div
        className="timeline-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="group-selector">
          <label>Group by:</label>
          <select
            className="glass-input glass-select"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="influencer">Influencer</option>
            <option value="category">Category</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading timeline...</p>
        </div>
      ) : sortedGroups.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Mail size={64} className="empty-icon" />
          <h3>No emails found</h3>
          <p>Start sending emails to see them in the timeline</p>
        </motion.div>
      ) : (
        <div className="timeline-container">
          {sortedGroups.map((groupKey, groupIndex) => {
            const groupEmails = groupedEmails[groupKey]
            const isExpanded = expandedGroups.has(groupKey) || groupIndex === 0

            return (
              <motion.div
                key={groupKey}
                className="timeline-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              >
                <div
                  className="timeline-group-header"
                  onClick={() => toggleGroup(groupKey)}
                >
                  <div className="group-info">
                    <h3 className="group-title">{formatGroupLabel(groupKey)}</h3>
                    <span className="group-count">{groupEmails.length} email{groupEmails.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                    ▼
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    className="timeline-items"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {groupEmails.map((email, index) => (
                      <TimelineItem
                        key={email.email_id || index}
                        email={email}
                        getCategoryColor={getCategoryColor}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
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

const TimelineItem = ({ email, getCategoryColor }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className="timeline-item"
      whileHover={{ scale: 1.02 }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="timeline-dot" style={{ borderColor: getCategoryColor(email.category) }}>
        <div className="timeline-dot-inner" style={{ backgroundColor: getCategoryColor(email.category) }} />
      </div>
      <div className="timeline-content">
        <div className="timeline-header">
          <h4 className="timeline-subject">{email.subject}</h4>
          <span
            className="timeline-category"
            style={{
              backgroundColor: `${getCategoryColor(email.category)}20`,
              color: getCategoryColor(email.category)
            }}
          >
            {email.category}
          </span>
        </div>
        <div className="timeline-meta">
          <div className="meta-item">
            <User size={14} />
            <span>{email.influencer_name || email.to}</span>
          </div>
          <div className="meta-item">
            <Clock size={14} />
            <span>{format(parseISO(email.sent_at), 'h:mm a')}</span>
          </div>
        </div>
        {expanded && (
          <motion.div
            className="timeline-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p>{email.body}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Timeline


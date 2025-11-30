import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Mail, Search, Calendar, Tag, User, Clock, Copy, X, CheckCircle, AlertCircle, Download, ArrowUpDown, Filter, XCircle, Grid, List } from 'lucide-react'
import { getSentEmails } from '../services/api'
import Toast from '../components/Toast'
import { formatDistanceToNow } from 'date-fns'
import { filterEmails, sortEmails, groupEmailsBy, getQuickFilterDates, getUniqueValues } from '../utils/dataUtils'
import { exportToCSV, exportToPDF } from '../utils/exportUtils'
import './SentEmails.css'

const SentEmails = () => {
  const [allEmails, setAllEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [expandedEmail, setExpandedEmail] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priority: '',
    status: '',
    date_from: '',
    date_to: ''
  })
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [groupBy, setGroupBy] = useState('none')
  const [viewMode, setViewMode] = useState('grid')
  const [savedFilters, setSavedFilters] = useState([])
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'collaboration', label: 'Collaboration' }
  ]

  useEffect(() => {
    fetchEmails()
  }, [])

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedFilters')
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved filters')
      }
    }
  }, [])

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
        setAllEmails(response.emails || [])
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

  // Process emails with filters, sorting, and grouping
  const processedEmails = useMemo(() => {
    let result = [...allEmails]
    
    // Apply filters
    result = filterEmails(result, {
      search: filters.search,
      category: filters.category,
      priority: filters.priority,
      status: filters.status,
      dateFrom: filters.date_from,
      dateTo: filters.date_to
    })
    
    // Apply sorting
    result = sortEmails(result, sortBy, sortOrder)
    
    return result
  }, [allEmails, filters, sortBy, sortOrder])

  // Group emails if needed
  const groupedEmails = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Emails': processedEmails }
    }
    return groupEmailsBy(processedEmails, groupBy)
  }, [processedEmails, groupBy])

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: processedEmails.length,
      success: processedEmails.filter(e => e.delivery_status === 'delivered').length,
      queued: processedEmails.filter(e => e.delivery_status === 'queued').length
    }
  }, [processedEmails])

  const getCategoryColor = (category) => {
    const colors = {
      meeting: '#3b82f6',
      negotiation: '#f59e0b',
      'follow-up': '#10b981',
      collaboration: '#a855f7'
    }
    return colors[category] || '#6b7280'
  }

  const handleQuickFilter = (filterType) => {
    const dateRange = getQuickFilterDates(filterType)
    setFilters(prev => ({
      ...prev,
      date_from: dateRange.dateFrom || '',
      date_to: dateRange.dateTo || ''
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priority: '',
      status: '',
      date_from: '',
      date_to: ''
    })
  }

  const getActiveFilters = () => {
    const active = []
    if (filters.search) active.push({ key: 'search', label: `Search: ${filters.search}` })
    if (filters.category) active.push({ key: 'category', label: `Category: ${filters.category}` })
    if (filters.priority) active.push({ key: 'priority', label: `Priority: ${filters.priority}` })
    if (filters.status) active.push({ key: 'status', label: `Status: ${filters.status}` })
    if (filters.date_from) active.push({ key: 'date_from', label: `From: ${filters.date_from}` })
    if (filters.date_to) active.push({ key: 'date_to', label: `To: ${filters.date_to}` })
    return active
  }

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }))
  }

  const saveCurrentFilter = () => {
    const filterName = prompt('Enter a name for this filter:')
    if (filterName) {
      const newFilter = {
        id: Date.now(),
        name: filterName,
        filters: { ...filters }
      }
      const updated = [...savedFilters, newFilter]
      setSavedFilters(updated)
      localStorage.setItem('savedFilters', JSON.stringify(updated))
      setToast({ type: 'success', message: 'Filter saved successfully!' })
    }
  }

  const loadSavedFilter = (savedFilter) => {
    setFilters(savedFilter.filters)
    setToast({ type: 'success', message: `Filter "${savedFilter.name}" loaded!` })
  }

  const handleExport = (format) => {
    if (processedEmails.length === 0) {
      setToast({ type: 'error', message: 'No emails to export' })
      return
    }
    
    if (format === 'csv') {
      exportToCSV(processedEmails, 'emails')
      setToast({ type: 'success', message: 'Exported to CSV!' })
    } else if (format === 'pdf') {
      exportToPDF(processedEmails, 'emails')
      setToast({ type: 'success', message: 'Exported to PDF!' })
    }
  }

  const uniqueInfluencers = useMemo(() => getUniqueValues(allEmails, 'influencer_name'), [allEmails])

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
        className="controls-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="quick-filters">
          <span className="quick-filter-label">Quick Filters:</span>
          <button className="quick-filter-btn" onClick={() => handleQuickFilter('today')}>Today</button>
          <button className="quick-filter-btn" onClick={() => handleQuickFilter('thisWeek')}>This Week</button>
          <button className="quick-filter-btn" onClick={() => handleQuickFilter('thisMonth')}>This Month</button>
          <button className="quick-filter-btn" onClick={() => handleQuickFilter('lastWeek')}>Last Week</button>
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            <Search size={20} className="filter-icon" />
            <input
              type="text"
              className="glass-input filter-input"
              placeholder="Search by email, subject, or name..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              list="influencer-suggestions"
            />
            <datalist id="influencer-suggestions">
              {uniqueInfluencers.slice(0, 10).map((name, idx) => (
                <option key={idx} value={name} />
              ))}
            </datalist>
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
            <select
              className="glass-input glass-select filter-select"
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              className="glass-input glass-select filter-select"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Status</option>
              <option value="queued">Queued</option>
              <option value="delivered">Delivered</option>
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
        </div>

        <div className="filter-chips">
          {getActiveFilters().map(filter => (
            <motion.div
              key={filter.key}
              className="filter-chip"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span>{filter.label}</span>
              <button onClick={() => removeFilter(filter.key)} className="chip-remove">
                <XCircle size={14} />
              </button>
            </motion.div>
          ))}
          {getActiveFilters().length > 0 && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All
            </button>
          )}
        </div>

        <div className="toolbar">
          <div className="toolbar-left">
            <div className="sort-controls">
              <ArrowUpDown size={18} />
              <select
                className="glass-input glass-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="category">Sort by Category</option>
                <option value="name">Sort by Name</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            <div className="group-controls">
              <select
                className="glass-input glass-select"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <option value="none">No Grouping</option>
                <option value="date">Group by Date</option>
                <option value="influencer">Group by Influencer</option>
                <option value="category">Group by Category</option>
                <option value="priority">Group by Priority</option>
              </select>
            </div>
          </div>

          <div className="toolbar-right">
            <div className="view-mode">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>

            <div className="export-controls">
              <button className="export-btn" onClick={() => handleExport('csv')}>
                <Download size={18} />
                <span>CSV</span>
              </button>
              <button className="export-btn" onClick={() => handleExport('pdf')}>
                <Download size={18} />
                <span>PDF</span>
              </button>
            </div>

            <div className="filter-actions">
              <button className="save-filter-btn" onClick={saveCurrentFilter}>
                <Filter size={18} />
                <span>Save Filter</span>
              </button>
              {savedFilters.length > 0 && (
                <div className="saved-filters-dropdown">
                  <select
                    className="glass-input glass-select"
                    onChange={(e) => {
                      if (e.target.value) {
                        const filter = savedFilters.find(f => f.id === parseInt(e.target.value))
                        if (filter) loadSavedFilter(filter)
                        e.target.value = ''
                      }
                    }}
                  >
                    <option value="">Load Saved Filter</option>
                    {savedFilters.map(filter => (
                      <option key={filter.id} value={filter.id}>{filter.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading emails...</p>
        </div>
      ) : processedEmails.length === 0 ? (
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
          className={viewMode === 'grid' ? 'emails-grid' : 'emails-list-view'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {Object.entries(groupedEmails).map(([groupName, groupEmails]) => (
            <div key={groupName} className="email-group">
              {groupBy !== 'none' && (
                <h3 className="group-header">{groupName} ({groupEmails.length})</h3>
              )}
              <div className={viewMode === 'grid' ? 'emails-grid-inner' : 'emails-list-inner'}>
                {groupEmails.map((email, index) => (
                  <EmailCard
                    key={email.email_id || index}
                    email={email}
                    isExpanded={expandedEmail === email.email_id}
                    onExpand={() => setExpandedEmail(expandedEmail === email.email_id ? null : email.email_id)}
                    onCopy={handleCopyEmail}
                    getCategoryColor={getCategoryColor}
                    formatDate={formatDate}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </div>
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

const EmailCard = ({ email, isExpanded, onExpand, onCopy, getCategoryColor, formatDate, viewMode = 'grid' }) => {
  return (
    <motion.div
      className={`email-card ${isExpanded ? 'expanded' : ''} ${viewMode === 'list' ? 'list-view' : ''}`}
      whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1 }}
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


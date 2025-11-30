import { format, parseISO, startOfDay, endOfDay, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export const groupEmailsBy = (emails, groupBy) => {
  const groups = {}
  
  emails.forEach(email => {
    let key
    switch (groupBy) {
      case 'influencer':
        key = email.influencer_name || email.to || 'Unknown'
        break
      case 'category':
        key = email.category || 'uncategorized'
        break
      case 'date':
        key = format(parseISO(email.sent_at), 'yyyy-MM-dd')
        break
      case 'priority':
        key = email.priority || 'medium'
        break
      default:
        key = 'all'
    }
    
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(email)
  })
  
  return groups
}

export const sortEmails = (emails, sortBy, order = 'desc') => {
  const sorted = [...emails].sort((a, b) => {
    let aVal, bVal
    
    switch (sortBy) {
      case 'date':
        aVal = new Date(a.sent_at)
        bVal = new Date(b.sent_at)
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aVal = priorityOrder[a.priority] || 0
        bVal = priorityOrder[b.priority] || 0
        break
      case 'category':
        aVal = a.category || ''
        bVal = b.category || ''
        break
      case 'name':
        aVal = (a.influencer_name || '').toLowerCase()
        bVal = (b.influencer_name || '').toLowerCase()
        break
      default:
        return 0
    }
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })
  
  return sorted
}

export const filterEmails = (emails, filters) => {
  return emails.filter(email => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch = 
        (email.subject || '').toLowerCase().includes(searchLower) ||
        (email.to || '').toLowerCase().includes(searchLower) ||
        (email.influencer_name || '').toLowerCase().includes(searchLower) ||
        (email.body || '').toLowerCase().includes(searchLower) ||
        (email.email_id || '').toLowerCase().includes(searchLower)
      
      if (!matchesSearch) return false
    }
    
    // Category filter
    if (filters.category && email.category !== filters.category) {
      return false
    }
    
    // Priority filter
    if (filters.priority && email.priority !== filters.priority) {
      return false
    }
    
    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      const emailDate = parseISO(email.sent_at)
      if (filters.dateFrom) {
        const fromDate = startOfDay(parseISO(filters.dateFrom))
        if (emailDate < fromDate) return false
      }
      if (filters.dateTo) {
        const toDate = endOfDay(parseISO(filters.dateTo))
        if (emailDate > toDate) return false
      }
    }
    
    // Status filter
    if (filters.status && email.delivery_status !== filters.status) {
      return false
    }
    
    return true
  })
}

export const getQuickFilterDates = (filter) => {
  const now = new Date()
  
  switch (filter) {
    case 'today':
      return {
        dateFrom: format(startOfDay(now), 'yyyy-MM-dd'),
        dateTo: format(endOfDay(now), 'yyyy-MM-dd')
      }
    case 'thisWeek':
      return {
        dateFrom: format(startOfWeek(now), 'yyyy-MM-dd'),
        dateTo: format(endOfWeek(now), 'yyyy-MM-dd')
      }
    case 'thisMonth':
      return {
        dateFrom: format(startOfMonth(now), 'yyyy-MM-dd'),
        dateTo: format(endOfMonth(now), 'yyyy-MM-dd')
      }
    case 'lastWeek':
      const lastWeekStart = startOfWeek(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
      const lastWeekEnd = endOfWeek(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
      return {
        dateFrom: format(lastWeekStart, 'yyyy-MM-dd'),
        dateTo: format(lastWeekEnd, 'yyyy-MM-dd')
      }
    default:
      return {}
  }
}

export const calculateStats = (emails) => {
  const stats = {
    total: emails.length,
    byCategory: {},
    byPriority: {},
    byStatus: {},
    byDate: {},
    topInfluencers: {}
  }
  
  emails.forEach(email => {
    // Category stats
    const cat = email.category || 'uncategorized'
    stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1
    
    // Priority stats
    const pri = email.priority || 'medium'
    stats.byPriority[pri] = (stats.byPriority[pri] || 0) + 1
    
    // Status stats
    const status = email.delivery_status || 'queued'
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1
    
    // Date stats
    const date = format(parseISO(email.sent_at), 'yyyy-MM-dd')
    stats.byDate[date] = (stats.byDate[date] || 0) + 1
    
    // Top influencers
    const influencer = email.influencer_name || email.to
    if (influencer) {
      stats.topInfluencers[influencer] = (stats.topInfluencers[influencer] || 0) + 1
    }
  })
  
  return stats
}

export const getUniqueValues = (emails, field) => {
  const values = new Set()
  emails.forEach(email => {
    const value = email[field]
    if (value) values.add(value)
  })
  return Array.from(values).sort()
}


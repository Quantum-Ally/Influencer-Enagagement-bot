import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Mail, Calendar as CalendarIcon } from 'lucide-react'
import { getSentEmails } from '../services/api'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, getDay, addMonths, subMonths } from 'date-fns'
import Toast from '../components/Toast'
import './CalendarView.css'

const CalendarView = () => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEmails, setSelectedEmails] = useState([])

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const response = await getSentEmails({})
      if (response.status === 'success') {
        setEmails(response.emails || [])
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Failed to fetch emails' })
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get first day of week for the month
  const firstDayOfWeek = getDay(monthStart)
  const emptyDays = Array(firstDayOfWeek).fill(null)

  const getEmailsForDate = (date) => {
    return emails.filter(email => {
      try {
        const emailDate = parseISO(email.sent_at)
        return isSameDay(emailDate, date)
      } catch {
        return false
      }
    })
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    const dateEmails = getEmailsForDate(date)
    setSelectedEmails(dateEmails)
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

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
    setSelectedDate(null)
    setSelectedEmails([])
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
    setSelectedDate(null)
    setSelectedEmails([])
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="calendar-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="page-title">Calendar View</h1>
        <p className="page-subtitle">View emails organized by date</p>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading calendar...</p>
        </div>
      ) : (
        <div className="calendar-container">
          <motion.div
            className="calendar-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="calendar-header">
              <button className="nav-button" onClick={prevMonth}>
                <ChevronLeft size={20} />
              </button>
              <h2 className="calendar-month">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button className="nav-button" onClick={nextMonth}>
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="calendar-grid">
              {weekDays.map(day => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}

              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="calendar-day empty" />
              ))}

              {daysInMonth.map(day => {
                const dayEmails = getEmailsForDate(day)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isToday = isSameDay(day, new Date())

                return (
                  <motion.div
                    key={day.toISOString()}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateClick(day)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="day-number">{format(day, 'd')}</div>
                    {dayEmails.length > 0 && (
                      <div className="day-emails">
                        {dayEmails.slice(0, 3).map((email, idx) => (
                          <div
                            key={idx}
                            className="email-dot"
                            style={{ backgroundColor: getCategoryColor(email.category) }}
                            title={email.subject}
                          />
                        ))}
                        {dayEmails.length > 3 && (
                          <div className="more-emails">+{dayEmails.length - 3}</div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {selectedDate && (
            <motion.div
              className="selected-date-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="panel-header">
                <h3>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
                <button
                  className="close-panel"
                  onClick={() => {
                    setSelectedDate(null)
                    setSelectedEmails([])
                  }}
                >
                  ×
                </button>
              </div>
              {selectedEmails.length === 0 ? (
                <div className="no-emails">
                  <Mail size={48} />
                  <p>No emails sent on this date</p>
                </div>
              ) : (
                <div className="emails-list">
                  {selectedEmails.map((email, index) => (
                    <motion.div
                      key={email.email_id || index}
                      className="email-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="email-item-header">
                        <span
                          className="email-category-badge"
                          style={{
                            backgroundColor: `${getCategoryColor(email.category)}20`,
                            color: getCategoryColor(email.category)
                          }}
                        >
                          {email.category}
                        </span>
                        <span className="email-time">
                          {format(parseISO(email.sent_at), 'h:mm a')}
                        </span>
                      </div>
                      <h4 className="email-item-subject">{email.subject}</h4>
                      <p className="email-item-to">{email.influencer_name || email.to}</p>
                      <p className="email-item-preview">{email.body?.substring(0, 100)}...</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
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

export default CalendarView


import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Mail, Users, Calendar, Download } from 'lucide-react'
import { getSentEmails } from '../services/api'
import { calculateStats, getQuickFilterDates } from '../utils/dataUtils'
import { exportToCSV } from '../utils/exportUtils'
import Toast from '../components/Toast'
import './Analytics.css'

const Analytics = () => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    fetchEmails()
  }, [dateFilter])

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const dateRange = dateFilter !== 'all' ? getQuickFilterDates(dateFilter) : {}
      const filterParams = {}
      
      if (dateRange.dateFrom) {
        filterParams.date_from = new Date(dateRange.dateFrom + 'T00:00:00Z').toISOString()
      }
      if (dateRange.dateTo) {
        filterParams.date_to = new Date(dateRange.dateTo + 'T23:59:59Z').toISOString()
      }

      const response = await getSentEmails(filterParams)
      if (response.status === 'success') {
        setEmails(response.emails || [])
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Failed to fetch emails' })
    } finally {
      setLoading(false)
    }
  }

  const stats = calculateStats(emails)

  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))

  const priorityData = Object.entries(stats.byPriority).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))

  const dateData = Object.entries(stats.byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count
    }))

  const topInfluencers = Object.entries(stats.topInfluencers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  const COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444']

  const handleExport = () => {
    exportToCSV(emails, 'analytics_export')
    setToast({ type: 'success', message: 'Data exported successfully!' })
  }

  return (
    <div className="analytics-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div>
            <h1 className="page-title">Analytics Dashboard</h1>
            <p className="page-subtitle">Comprehensive insights into your email engagement</p>
          </div>
          <div className="header-actions">
            <select
              className="date-filter-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastWeek">Last Week</option>
            </select>
            <button className="export-btn" onClick={handleExport}>
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading analytics...</p>
        </div>
      ) : (
        <>
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StatsCard
              title="Total Emails"
              value={stats.total}
              icon={Mail}
              color="#3b82f6"
              trend={stats.total > 0 ? '+' + stats.total : '0'}
            />
            <StatsCard
              title="Unique Influencers"
              value={Object.keys(stats.topInfluencers).length}
              icon={Users}
              color="#a855f7"
            />
            <StatsCard
              title="Categories"
              value={Object.keys(stats.byCategory).length}
              icon={TrendingUp}
              color="#10b981"
            />
            <StatsCard
              title="Active Days"
              value={Object.keys(stats.byDate).length}
              icon={Calendar}
              color="#f59e0b"
            />
          </motion.div>

          <div className="charts-grid">
            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="chart-title">Emails by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="chart-title">Emails by Priority</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 26, 46, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="chart-title">Last 7 Days Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 26, 46, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: '#a855f7', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="chart-title">Top 5 Influencers</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topInfluencers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 26, 46, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
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

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <motion.div
      className="analytics-stats-card"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
      style={{ borderTopColor: color }}
    >
      <div className="stats-card-icon" style={{ backgroundColor: `${color}20`, color }}>
        <Icon size={24} />
      </div>
      <div className="stats-card-content">
        <p className="stats-card-value">{value}</p>
        <p className="stats-card-title">{title}</p>
        {trend && <p className="stats-card-trend" style={{ color }}>{trend}</p>}
      </div>
    </motion.div>
  )
}

export default Analytics


import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Mail className="logo-icon" />
          <motion.span
            className="logo-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Engagement Hub
          </motion.span>
        </Link>
        
        <div className="navbar-links">
          <Link
            to="/send-email"
            className={`nav-link ${location.pathname === '/send-email' || location.pathname === '/' ? 'active' : ''}`}
          >
            <Send size={18} />
            <span>Send Email</span>
          </Link>
          <Link
            to="/sent-emails"
            className={`nav-link ${location.pathname === '/sent-emails' ? 'active' : ''}`}
          >
            <Mail size={18} />
            <span>View Sent</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar


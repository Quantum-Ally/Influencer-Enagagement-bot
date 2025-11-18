import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { useEffect } from 'react'
import './Toast.css'

const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className={`toast toast-${type}`}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="toast-content">
          {type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <span>{message}</span>
        </div>
        <button className="toast-close" onClick={onClose}>
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default Toast


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SendEmail from './pages/SendEmail'
import SentEmails from './pages/SentEmails'
import Analytics from './pages/Analytics'
import Timeline from './pages/Timeline'
import CalendarView from './pages/CalendarView'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<SendEmail />} />
          <Route path="/send-email" element={<SendEmail />} />
          <Route path="/sent-emails" element={<SentEmails />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


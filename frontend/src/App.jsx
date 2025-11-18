import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SendEmail from './pages/SendEmail'
import SentEmails from './pages/SentEmails'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<SendEmail />} />
          <Route path="/send-email" element={<SendEmail />} />
          <Route path="/sent-emails" element={<SentEmails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


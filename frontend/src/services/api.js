import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const sendEmail = async (data) => {
  try {
    const response = await api.post('/api/send-email', data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to send email')
  }
}

export const getSentEmails = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.influencer_email) {
      params.append('influencer_email', filters.influencer_email)
    }
    if (filters.category) {
      params.append('category', filters.category)
    }
    if (filters.date_from) {
      params.append('date_from', filters.date_from)
    }
    if (filters.date_to) {
      params.append('date_to', filters.date_to)
    }
    
    const response = await api.get(`/api/emails?${params.toString()}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch emails')
  }
}

export default api


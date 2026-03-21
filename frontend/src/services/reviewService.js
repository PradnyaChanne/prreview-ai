import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export const reviewCode = async (code, language) => {
  const response = await axios.post(`${API_URL}/api/review`, {
    code,
    language
  })
  return response.data
}
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', // Default to local NestJS server
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api

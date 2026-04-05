import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// attach token from localStorage if present
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('app_auth_v1')
    if (raw) {
      const { token } = JSON.parse(raw)
      if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
    }
  } catch (e) {
    // ignore
  }
  return config
})

// basic response interceptor for global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // clear local auth on 401
      localStorage.removeItem('app_auth_v1')
      // we don't perform navigation here to keep service decoupled
    }
    return Promise.reject(err)
  },
)

export default api

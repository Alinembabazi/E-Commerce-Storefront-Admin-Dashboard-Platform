import axios from 'axios'

// Prefer Vite env `VITE_API_BASE_URL` (e.g. http://localhost:3000)
// Ensure this base does NOT include a trailing `/api` so endpoints are built like: `${base}/api/...`
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

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
        if (token) config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      // ignore JSON parse errors
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

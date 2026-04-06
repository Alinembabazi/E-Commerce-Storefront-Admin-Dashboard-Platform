import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://e-commas-apis-production.up.railway.app'

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('app_auth_v1')
    if (raw) {
      const { token } = JSON.parse(raw)
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {}
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('app_auth_v1')
    }
    return Promise.reject(err)
  },
)

const isNetworkError = (error: any) => {
  return !error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.message?.includes('Network Error'))
}

export const apiGet = async (path: string) => {
  const paths = [path, `/api${path}`, `/api/v1${path}`, `/v1${path}`]
  let lastError: any = null
  
  for (const p of paths) {
    try {
      const res = await api.get(p)
      return res
    } catch (e: any) {
      lastError = e
      if (isNetworkError(e)) {
        throw new Error('NETWORK_ERROR')
      }
      if (e.response?.status !== 404) throw e
    }
  }
  throw lastError
}

export const apiPost = async (path: string, data: any) => {
  const paths = [path, `/api${path}`, `/api/v1${path}`, `/v1${path}`]
  let lastError: any = null
  
  for (const p of paths) {
    try {
      const res = await api.post(p, data)
      return res
    } catch (e: any) {
      lastError = e
      if (isNetworkError(e)) {
        throw new Error('NETWORK_ERROR')
      }
      if (e.response?.status !== 404) throw e
    }
  }
  throw lastError
}

export const apiPut = async (path: string, data: any) => {
  const paths = [path, `/api${path}`, `/api/v1${path}`, `/v1${path}`]
  let lastError: any = null
  
  for (const p of paths) {
    try {
      const res = await api.put(p, data)
      return res
    } catch (e: any) {
      lastError = e
      if (isNetworkError(e)) {
        throw new Error('NETWORK_ERROR')
      }
      if (e.response?.status !== 404) throw e
    }
  }
  throw lastError
}

export const apiDelete = async (path: string) => {
  const paths = [path, `/api${path}`, `/api/v1${path}`, `/v1${path}`]
  let lastError: any = null
  
  for (const p of paths) {
    try {
      const res = await api.delete(p)
      return res
    } catch (e: any) {
      lastError = e
      if (isNetworkError(e)) {
        throw new Error('NETWORK_ERROR')
      }
      if (e.response?.status !== 404) throw e
    }
  }
  throw lastError
}

export default api
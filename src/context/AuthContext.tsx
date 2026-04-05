import React, { createContext, useEffect, useState } from 'react'
import api from '../services/api'

export type UserRole = 'ADMIN' | 'USER' | null

type AuthState = {
  token: string | null
  role: UserRole
  isAuthenticated: boolean
}

type LoginCredentials = { email: string; password: string }

type AuthContextType = {
  state: AuthState
  login: (creds: LoginCredentials) => Promise<void>
  logout: () => void
}

const initial: AuthState = {
  token: null,
  role: null,
  isAuthenticated: false,
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'app_auth_v1'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return initial
      return JSON.parse(raw) as AuthState
    } catch {
      return initial
    }
  })

  useEffect(() => {
    // keep axios auth header in sync
    if (state.token) {
      api.defaults.headers.common.Authorization = `Bearer ${state.token}`
    } else {
      delete api.defaults.headers.common.Authorization
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const login = async ({ email, password }: LoginCredentials) => {
    // hardcoded admin bypass
    if (email === 'admin@admin.com' && password === 'admin123') {
      const authState: AuthState = { token: 'local-admin-token', role: 'ADMIN', isAuthenticated: true }
      setState(authState)
      return
    }

    // normal user -> call backend
    try {
      const res = await api.post('/auth/login', { email, password })
      // expected response { token: string, user: { role: 'USER' | 'ADMIN' } }
      const { token, user } = res.data
      const authState: AuthState = { token, role: user?.role ?? 'USER', isAuthenticated: true }
      setState(authState)
    } catch (err) {
      // rethrow for UI to show
      throw err
    }
  }

  const logout = () => {
    setState(initial)
  }

  return <AuthContext.Provider value={{ state, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider

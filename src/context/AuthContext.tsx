import React, { createContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '../services/productStorage'

export type UserRole = 'ADMIN' | 'USER' | null

type AuthState = {
  token: string | null
  role: UserRole
  isAuthenticated: boolean
}

type LoginCredentials = { email: string; password: string }

type RegisterData = { name: string; email: string; password: string; phone: string; address?: string }

type AuthContextType = {
  state: AuthState
  login: (creds: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const login = async ({ email, password }: LoginCredentials) => {
    if (email === 'admin@admin.com' && password === 'admin123') {
      const authState: AuthState = { token: 'local-admin-token', role: 'ADMIN', isAuthenticated: true }
      setState(authState)
      return
    }

    const user = loginUser(email, password)
    if (user) {
      const authState: AuthState = { token: user._id, role: 'USER', isAuthenticated: true }
      setState(authState)
      return
    }
    
    throw new Error('Invalid credentials')
  }

  const register = async (userData: { name: string; email: string; password: string; phone: string; address?: string }) => {
    const user = registerUser(userData)
    const authState: AuthState = { token: user._id, role: 'USER', isAuthenticated: true }
    setState(authState)
  }

  const logout = () => {
    setState(initial)
  }

  return <AuthContext.Provider value={{ state, login, register, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider

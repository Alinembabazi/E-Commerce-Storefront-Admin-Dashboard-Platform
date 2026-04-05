import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const AdminRoute: React.FC = () => {
  const { state } = useAuth()

  if (!state.isAuthenticated) return <Navigate to="/login" replace />
  if (state.role !== 'ADMIN') return <Navigate to="/" replace />

  return <Outlet />
}

export default AdminRoute

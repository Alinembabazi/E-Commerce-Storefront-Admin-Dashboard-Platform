import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const UserRoute: React.FC = () => {
  const { state } = useAuth()
  const location = useLocation()

  if (!state.isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}

export default UserRoute

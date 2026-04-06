import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { CartContext } from '../context/CartContext'

const Navbar: React.FC = () => {
  const { state, logout } = useAuth()
  const cartContext = useContext(CartContext)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const cartItemCount = cartContext?.state.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              E-Commerce
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded">
              Store
            </Link>

            <Link to="/cart" className="hover:bg-gray-700 px-3 py-2 rounded relative">
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {state.isAuthenticated ? (
              <>
                {state.role === 'ADMIN' && (
                  <Link to="/admin" className="hover:bg-gray-700 px-3 py-2 rounded">
                    Admin Dashboard
                  </Link>
                )}
                {state.role === 'USER' && (
                  <Link to="/profile" className="hover:bg-gray-700 px-3 py-2 rounded">
                    Profile
                  </Link>
                )}
                <button onClick={handleLogout} className="hover:bg-gray-700 px-3 py-2 rounded">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:bg-gray-700 px-3 py-2 rounded">
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" className="block hover:bg-gray-700 px-3 py-2 rounded" onClick={() => setIsMenuOpen(false)}>
              Store
            </Link>

            <Link to="/cart" className="block hover:bg-gray-700 px-3 py-2 rounded" onClick={() => setIsMenuOpen(false)}>
              Cart {cartItemCount > 0 && `(${cartItemCount})`}
            </Link>

            {state.isAuthenticated ? (
              <>
                {state.role === 'ADMIN' && (
                  <Link to="/admin" className="block hover:bg-gray-700 px-3 py-2 rounded" onClick={() => setIsMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                {state.role === 'USER' && (
                  <Link to="/profile" className="block hover:bg-gray-700 px-3 py-2 rounded" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                )}
                <button onClick={handleLogout} className="block w text-left hover:bg-gray-700 px-3 py-2 rounded">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block hover:bg-gray-700 px-3 py-2 rounded" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

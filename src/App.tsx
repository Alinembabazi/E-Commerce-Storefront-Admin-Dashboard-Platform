import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import UserRoute from './routes/UserRoute'
import AdminRoute from './routes/AdminRoute'

const App: React.FC = () => {
  return (
    <div>
      <nav className="p-4 border-b">
        <Link to="/" className="mr-4">Store</Link>
        <Link to="/admin" className="mr-4">Admin</Link>
        <Link to="/login">Login</Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* User protected routes (placeholders) */}
          <Route element={<UserRoute />}>
            <Route path="/cart" element={<div className="p-4">Cart (protected)</div>} />
            <Route path="/checkout" element={<div className="p-4">Checkout (protected)</div>} />
            <Route path="/profile" element={<div className="p-4">Profile (protected)</div>} />
          </Route>

          {/* Admin protected routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/product/new" element={<div className="p-4">New Product</div>} />
            <Route path="/admin/product/edit/:id" element={<div className="p-4">Edit Product</div>} />
          </Route>

          <Route path="*" element={<div className="p-4">Not Found</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default App

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import ProductForm from './pages/ProductForm'
import ProductDetails from './pages/ProductDetails'
import UserRoute from './routes/UserRoute'
import AdminRoute from './routes/AdminRoute'
import Navbar from './components/Navbar'
import { CartProvider } from './context/CartContext'

const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-right" />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />

            <Route element={<UserRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/product/new" element={<ProductForm />} />
              <Route path="/admin/product/edit/:id" element={<ProductForm />} />
            </Route>

            <Route path="*" element={<div className="p-4">Not Found</div>} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  )
}

export default App

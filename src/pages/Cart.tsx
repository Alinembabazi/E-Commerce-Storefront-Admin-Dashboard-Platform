import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

const Cart: React.FC = () => {
  const { state, removeItem, updateQuantity, clearCart } = useContext(CartContext)!
  const navigate = useNavigate()

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {state.items.map((item) => (
            <div key={item.productId} className="bg-white rounded-lg shadow-md p-4 mb-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-500">${item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 text-sm hover:underline mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${state.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${state.total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="mt-2 w-full text-gray-500 py-2 hover:text-gray-700"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

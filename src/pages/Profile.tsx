import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getOrders, type Order } from '../services/productStorage'

const fetchOrders = (): Order[] => {
  return getOrders()
}

const Profile: React.FC = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['userOrders'],
    queryFn: fetchOrders,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
      
      {orders?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-lg">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="border-t border-b py-4 mb-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2">
                    <span className="text-gray-600">{item.title} x {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total: ${order.totalAmount?.toFixed(2) || '0.00'}</span>
                <span className="text-gray-500 text-sm">{order.paymentMethod?.replace('_', ' ') || 'Payment'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile
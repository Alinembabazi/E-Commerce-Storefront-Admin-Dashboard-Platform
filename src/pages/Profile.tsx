import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

interface OrderItem {
  productId: string
  title: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  items: OrderItem[]
  totalAmount: number
  status: string
  paymentMethod: string
  createdAt: string
}

const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await api.get('/api/orders/me')
  return data
}

const Profile: React.FC = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['userOrders'],
    queryFn: fetchOrders,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <p className="text-red-500">Failed to load orders</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders?.length === 0 ? (
        <p className="text-gray-500">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
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
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1">
                    <span>{item.title} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between font-semibold">
                <span>Total: ${order.totalAmount.toFixed(2)}</span>
                <span className="text-gray-500 text-sm">{order.paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile

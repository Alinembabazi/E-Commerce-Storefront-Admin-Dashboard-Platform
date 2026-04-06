import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'

interface Product {
  _id: string
  title: string
  description: string
  price: number
  images: string[]
  brand: string
  category: string
  stockQuantity: number
}

interface Order {
  _id: string
  user: { name: string; email: string }
  items: { title: string; quantity: number; price: number }[]
  totalAmount: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentMethod: string
  createdAt: string
}

const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get('/api/products')
  return data
}

const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await api.get('/api/orders')
  return data
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; productId?: string; productTitle?: string }>({ open: false })

  const { data: products, isLoading: loadingProducts, refetch: refetchProducts } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: fetchProducts,
  })

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchOrders,
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/products/${id}`)
    },
    onSuccess: () => {
      toast.success('Product deleted')
      refetchProducts()
      setDeleteModal({ open: false })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete product')
    },
  })

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`/api/orders/${id}/status`, { status })
      return data
    },
    onSuccess: () => {
      toast.success('Order status updated')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    },
  })

  const handleDelete = (id: string, title: string) => {
    setDeleteModal({ open: true, productId: id, productTitle: title })
  }

  const confirmDelete = () => {
    if (deleteModal.productId) {
      deleteProduct.mutate(deleteModal.productId)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          to="/admin/product/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>

      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'products'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Products ({products?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'orders'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Orders ({orders?.length || 0})
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loadingProducts ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products?.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden mr-4">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{product.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 text-gray-500">{product.brand}</td>
                      <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={product.stockQuantity <= 0 ? 'text-red-500' : product.stockQuantity < 10 ? 'text-yellow-500' : 'text-green-500'}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/product/edit/${product._id}`}
                          className="text-blue-600 hover:underline mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.title)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products?.length === 0 && <div className="p-8 text-center text-gray-500">No products found</div>}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loadingOrders ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders?.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 text-sm">#{order._id.slice(-8)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email || ''}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.items?.map((item, idx) => (
                          <div key={idx}>{item.title} x{item.quantity}</div>
                        ))}
                      </td>
                      <td className="px-6 py-4">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus.mutate({ id: order._id, status: e.target.value })}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders?.length === 0 && <div className="p-8 text-center text-gray-500">No orders found</div>}
            </div>
          )}
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteModal.productTitle}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteModal({ open: false })}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteProduct.isPending}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

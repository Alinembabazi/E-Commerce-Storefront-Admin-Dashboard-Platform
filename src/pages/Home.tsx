import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { CartContext, type CartItem } from '../context/CartContext'

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

interface ApiResponse {
  data?: Product[]
  data2?: Product[]
  products?: Product[]
}

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await api.get<ApiResponse>('/api/products')
    let products = res.data
    
    if (Array.isArray(products)) {
      return products
    }
    
    if (products?.data && Array.isArray(products.data)) {
      return products.data
    }
    
    if (products?.data2 && Array.isArray(products.data2)) {
      return products.data2
    }
    
    if (products?.products && Array.isArray(products.products)) {
      return products.products
    }
    
    return []
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

const Home: React.FC = () => {
  const { addItem } = useContext(CartContext)!

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    retry: 1,
  })

  const handleAddToCart = (product: Product) => {
    const item: CartItem = {
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || '',
    }
    addItem(item)
    toast.success('Added to cart!')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-500 text-lg mb-2">Failed to load products</p>
          <p className="text-gray-500 text-sm mb-4">Make sure the backend server is running at http://localhost:3000</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-gray-500 text-lg">No products available</p>
        <p className="text-gray-400 text-sm mt-1">Check back later for new products</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
        <span className="text-gray-500 text-sm">{products.length} products</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Link to={`/product/${product._id}`} className="block">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/product/${product._id}`}>
                <h2 className="text-lg font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">{product.title}</h2>
              </Link>
              <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-gray-900">${product.price?.toFixed(2) || '0.00'}</span>
                <span className={`text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </span>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stockQuantity <= 0}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
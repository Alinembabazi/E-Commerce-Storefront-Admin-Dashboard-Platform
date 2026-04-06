import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
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

const fetchProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/api/products/${id}`)
  return data
}

const ProductDetails: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useContext(CartContext)!

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  })

  const handleAddToCart = () => {
    if (!product) return
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-500">Failed to load product</p>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
          Back to store
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="text-blue-600 hover:underline mb-4">
        &larr; Back to store
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-500 mb-4">{product.brand}</p>
          
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <p className="text-sm text-gray-500">
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails

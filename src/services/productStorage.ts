export interface Product {
  _id: string
  title: string
  description: string
  price: number
  images: string[]
  brand: string
  category: string
  stockQuantity: number
}

export interface OrderItem {
  productId: string
  title: string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  user: { name: string; email: string }
  items: OrderItem[]
  totalAmount: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentMethod: string
  createdAt: string
}

const STORAGE_KEY = 'ecommerce_products_v1'
const ORDERS_KEY = 'ecommerce_orders_v1'
const USERS_KEY = 'ecommerce_users_v1'

export interface User {
  _id: string
  name: string
  email: string
  password: string
  phone: string
  address?: string
}

const generateUserId = () => 'user_' + Math.random().toString(36).substring(2, 11)

const getUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    if (stored) return JSON.parse(stored)
    return []
  } catch {
    return []
  }
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    _id: '1',
    title: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality for audiophiles. Features 30-hour battery life.',
    price: 299.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    brand: 'AudioTech',
    category: 'Electronics',
    stockQuantity: 50
  },
  {
    _id: '2',
    title: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and water resistance for fitness enthusiasts.',
    price: 449.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    brand: 'TechWear',
    category: 'Electronics',
    stockQuantity: 30
  },
  {
    _id: '3',
    title: 'Running Shoes Ultra',
    description: 'Lightweight running shoes with advanced cushioning for maximum comfort during long runs.',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    brand: 'SportMax',
    category: 'Sports',
    stockQuantity: 100
  },
  {
    _id: '4',
    title: 'Leather Backpack',
    description: 'Genuine leather backpack with multiple compartments and laptop sleeve for professionals.',
    price: 189.99,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
    brand: 'LeatherCraft',
    category: 'Fashion',
    stockQuantity: 25
  },
  {
    _id: '5',
    title: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans, medium roast, sustainably sourced from local farms.',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'],
    brand: 'BeanCraft',
    category: 'Food',
    stockQuantity: 200
  },
  {
    _id: '6',
    title: 'Yoga Mat Premium',
    description: 'Extra thick yoga mat with non-slip surface and carrying strap for yoga practitioners.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'],
    brand: 'ZenFit',
    category: 'Sports',
    stockQuantity: 75
  },
  {
    _id: '7',
    title: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound and 20-hour battery life for music lovers.',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'],
    brand: 'SoundWave',
    category: 'Electronics',
    stockQuantity: 60
  },
  {
    _id: '8',
    title: 'Cotton T-Shirt Pack',
    description: 'Pack of 3 premium cotton t-shirts in classic colors for everyday comfort and style.',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    brand: 'BasicWear',
    category: 'Fashion',
    stockQuantity: 150
  }
]

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const getProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const products = JSON.parse(stored)
      if (Array.isArray(products) && products.length > 0) {
        return products
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS))
    return DEFAULT_PRODUCTS
  } catch {
    return DEFAULT_PRODUCTS
  }
}

export const getProduct = (id: string): Product | undefined => {
  const products = getProducts()
  return products.find(p => p._id === id)
}

export const addProduct = (product: Omit<Product, '_id'>): Product => {
  const products = getProducts()
  const newProduct: Product = {
    ...product,
    _id: generateId()
  }
  products.unshift(newProduct)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  return newProduct
}

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const products = getProducts()
  const index = products.findIndex(p => p._id === id)
  if (index === -1) return null
  
  products[index] = { ...products[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  return products[index]
}

export const deleteProduct = (id: string): boolean => {
  const products = getProducts()
  const filtered = products.filter(p => p._id !== id)
  if (filtered.length === products.length) return false
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}

export const initializeProducts = (): void => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS))
  }
}

export const getOrders = (): Order[] => {
  try {
    const stored = localStorage.getItem(ORDERS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    return []
  } catch {
    return []
  }
}

export const addOrder = (order: Omit<Order, '_id' | 'createdAt'>): Order => {
  const orders = getOrders()
  const newOrder: Order = {
    ...order,
    _id: generateId(),
    createdAt: new Date().toISOString()
  }
  orders.unshift(newOrder)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return newOrder
}

export const updateProductStatus = (id: string, status: Order['status']): Order | null => {
  const orders = getOrders()
  const index = orders.findIndex(o => o._id === id)
  if (index === -1) return null
  
  orders[index].status = status
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return orders[index]
}

export const getCategories = (): { _id: string; name: string }[] => {
  return [
    { _id: '1', name: 'Electronics' },
    { _id: '2', name: 'Fashion' },
    { _id: '3', name: 'Sports' },
    { _id: '4', name: 'Food' },
    { _id: '5', name: 'Home' },
    { _id: '6', name: 'Books' },
  ]
}

initializeProducts()

export const registerUser = (userData: Omit<User, '_id'>): User => {
  const users = getUsers()
  const existing = users.find(u => u.email === userData.email)
  if (existing) throw new Error('Email already registered')
  
  const newUser: User = { ...userData, _id: generateUserId() }
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return newUser
}

export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers()
  const user = users.find(u => u.email === email && u.password === password)
  return user || null
}
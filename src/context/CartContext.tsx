import React, { createContext, useEffect, useState } from 'react'
import { updateProduct, getProduct } from '../services/productStorage'

export interface CartItem {
  productId: string
  title: string
  price: number
  quantity: number
  image: string
}

type CartState = {
  items: CartItem[]
  total: number
}

type CartContextType = {
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const initial: CartState = {
  items: [],
  total: 0,
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'ecommerce_cart_v1'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CartState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return initial
      return JSON.parse(raw) as CartState
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addItem = (item: CartItem) => {
    setState((prev) => {
      const existing = prev.items.find((i) => i.productId === item.productId)
      let newItems: CartItem[]
      let addedQuantity = item.quantity
      
      if (existing) {
        newItems = prev.items.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      } else {
        newItems = [...prev.items, item]
      }
      
      const product = getProduct(item.productId)
      if (product && product.stockQuantity >= addedQuantity) {
        updateProduct(item.productId, {
          stockQuantity: product.stockQuantity - addedQuantity
        })
      }
      
      const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return { items: newItems, total }
    })
  }

  const removeItem = (productId: string) => {
    setState((prev) => {
      const itemToRemove = prev.items.find(i => i.productId === productId)
      const newItems = prev.items.filter((i) => i.productId !== productId)
      
      if (itemToRemove) {
        const product = getProduct(productId)
        if (product) {
          updateProduct(productId, {
            stockQuantity: product.stockQuantity + itemToRemove.quantity
          })
        }
      }
      
      const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return { items: newItems, total }
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setState((prev) => {
      const oldItem = prev.items.find(i => i.productId === productId)
      const oldQty = oldItem?.quantity || 0
      const diff = quantity - oldQty
      
      const newItems = prev.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
      
      if (diff !== 0) {
        const product = getProduct(productId)
        if (product && product.stockQuantity >= diff) {
          updateProduct(productId, {
            stockQuantity: product.stockQuantity - diff
          })
        }
      }
      
      const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return { items: newItems, total }
    })
  }

  const clearCart = () => {
    state.items.forEach(item => {
      const product = getProduct(item.productId)
      if (product) {
        updateProduct(item.productId, {
          stockQuantity: product.stockQuantity + item.quantity
        })
      }
    })
    setState(initial)
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

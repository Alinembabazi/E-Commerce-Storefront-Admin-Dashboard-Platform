import React, { createContext, useEffect, useState } from 'react'

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
      if (existing) {
        newItems = prev.items.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      } else {
        newItems = [...prev.items, item]
      }
      const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return { items: newItems, total }
    })
  }

  const removeItem = (productId: string) => {
    setState((prev) => {
      const newItems = prev.items.filter((i) => i.productId !== productId)
      const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return { items: newItems, total }
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setState((prev) => {
      const newItems = prev.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
      const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return { items: newItems, total }
    })
  }

  const clearCart = () => {
    setState(initial)
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

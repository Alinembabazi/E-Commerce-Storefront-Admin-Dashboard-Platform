import { useContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../services/api'
import { CartContext } from '../context/CartContext'

const shippingSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').refine(val => val.trim().length > 0, 'Full name cannot be empty'),
  address: z.string().min(1, 'Address is required').refine(val => val.trim().length > 0, 'Address cannot be empty'),
  city: z.string().min(1, 'City is required').refine(val => val.trim().length > 0, 'City cannot be empty'),
  postalCode: z.string().optional(),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
})

const paymentSchema = z.object({
  paymentMethod: z.enum(['CREDIT_CARD', 'PAYPAL', 'MOBILE_MONEY', 'CASH_ON_DELIVERY']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
})

type ShippingForm = z.infer<typeof shippingSchema>
type PaymentForm = z.infer<typeof paymentSchema>

const Checkout: React.FC = () => {
  const { state, clearCart } = useContext(CartContext)!
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  
  const shippingForm = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    mode: 'onBlur',
  })

  const paymentForm = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    mode: 'onBlur',
    defaultValues: {
      paymentMethod: 'CREDIT_CARD',
    },
  })

  const createOrder = useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post('/api/orders', orderData)
      return data
    },
    onSuccess: () => {
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/profile')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to place order')
    },
  })

  const onShippingSubmit = (_data: ShippingForm) => {
    setStep(2)
  }

  const onPaymentSubmit = (data: PaymentForm) => {
    const orderData = {
      items: state.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping: {
        fullName: shippingForm.getValues('fullName'),
        address: shippingForm.getValues('address'),
        city: shippingForm.getValues('city'),
        postalCode: shippingForm.getValues('postalCode') || '',
        phone: shippingForm.getValues('phone'),
      },
      paymentMethod: data.paymentMethod,
      totalAmount: state.total,
    }
    createOrder.mutate(orderData)
  }

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex mb-8">
        <div className={`flex-1 text-center ${step >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
          1. Shipping
        </div>
        <div className={`flex-1 text-center ${step >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
          2. Payment
        </div>
        <div className={`flex-1 text-center ${step >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
          3. Review
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                {...shippingForm.register('fullName')}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {shippingForm.formState.errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <input
                {...shippingForm.register('address')}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {shippingForm.formState.errors.address && (
                <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  {...shippingForm.register('city')}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {shippingForm.formState.errors.city && (
                  <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  {...shippingForm.register('postalCode')}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                {...shippingForm.register('phone')}
                placeholder="1234567890"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {shippingForm.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700"
          >
            Continue to Payment
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          
          <div className="space-y-3 mb-6">
            {(['CREDIT_CARD', 'PAYPAL', 'MOBILE_MONEY', 'CASH_ON_DELIVERY'] as const).map((method) => (
              <label key={method} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  {...paymentForm.register('paymentMethod')}
                  value={method}
                  className="mr-3"
                />
                <span>{method.replace('_', ' ')}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded hover:bg-gray-300"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={createOrder.isPending}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {createOrder.isPending ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {state.items.map((item) => (
          <div key={item.productId} className="flex justify-between py-2 border-b">
            <span>{item.title} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-xl mt-4">
          <span>Total</span>
          <span>${state.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default Checkout

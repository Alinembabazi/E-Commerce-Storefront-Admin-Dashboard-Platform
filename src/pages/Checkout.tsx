import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { addOrder } from '../services/productStorage'
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
})

type ShippingForm = z.infer<typeof shippingSchema>
type PaymentForm = z.infer<typeof paymentSchema>

const Checkout: React.FC = () => {
  const { state, clearCart } = useContext(CartContext)!
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  
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

  const onShippingSubmit = (_data: ShippingForm) => {
    setStep(2)
  }

  const onPaymentSubmit = (data: PaymentForm) => {
    setIsProcessing(true)
    
    setTimeout(() => {
      try {
        const shipping = shippingForm.getValues()
        
        addOrder({
          user: { 
            name: shipping.fullName, 
            email: 'customer@example.com' 
          },
          items: state.items.map(item => ({
            productId: item.productId,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: state.total,
          status: 'PENDING',
          paymentMethod: data.paymentMethod,
        })
        
        clearCart()
        toast.success('Order placed successfully!')
        navigate('/profile')
      } catch (error) {
        toast.error('Failed to place order')
      } finally {
        setIsProcessing(false)
      }
    }, 1500)
  }

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
            Continue Shopping
          </button>
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
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {shippingForm.formState.errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <input
                {...shippingForm.register('address')}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {shippingForm.formState.errors.city && (
                  <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  {...shippingForm.register('postalCode')}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                {...shippingForm.register('phone')}
                placeholder="1234567890"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {shippingForm.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
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
              <label key={method} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
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
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {state.items.map((item) => (
          <div key={item.productId} className="flex justify-between py-2 border-b">
            <span className="text-gray-600">{item.title} x {item.quantity}</span>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
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
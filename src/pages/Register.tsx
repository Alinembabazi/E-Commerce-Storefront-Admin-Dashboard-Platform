import React, { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const schema = z.object({
  name: z.string().min(1, 'Name is required').refine(val => val.trim().length > 0, 'Name cannot be empty'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  address: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useContext(AuthContext)!

  const { register: registerField, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password, phone: data.phone, address: data.address })
      toast.success('Registration successful!')
      navigate('/')
    } catch (err: any) {
      toast.error(err?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            {...registerField('name')}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            {...registerField('email')}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password *</label>
          <input
            type="password"
            {...registerField('password')}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            {...registerField('phone')}
            placeholder="1234567890"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.phone && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            {...registerField('address')}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
      
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

export default Register

import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useAuth from '../hooks/useAuth'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

type FormValues = z.infer<typeof schema>

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data)
      // after login, read role from storage and redirect
      const raw = localStorage.getItem('app_auth_v1')
      const role = raw ? JSON.parse(raw).role : null
      if (role === 'ADMIN') navigate('/admin', { replace: true })
      else navigate(from, { replace: true })
    } catch (err: any) {
      // TODO: show toast
      alert(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input className="input" {...register('email')} />
          {formState.errors.email && <p className="text-red-500 text-sm">{formState.errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="input" {...register('password')} />
          {formState.errors.password && <p className="text-red-500 text-sm">{formState.errors.password.message}</p>}
        </div>
        <button className="btn-primary" type="submit">Sign in</button>
      </form>
    </div>
  )
}

export default Login

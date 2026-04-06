import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../services/api'

const schema = z.object({
  title: z.string().min(1, 'Title is required').refine(val => val.trim().length > 0, 'Title cannot be empty'),
  description: z.string().min(20, 'Description must be at least 20 characters').refine(val => val.trim().length > 0, 'Description cannot be empty'),
  brand: z.string().min(1, 'Brand is required').refine(val => val.trim().length > 0, 'Brand cannot be empty'),
  price: z.number().positive('Price must be greater than 0'),
  stockQuantity: z.number().int('Must be an integer').min(0, 'Stock cannot be negative'),
  images: z.array(z.string().url('Invalid URL')).min(1, 'At least one image URL is required'),
  category: z.string().min(1, 'Category is required'),
})

type FormValues = z.infer<typeof schema>

const fetchCategories = async () => {
  const { data } = await api.get('/api/categories')
  return data
}

const fetchProduct = async (id: string) => {
  const { data } = await api.get(`/api/products/${id}`)
  return data
}

const ProductForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: isEdit,
  })

  const { register, handleSubmit, formState, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      images: [''],
    },
  })

  useEffect(() => {
    if (product) {
      setValue('title', product.title)
      setValue('description', product.description)
      setValue('brand', product.brand)
      setValue('price', product.price)
      setValue('stockQuantity', product.stockQuantity)
      setValue('images', product.images || [])
      setValue('category', product.category)
    }
  }, [product, setValue])

  const images = watch('images') || []

  const addImageField = () => {
    setValue('images', [...images, ''])
  }

  const removeImageField = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setValue('images', newImages.length > 0 ? newImages : [''])
  }

  const saveProduct = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEdit) {
        const { data: res } = await api.put(`/api/products/${id}`, data)
        return res
      } else {
        const { data: res } = await api.post('/api/products', data)
        return res
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Product updated!' : 'Product created!')
      navigate('/admin')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to save product')
    },
  })

  const onSubmit = (data: FormValues) => {
    const cleanedData = {
      ...data,
      images: data.images.filter(img => img.trim() !== ''),
    }
    saveProduct.mutate(cleanedData)
  }

  if (isEdit && isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            {...register('title')}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Brand *</label>
          <input
            {...register('brand')}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.brand && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.brand.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            {...register('category')}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {categories?.map((cat: any) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          {formState.errors.category && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description * (min 20 chars)</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.description && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price *</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formState.errors.price && (
              <p className="text-red-500 text-sm mt-1">{formState.errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
            <input
              type="number"
              {...register('stockQuantity', { valueAsNumber: true })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formState.errors.stockQuantity && (
              <p className="text-red-500 text-sm mt-1">{formState.errors.stockQuantity.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URLs * (at least one)</label>
          {images.map((_, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                {...register(`images.${idx}` as const)}
                placeholder="https://..."
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(idx)}
                  className="text-red-500 px-2"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="text-blue-600 text-sm hover:underline"
          >
            + Add another image
          </button>
          {formState.errors.images && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.images.message || formState.errors.images.root?.message}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveProduct.isPending}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saveProduct.isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm

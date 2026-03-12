'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGymSchema } from '@/lib/validations'
import { createGym } from '@/lib/actions/gym.actions'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import '@/app/landing.css'
import '@/app/internal.css'

type FormData = z.infer<typeof createGymSchema>

export function CreateGymForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createGymSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    const result = await createGym(data)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result.data?.id) {
      // After creating a gym, take the owner directly to that gym's overview
      router.push(`/gyms/${result.data.id}`)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="gym-form">
      <div className="gym-form-group">
        <label htmlFor="name" className="gym-label">
          Gym Name <span className="gym-label-required">*</span>
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          placeholder="POWERHOUSE FITNESS"
          className={`gym-input ${errors.name ? 'gym-input-error' : ''}`}
        />
        {errors.name && (
          <p className="gym-error-message">{errors.name.message}</p>
        )}
      </div>

      <div className="gym-form-group">
        <label htmlFor="location" className="gym-label">
          Location <span className="gym-label-required">*</span>
        </label>
        <input
          {...register('location')}
          id="location"
          type="text"
          placeholder="MUMBAI, INDIA"
          className={`gym-input ${errors.location ? 'gym-input-error' : ''}`}
        />
        {errors.location && (
          <p className="gym-error-message">{errors.location.message}</p>
        )}
      </div>

      {error && (
        <div className="gym-alert gym-alert-error">
          <p className="gym-alert-desc">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="gym-btn gym-btn-primary gym-btn-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="gym-spinner" size={16} />
            Creating...
          </>
        ) : (
          'Create Gym'
        )}
      </button>

      <div className="gym-alert">
        <p className="gym-alert-title">What Happens Next?</p>
        <p className="gym-alert-desc">
          After creating your gym, you\'ll receive a unique gym code and QR code to share with members.
        </p>
      </div>
    </form>
  )
}

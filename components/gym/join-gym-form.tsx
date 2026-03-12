'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { joinGymSchema } from '@/lib/validations'
import { joinGym } from '@/lib/actions/gym.actions'
import { z } from 'zod'
import { Loader2, Check } from 'lucide-react'
import '@/app/landing.css'
import '@/app/internal.css'

type FormData = z.infer<typeof joinGymSchema>

export function JoinGymForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(joinGymSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await joinGym(data.gymCode.toUpperCase())

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setSuccess(true)
      setIsLoading(false)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="gym-success-card">
        <div className="gym-success-icon">
          <Check size={32} color="#10B981" strokeWidth={3} />
        </div>
        <h3 className="gym-success-title">REQUEST SENT!</h3>
        <p className="gym-success-desc">
          Your join request has been sent to the gym admin. You\'ll be notified once it\'s approved.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="gym-form">
      <div className="gym-form-group">
        <label htmlFor="gymCode" className="gym-label">
          Gym Code <span className="gym-label-required">*</span>
        </label>
        <input
          {...register('gymCode')}
          id="gymCode"
          type="text"
          placeholder="GYM-ABC123"
          className={`gym-input ${errors.gymCode ? 'gym-input-error' : ''}`}
          style={{ textTransform: 'uppercase' }}
        />
        {errors.gymCode && (
          <p className="gym-error-message">{errors.gymCode.message}</p>
        )}
        <p className="gym-input-hint">
          Enter the gym code shared by your gym administrator
        </p>
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
            Joining...
          </>
        ) : (
          'Join Gym'
        )}
      </button>

      <div className="gym-alert">
        <p className="gym-alert-title">Don\'t have a gym code?</p>
        <p className="gym-alert-desc">
          Ask your gym owner or administrator for the gym code. They can find it in their gym settings.
        </p>
      </div>
    </form>
  )
}

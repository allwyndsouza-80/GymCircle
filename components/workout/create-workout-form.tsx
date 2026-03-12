'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createWorkoutSchema } from '@/lib/validations'
import type { z } from 'zod'
import { createWorkout } from '@/lib/actions/workout.actions'
import { Loader2 } from 'lucide-react'
import '@/app/landing.css'
import '@/app/internal.css'

type FormSchema = z.infer<typeof createWorkoutSchema>

interface CreateWorkoutFormProps {
  gymId: string
  defaultDate: string // YYYY-MM-DD
  revalidateTarget: string
}

export function CreateWorkoutForm({ gymId, defaultDate, revalidateTarget }: CreateWorkoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: {
      gymId,
      workoutDate: defaultDate,
      workoutTime: '18:00',
      workoutType: 'Chest',
      notes: '',
      lookingForPartner: false,
    },
  })

  const onSubmit = async (values: FormSchema) => {
    setIsSubmitting(true)
    setError(null)

    const { error } = await createWorkout({
      gymId,
      workoutDate: values.workoutDate,
      workoutTime: values.workoutTime,
      workoutType: values.workoutType,
      notes: values.notes,
      lookingForPartner: values.lookingForPartner,
      revalidateTarget,
    })

    if (error) {
      setError(error)
      setIsSubmitting(false)
      return
    }

    reset({ ...values, notes: '', lookingForPartner: values.lookingForPartner })
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="gym-form" style={{ marginTop: 'var(--spacing-xl)' }}>
      <div className="gym-form-group">
        <label htmlFor="workoutDate" className="gym-label">
          Date <span className="gym-label-required">*</span>
        </label>
        <input
          id="workoutDate"
          type="date"
          className={`gym-input ${errors.workoutDate ? 'gym-input-error' : ''}`}
          {...register('workoutDate')}
        />
        {errors.workoutDate && (
          <p className="gym-error-message">{errors.workoutDate.message}</p>
        )}
      </div>

      <div className="gym-form-group">
        <label htmlFor="workoutTime" className="gym-label">
          Time <span className="gym-label-required">*</span>
        </label>
        <input
          id="workoutTime"
          type="time"
          className={`gym-input ${errors.workoutTime ? 'gym-input-error' : ''}`}
          {...register('workoutTime')}
        />
        {errors.workoutTime && (
          <p className="gym-error-message">{errors.workoutTime.message}</p>
        )}
      </div>

      <div className="gym-form-group">
        <label htmlFor="workoutType" className="gym-label">
          Workout Type <span className="gym-label-required">*</span>
        </label>
        <select
          id="workoutType"
          className={`gym-input ${errors.workoutType ? 'gym-input-error' : ''}`}
          {...register('workoutType')}
        >
          <option value="Chest">Chest</option>
          <option value="Back">Back</option>
          <option value="Legs">Legs</option>
          <option value="Cardio">Cardio</option>
          <option value="Full Body">Full Body</option>
        </select>
        {errors.workoutType && (
          <p className="gym-error-message">{errors.workoutType.message}</p>
        )}
      </div>

      <div className="gym-form-group">
        <label htmlFor="notes" className="gym-label">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          className="gym-input"
          style={{ resize: 'vertical' }}
          {...register('notes')}
        />
        <p className="gym-input-hint">
          Optional. Add context like focus, PR attempts, or equipment needs.
        </p>
      </div>

      <div className="gym-form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          id="lookingForPartner"
          type="checkbox"
          {...register('lookingForPartner')}
        />
        <label htmlFor="lookingForPartner" className="gym-label" style={{ marginBottom: 0, fontSize: '12px' }}>
          Looking for a workout partner
        </label>
      </div>

      {error && (
        <div className="gym-alert gym-alert-error">
          <p className="gym-alert-desc">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="gym-btn gym-btn-primary gym-btn-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="gym-spinner" size={16} />
            Adding Session...
          </>
        ) : (
          'Add Session'
        )}
      </button>
    </form>
  )
}


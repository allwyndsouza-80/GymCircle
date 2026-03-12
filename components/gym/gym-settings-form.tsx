'use client'

import { useState, useTransition } from 'react'
import { updateGymSettings } from '@/lib/actions/gym.actions'
import '@/app/landing.css'
import '@/app/internal.css'

interface GymSettingsFormProps {
  gymId: string
  initial: {
    opening_time: string | null
    closing_time: string | null
    exact_location: string | null
    description: string | null
    photo_url: string | null
    gym_code: string
    qr_code_url: string | null
  }
}

export function GymSettingsForm({ gymId, initial }: GymSettingsFormProps) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = (formData: FormData) => {
    setError(null)
    setSuccess(null)

    const opening_time = formData.get('opening_time') as string
    const closing_time = formData.get('closing_time') as string
    const exact_location = formData.get('exact_location') as string
    const description = formData.get('description') as string
    const photo_url = formData.get('photo_url') as string

    startTransition(async () => {
      const result = await updateGymSettings(gymId, {
        opening_time: opening_time || null,
        closing_time: closing_time || null,
        exact_location: exact_location || null,
        description: description || null,
        photo_url: photo_url || null,
      })

      if ('error' in result && result.error) {
        setError(result.error)
      } else {
        setSuccess('Gym settings saved.')
      }
    })
  }

  return (
    <form action={handleSubmit} className="gym-form">
      <div className="gym-form-group">
        <label className="gym-label">
          Opening Time
        </label>
        <input
          name="opening_time"
          type="time"
          defaultValue={initial.opening_time ?? ''}
          className="gym-input"
        />
      </div>

      <div className="gym-form-group">
        <label className="gym-label">
          Closing Time
        </label>
        <input
          name="closing_time"
          type="time"
          defaultValue={initial.closing_time ?? ''}
          className="gym-input"
        />
      </div>

      <div className="gym-form-group">
        <label className="gym-label">
          Exact Location
        </label>
        <textarea
          name="exact_location"
          defaultValue={initial.exact_location ?? ''}
          className="gym-textarea"
          rows={3}
          placeholder="Full address or directions to find the gym."
        />
      </div>

      <div className="gym-form-group">
        <label className="gym-label">
          Gym Description
        </label>
        <textarea
          name="description"
          defaultValue={initial.description ?? ''}
          className="gym-textarea"
          rows={4}
          placeholder="Describe your gym, facilities, vibe, and any rules."
        />
      </div>

      <div className="gym-form-group">
        <label className="gym-label">
          Photo URL
        </label>
        <input
          name="photo_url"
          type="url"
          defaultValue={initial.photo_url ?? ''}
          className="gym-input"
          placeholder="https://..."
        />
        <p className="gym-helper-text">
          Upload flow will come later; for now you can paste a hosted image URL.
        </p>
      </div>

      <div className="gym-form-group">
        <label className="gym-label">
          Gym Code
        </label>
        <input
          type="text"
          value={initial.gym_code}
          readOnly
          className="gym-input"
        />
      </div>

      {initial.qr_code_url && (
        <div className="gym-form-group">
          <label className="gym-label">
            Join QR Code
          </label>
          <div
            style={{
              padding: '16px',
              background: 'var(--color-elevated)',
              display: 'inline-block',
            }}
          >
            {/* QR is generated server-side when the gym is created */}
            <img
              src={initial.qr_code_url}
              alt="Gym join QR"
              style={{ width: 160, height: 160 }}
            />
          </div>
        </div>
      )}

      {error && <p className="gym-error-message" style={{ marginTop: '8px' }}>{error}</p>}
      {success && <p className="gym-success-message" style={{ marginTop: '8px' }}>{success}</p>}

      <button
        type="submit"
        className="gym-btn gym-btn-primary"
        disabled={pending}
        style={{ marginTop: 'var(--spacing-md)' }}
      >
        {pending ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  )
}


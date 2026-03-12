import { CreateGymForm } from '@/components/gym/create-gym-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import '@/app/landing.css'
import '@/app/internal.css'

export default function CreateGymPage() {
  return (
    <div className="gym-internal-page gym-section-sm">
      <div className="gym-container-narrow">
        <Link href="/dashboard" className="gym-back-link">
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        <span className="gym-section-label">Setup</span>
        <h1 className="gym-page-title">CREATE YOUR GYM</h1>
        <p className="gym-page-subtitle" style={{ marginBottom: 'var(--spacing-xl)' }}>
          Set up your gym community and invite members to coordinate workouts
        </p>

        <CreateGymForm />
      </div>
    </div>
  )
}

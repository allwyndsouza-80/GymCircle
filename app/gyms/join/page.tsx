import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import '@/app/landing.css'
import '@/app/internal.css'
import { JoinGymForm } from '@/components/gym/join-gym-form'

export default function JoinGymPage() {
  return (
    <div className="gym-internal-page gym-section-sm">
      <div className="gym-container-narrow">
        <Link href="/dashboard" className="gym-back-link">
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        <span className="gym-section-label">Join</span>
        <h1 className="gym-page-title">JOIN A GYM</h1>
        <p className="gym-page-subtitle" style={{ marginBottom: 'var(--spacing-xl)' }}>
          Enter the gym code provided by your gym to request membership
        </p>

        <JoinGymForm />
      </div>
    </div>
  )
}

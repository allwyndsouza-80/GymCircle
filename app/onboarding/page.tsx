import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { setUserPersona } from '@/lib/actions/user.actions'
import '@/app/landing.css'
import '@/app/internal.css'

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user already completed onboarding
  const { data: profile } = await (supabase as any)
    .from('users')
    .select('persona, onboarding_completed')
    .eq('id', user.id)
    .single()

  if (profile?.onboarding_completed) {
    redirect('/dashboard')
  }

  return (
    <div className="gym-page">
      <div className="gym-internal-page gym-section-sm">
        <div className="gym-container">
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
            <span className="gym-section-label">Welcome</span>
            <h1 className="gym-page-title">HOW ARE YOU USING GYMCIRCLE?</h1>
            <p className="gym-page-subtitle" style={{ marginBottom: 'var(--spacing-2xl)' }}>
              Choose the option that best describes you. This helps us tailor your experience.
            </p>
          </div>

          <div className="gym-grid gym-grid-2" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Owner card */}
            <form action={setUserPersona as any} className="gym-card gym-card-clickable">
              <input type="hidden" name="persona" value="owner" />
              <div className="gym-card-icon" style={{ marginBottom: 'var(--spacing-md)' }}>
                {/* Simple icon substitute using text */}
                <span style={{ fontSize: '18px', fontWeight: 700 }}>GYM</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-white)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                I RUN OR MANAGE A GYM
              </h2>
              <p style={{ fontSize: '13px', color: '#777', fontWeight: 300, marginBottom: 'var(--spacing-lg)' }}>
                Set up your gym&apos;s community, calendar, and member coordination in one place.
              </p>
              <button
                type="submit"
                className="gym-btn gym-btn-primary gym-btn-full"
              >
                Continue as Owner
              </button>
            </form>

            {/* Member card */}
            <form action={setUserPersona as any} className="gym-card gym-card-clickable">
              <input type="hidden" name="persona" value="member" />
              <div className="gym-card-icon" style={{ marginBottom: 'var(--spacing-md)' }}>
                <span style={{ fontSize: '18px', fontWeight: 700 }}>ATH</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-white)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                I TRAIN AT A GYM
              </h2>
              <p style={{ fontSize: '13px', color: '#777', fontWeight: 300, marginBottom: 'var(--spacing-lg)' }}>
                Join your gym, see who&apos;s training, and coordinate sessions with your community.
              </p>
              <button
                type="submit"
                className="gym-btn gym-btn-secondary gym-btn-full"
              >
                Continue as Member
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


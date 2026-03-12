import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'
import { Dumbbell } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import '@/app/landing.css'
import '@/app/internal.css'

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="gym-page">
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 'var(--spacing-md)',
      }}>
        <div className="gym-container-narrow">
          <div className="gym-card" style={{ 
            maxWidth: '480px', 
            margin: '0 auto',
            padding: 'var(--spacing-xl)',
          }}>
            {/* Logo Section */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto var(--spacing-md)',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)',
              }}>
                <Dumbbell size={32} color="#000" strokeWidth={2.5} />
              </div>
              
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                letterSpacing: '0.08em',
                color: 'var(--color-white)',
                marginBottom: 'var(--spacing-xs)',
              }}>
                {APP_NAME.toUpperCase()}
              </h1>
              
              <p style={{
                fontSize: '14px',
                color: '#777',
                fontWeight: 300,
                lineHeight: 1.6,
              }}>
                Sign in to coordinate workouts with your gym community
              </p>
            </div>

            {/* Sign In Button */}
            <GoogleSignInButton />

            {/* Terms */}
            <p style={{
              textAlign: 'center',
              fontSize: '11px',
              color: '#555',
              marginTop: 'var(--spacing-md)',
              fontWeight: 300,
            }}>
              By signing in, you agree to our{' '}
              <span style={{ color: 'var(--color-primary)' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: 'var(--color-primary)' }}>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

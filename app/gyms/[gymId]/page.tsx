import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getGymAccess } from '@/lib/gym-access'
import '@/app/landing.css'
import '@/app/internal.css'

interface GymOverviewPageProps {
  params: { gymId: string }
}

export default async function GymOverviewPage({ params }: GymOverviewPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const gymId = params.gymId
  const access = await getGymAccess(supabase, gymId, user.id)
  if (!access.allowed) redirect('/dashboard')

  const { role, gym } = access

  // Members (non-admin, non-owner) go straight to calendar
  if (role === 'member') {
    redirect(`/gyms/${gymId}/calendar`)
  }

  // Preview of members (approved gym_memberships only; owner is not in this table)
  const { data: members } = await supabase
    .from('gym_memberships')
    .select('role, status, users!inner(full_name, email)')
    .eq('gym_id', gymId)
    .eq('status', 'approved')
    .limit(6)

  return (
    <div className="gym-internal-page gym-section-sm">
      <div className="gym-container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <span className="gym-section-label">Gym Overview</span>
          <h1 className="gym-page-title">{gym.name}</h1>
          <p className="gym-page-subtitle">
            {gym.location} • {role.toUpperCase()}
          </p>
        </div>

        {/* Primary actions */}
        <div className="gym-grid gym-grid-3" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Link href={`/gyms/${gymId}/calendar`} className="gym-card gym-card-clickable">
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--color-white)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              Calendar
            </h3>
            <p style={{ fontSize: '13px', color: '#777', fontWeight: 300 }}>
              See who&apos;s training and add sessions for this gym.
            </p>
          </Link>

          <Link href={`/gyms/${gymId}/members`} className="gym-card gym-card-clickable">
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--color-white)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              Members
            </h3>
            <p style={{ fontSize: '13px', color: '#777', fontWeight: 300 }}>
              View everyone who&apos;s part of this gym community.
            </p>
          </Link>

          <Link href={`/gyms/${gymId}/settings`} className="gym-card gym-card-clickable">
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--color-white)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              Settings
            </h3>
            <p style={{ fontSize: '13px', color: '#777', fontWeight: 300 }}>
              Manage this gym&apos;s details, code, and QR (coming soon).
            </p>
          </Link>
        </div>

        {/* Members preview */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--color-white)',
              }}
            >
              Members Preview
            </h2>
            <Link
              href={`/gyms/${gymId}/members`}
              className="gym-btn gym-btn-secondary"
              style={{ padding: '8px 16px', fontSize: '11px' }}
            >
              View All
            </Link>
          </div>

          <div className="gym-grid gym-grid-3">
            {members && members.length > 0 ? (
              members.map((m: any, index: number) => (
                <div key={index} className="gym-card">
                  <p style={{ fontSize: '14px', color: 'var(--color-white)', marginBottom: '4px' }}>
                    {m.users?.full_name || 'Member'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    {m.users?.email}
                  </p>
                  <span className="gym-badge">{m.role}</span>
                </div>
              ))
            ) : (
              <div className="gym-card">
                <p style={{ fontSize: '14px', color: '#777' }}>
                  No members yet. Share your gym code or QR to start inviting people.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


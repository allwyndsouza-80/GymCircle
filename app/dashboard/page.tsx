import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Users, Calendar } from 'lucide-react'
import '@/app/landing.css'
import '@/app/internal.css'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Load user persona / onboarding state
  const { data: profile } = await (supabase as any)
    .from('users')
    .select('persona, onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.onboarding_completed || !profile.persona) {
    redirect('/onboarding')
  }

  const persona = profile.persona as 'owner' | 'member'

  // Owners: list gyms from gyms.owner_id (platform subscription; no gym membership for owners)
  // Members: list gyms from approved gym_memberships
  let ownerGyms: any[] = []
  let memberGyms: any[] = []
  let memberships: any[] = []
  let hasGyms = false
  let subscription: { trial_ends_at?: string; subscription_tier?: string; max_gyms_allowed?: number } | null = null

  if (persona === 'owner') {
    const { data: owned } = await (supabase as any)
      .from('gyms')
      .select('id, name, location, gym_code, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
    ownerGyms = owned ?? []
    const { data: memberShips } = await supabase
      .from('gym_memberships')
      .select('*, gyms(*)')
      .eq('user_id', user.id)
      .eq('status', 'approved')
    memberGyms = (memberShips ?? []).filter((m: any) => m.role !== 'owner')
    memberships = memberShips ?? []
    hasGyms = ownerGyms.length > 0 || memberGyms.length > 0
    const { data: sub } = await (supabase as any)
      .from('users')
      .select('trial_ends_at, subscription_tier, max_gyms_allowed')
      .eq('id', user.id)
      .single()
    subscription = sub ?? null
  } else {
    const { data: memberShips } = await supabase
      .from('gym_memberships')
      .select('*, gyms(*)')
      .eq('user_id', user.id)
      .eq('status', 'approved')
    memberships = memberShips ?? []
    hasGyms = memberships.length > 0
  }

  if (!hasGyms) {
    // Persona-specific first-dashboard experience when user has no gyms yet
    return (
      <div className="gym-internal-page">
        <div className="gym-onboarding">
          <div className="gym-container-narrow">
            <h1 className="gym-onboarding-title">
              {persona === 'owner' ? 'SET UP YOUR GYM' : 'JOIN YOUR GYM'}
            </h1>
            <p className="gym-onboarding-subtitle">
              {persona === 'owner'
                ? 'Create your gym to start coordinating workouts with your members.'
                : 'Join your existing gym using the code shared by your gym owner.'}
            </p>

            <div style={{ marginTop: 'var(--spacing-xl)' }}>
              {persona === 'owner' ? (
                <Link
                  href="/gyms/create"
                  className="gym-card gym-card-clickable"
                  style={{ textAlign: 'center' }}
                >
                  <div className="gym-card-icon" style={{ margin: '0 auto var(--spacing-md)' }}>
                    <Plus size={24} color="var(--color-primary)" />
                  </div>
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
                    Create a Gym
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', fontWeight: 300 }}>
                    Start your own gym community
                  </p>
                </Link>
              ) : (
                <Link
                  href="/gyms/join"
                  className="gym-card gym-card-clickable"
                  style={{ textAlign: 'center' }}
                >
                  <div className="gym-card-icon" style={{ margin: '0 auto var(--spacing-md)' }}>
                    <Users size={24} color="var(--color-primary)" />
                  </div>
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
                    Join a Gym
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', fontWeight: 300 }}>
                    Enter a gym code to join
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const maxGyms = subscription?.max_gyms_allowed ?? 2
  const canAddMoreGyms = ownerGyms.length < maxGyms

  return (
    <div className="gym-internal-page gym-section-sm">
      <div className="gym-container">
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <span className="gym-section-label">Dashboard</span>
          <h1 className="gym-page-title">
            {persona === 'owner' ? 'GYMS I OWN' : 'MY GYMS'}
          </h1>
          <p className="gym-page-subtitle">
            {persona === 'owner'
              ? 'Open a gym to manage members, sessions, and settings.'
              : 'Select a gym to view the workout calendar and coordinate sessions.'}
          </p>
        </div>

        {/* Owner dashboard: show owned gyms first, then gyms they're a member of */}
        {persona === 'owner' ? (
          <>
            {/* Gyms I Own (from platform subscription; owner has no gym membership) */}
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
                Gyms I Own
              </h2>
              {canAddMoreGyms ? (
                <Link
                  href="/gyms/create"
                  className="gym-btn gym-btn-primary"
                  style={{ padding: '10px 20px', fontSize: '11px' }}
                >
                  Create New Gym
                </Link>
              ) : (
                <span className="gym-btn gym-btn-secondary" style={{ padding: '10px 20px', fontSize: '11px', cursor: 'default', opacity: 0.9 }}>
                  Upgrade to add more gyms
                </span>
              )}
            </div>
            {subscription?.trial_ends_at && (
              <p style={{ fontSize: '12px', color: '#888', marginBottom: 'var(--spacing-md)' }}>
                Free trial ends {new Date(subscription.trial_ends_at).toLocaleDateString()}. Plan: {ownerGyms.length}/{maxGyms} gyms.
              </p>
            )}

            <div className="gym-grid gym-grid-3" style={{ marginBottom: 'var(--spacing-2xl)' }}>
              {ownerGyms.map((gym: any) => (
                <Link
                  key={gym.id}
                  href={`/gyms/${gym.id}`}
                  className="gym-card gym-card-clickable"
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--spacing-md)',
                    }}
                  >
                    <div className="gym-card-icon">
                      <Calendar size={22} color="var(--color-primary)" />
                    </div>
                    <span className="gym-badge">owner</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '20px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--color-white)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    {gym.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', fontWeight: 300 }}>
                    {gym.location}
                  </p>
                </Link>
              ))}
            </div>

            {/* Gyms I'm a Member Of (non-owner roles) */}
            {memberGyms.length > 0 && (
              <>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '18px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--color-white)',
                    marginBottom: 'var(--spacing-md)',
                  }}
                >
                  Gyms I&apos;m a Member Of
                </h2>
                <div className="gym-grid gym-grid-3">
                  {memberGyms.map((membership: any) => (
                    <Link
                      key={membership.id}
                      href={`/gyms/${membership.gym_id}/calendar`}
                      className="gym-card gym-card-clickable"
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          marginBottom: 'var(--spacing-md)',
                        }}
                      >
                        <div className="gym-card-icon">
                          <Calendar size={22} color="var(--color-primary)" />
                        </div>
                        <span className="gym-badge">
                          {membership.role}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '20px',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          color: 'var(--color-white)',
                          marginBottom: 'var(--spacing-xs)',
                        }}
                      >
                        {membership.gyms?.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#666', fontWeight: 300 }}>
                        {membership.gyms?.location}
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* Member dashboard: show gyms they belong to + join another gym */
          <>
            <div className="gym-grid gym-grid-3">
              {memberships?.map((membership: any) => (
                <Link
                  key={membership.id}
                  href={`/gyms/${membership.gym_id}/calendar`}
                  className="gym-card gym-card-clickable"
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--spacing-md)',
                    }}
                  >
                    <div className="gym-card-icon">
                      <Calendar size={22} color="var(--color-primary)" />
                    </div>
                    <span className="gym-badge">
                      {membership.role}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '20px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--color-white)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    {membership.gyms?.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', fontWeight: 300 }}>
                    {membership.gyms?.location}
                  </p>
                </Link>
              ))}

              {/* Allow joining additional gyms as a secondary option */}
              <Link
                href="/gyms/join"
                className="gym-card gym-card-clickable"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderStyle: 'dashed',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-steel)',
                    marginBottom: 'var(--spacing-sm)',
                  }}
                >
                  <Plus size={24} color="#666" />
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#666',
                  }}
                >
                  Join Another Gym
                </p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getGymAccess } from '@/lib/gym-access'
import '@/app/landing.css'
import '@/app/internal.css'

interface MembersPageProps {
  params: { gymId: string }
}

export default async function GymMembersPage({ params }: MembersPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const gymId = params.gymId
  const access = await getGymAccess((supabase as any), gymId, user.id)
  if (!access.allowed) redirect('/dashboard')

  const { role, gym } = access

  // Owner is from gym.owner_id (not in gym_memberships); fetch for display
  const { data: gymRow } = await (supabase as any).from('gyms').select('owner_id').eq('id', gymId).single()
  let ownerProfile: { full_name: string | null; email: string } | null = null
  if (gymRow?.owner_id) {
    const { data: owner } = await (supabase as any).from('users').select('full_name, email').eq('id', gymRow.owner_id).single()
    ownerProfile = owner ?? null
  }

  // Load all approved members (gym_memberships only; owner is not in this table)
  const { data: members } = await supabase
    .from('gym_memberships')
    .select('role, status, created_at, users!inner(full_name, email)')
    .eq('gym_id', gymId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true })

  return (
    <div className="gym-internal-page gym-section-sm">
      <div className="gym-container">
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <span className="gym-section-label">Members</span>
          <h1 className="gym-page-title">{gym.name}</h1>
          <p className="gym-page-subtitle">
            {gym.location} • {role.toUpperCase()}
          </p>
        </div>

        {/* Owner row (platform account; not a gym member) */}
        {ownerProfile && (
          <div className="gym-card" style={{ marginBottom: 'var(--spacing-md)' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-white)', marginBottom: '4px' }}>
              {ownerProfile.full_name || 'Owner'}
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{ownerProfile.email}</p>
            <span className="gym-badge">owner</span>
          </div>
        )}

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
                No approved members yet. Once people join your gym and are approved, they&apos;ll appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


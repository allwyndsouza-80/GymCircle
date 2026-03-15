import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getGymAccess } from '@/lib/gym-access'
import { approveMembership, rejectMembership } from '@/lib/actions/gym.actions'
import '@/app/landing.css'
import '@/app/internal.css'
import { MembersTable } from '@/components/members-table/members-table'
import BackButton from '@/components/back-button/back-button'

interface MembersPageProps {
  params: Promise<{ gymId: string }>
}

export default async function GymMembersPage({ params }: MembersPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { gymId } = await params
  const access = await getGymAccess((supabase as any), gymId, user.id)
  if (!access.allowed) redirect('/dashboard')

  const { role, gym } = access

  // Owner profile
  const { data: gymRow } = await (supabase as any).from('gyms').select('owner_id').eq('id', gymId).single()
  let ownerProfile: { full_name: string | null; email: string } | null = null
  if (gymRow?.owner_id) {
    const { data: owner } = await (supabase as any)
      .from('users')
      .select('full_name, email')
      .eq('id', gymRow.owner_id)
      .single()
    ownerProfile = owner ?? null
  }

  const { data: members } = await (supabase as any)
    .from('gym_memberships')
    .select('id, role, status, created_at, user_id, users!gym_memberships_user_id_fkey(id, full_name, email)')
    .eq('gym_id', gymId)
    .order('created_at', { ascending: true })

  async function handleApprove(id: string) {
    'use server'
    await approveMembership(id)
  }

  async function handleReject(id: string) {
    'use server'
    await rejectMembership(id)
  }

  return (
    <div className="gym-internal-page gym-section-sm">
      <div className="gym-container">
        <BackButton gymName={gym.name} pageName="Members" />

        {/* Members table */}
        <MembersTable
          members={members ?? []}
          isOwner={role === 'owner'}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  )
}
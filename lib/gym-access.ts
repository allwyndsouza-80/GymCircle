import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Resolve if the current user can access a gym and their role.
 * Owners are identified by gyms.owner_id (no gym_membership row).
 * Members are identified by approved gym_memberships.
 */
export async function getGymAccess(
  supabase: SupabaseClient,
  gymId: string,
  userId: string
): Promise<
  | { allowed: true; role: 'owner' | 'admin' | 'member'; gym: { id: string; name: string; location: string } }
  | { allowed: false }
> {
  const { data: gym } = await (supabase as any)
    .from('gyms')
    .select('id, name, location, owner_id')
    .eq('id', gymId)
    .single()

  if (!gym) {
    return { allowed: false }
  }

  if (gym.owner_id === userId) {
    return { allowed: true, role: 'owner', gym: { id: gym.id, name: gym.name, location: gym.location } }
  }

  const { data: membership } = await supabase
    .from('gym_memberships')
    .select('role, status')
    .eq('gym_id', gymId)
    .eq('user_id', userId)
    .single()

  if (!membership || membership.status !== 'approved') {
    return { allowed: false }
  }

  return {
    allowed: true,
    role: membership.role as 'admin' | 'member',
    gym: { id: gym.id, name: gym.name, location: gym.location },
  }
}

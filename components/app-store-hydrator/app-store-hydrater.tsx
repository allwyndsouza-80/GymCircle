'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store/app-store'
import { createClient } from '@/lib/supabase/client'

export function AppStoreHydrator() {
  const lastSyncedAt = useAppStore((s) => s.lastSyncedAt)
  const setUser = useAppStore((s) => s.setUser)
  const setGymsOwned = useAppStore((s) => s.setGymsOwned)
  const setMemberships = useAppStore((s) => s.setMemberships)
  const markSyncedNow = useAppStore((s) => s.markSyncedNow)

  useEffect(() => {
    const shouldSync =
      !lastSyncedAt || Date.now() - lastSyncedAt > 5 * 60 * 1000 // 5 minutes

    if (!shouldSync) return

    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch lightweight profile + gyms in ONE shot (you can expose a RPC or use two small queries)
      const { data: profile }:any = await supabase
        .from('users')
        .select('persona, email')
        .eq('id', user.id)
        .single()

      const { data: memberships } = await supabase
        .from('gym_memberships')
        .select('gym_id, gyms(name, location)')
        .eq('user_id', user.id)
        .eq('status', 'approved')

      setUser({ id: user.id, email: profile?.email ?? user.email, persona: profile?.persona ?? null })
      setGymsOwned(memberships?.map((m: any) => ({ id: m.gym_id, name: m.gyms?.name, location: m.gyms?.location })) ?? []) // or query gyms.owner_id = user.id similarly
      setMemberships(
        (memberships ?? []).map((m: any) => ({
          id: m.gym_id,
          name: m.gyms?.name,
          location: m.gyms?.location,
        }))
      )
      markSyncedNow()
    })()
  }, [lastSyncedAt, setUser, setGymsOwned, setMemberships, markSyncedNow])

  return null
}
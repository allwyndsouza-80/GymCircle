'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateGymCode } from '@/lib/utils'
import QRCode from 'qrcode'
import { TRIAL_MONTHS, MAX_GYMS_TRIAL } from '@/lib/constants'

export async function createGym(formData: { name: string; location: string }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Count gyms this user already owns (platform subscription: owners don't have gym membership)
  const { count: ownedCount, error: countError } = await (supabase as any)
    .from('gyms')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id)

  if (countError) {
    return { error: countError.message }
  }

  // Load platform subscription (trial_ends_at, max_gyms_allowed) for this user
  const { data: profile } = await (supabase as any)
    .from('users')
    .select('trial_ends_at, subscription_tier, max_gyms_allowed')
    .eq('id', user.id)
    .single()

  const maxGyms = profile?.max_gyms_allowed ?? MAX_GYMS_TRIAL
  if ((ownedCount ?? 0) >= maxGyms) {
    return {
      error: `You've reached your limit of ${maxGyms} gym${maxGyms === 1 ? '' : 's'}. Upgrade your plan to add more gyms.`,
    }
  }

  // First gym: start 3-month free trial and set max_gyms_allowed
  if ((ownedCount ?? 0) === 0 && !profile?.trial_ends_at) {
    const trialEndsAt = new Date()
    trialEndsAt.setMonth(trialEndsAt.getMonth() + TRIAL_MONTHS)
    await (supabase as any)
      .from('users')
      .update({
        trial_ends_at: trialEndsAt.toISOString(),
        subscription_tier: 'trial',
        max_gyms_allowed: MAX_GYMS_TRIAL,
      })
      .eq('id', user.id)
  }

  const gymCode = generateGymCode()

  const qrCodeDataUrl = await QRCode.toDataURL(
    `${process.env.NEXT_PUBLIC_APP_URL}/gyms/join?code=${gymCode}`,
    { width: 300, margin: 2 }
  )

  const { data: gym, error } = await (supabase as any)
    .from('gyms')
    .insert({
      name: formData.name,
      location: formData.location,
      gym_code: gymCode,
      owner_id: user.id,
      qr_code_url: qrCodeDataUrl,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { data: gym }
}

export async function updateGymSettings(
  gymId: string,
  formData: {
    opening_time?: string | null
    closing_time?: string | null
    exact_location?: string | null
    description?: string | null
    photo_url?: string | null
  }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Ensure the current user owns this gym
  const { data: gym, error: loadError } = await (supabase as any)
    .from('gyms')
    .select('id, owner_id')
    .eq('id', gymId)
    .single()

  if (loadError || !gym || gym.owner_id !== user.id) {
    return { error: 'You are not allowed to update this gym.' }
  }

  const { error } = await (supabase as any)
    .from('gyms')
    .update({
      opening_time: formData.opening_time || null,
      closing_time: formData.closing_time || null,
      exact_location: formData.exact_location || null,
      description: formData.description || null,
      photo_url: formData.photo_url || null,
    })
    .eq('id', gymId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/gyms/${gymId}`)
  revalidatePath(`/gyms/${gymId}/settings`)
  return { success: true }
}

export async function joinGym(gymCode: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Find gym by code
  const { data: gym, error: gymError } = await supabase
    .from('gyms')
    .select('id')
    .eq('gym_code', gymCode.toUpperCase())
    .single()

  if (gymError || !gym) {
    return { error: 'Invalid gym code' }
  }

  // Check if already a member
  const gymId = (gym as any).id

  const { data: existingMembership } = await (supabase as any)
    .from('gym_memberships')
    .select('id, status')
    .eq('gym_id', gymId)
    .eq('user_id', user.id)
    .single()

  if (existingMembership) {
    if (existingMembership.status === 'approved') {
      return { error: 'You are already a member of this gym' }
    }
    if (existingMembership.status === 'pending') {
      return { error: 'Your join request is pending approval' }
    }
    if (existingMembership.status === 'banned') {
      return { error: 'You are banned from this gym' }
    }
  }

  // Create membership request
  const { data: membership, error: membershipError } = await (supabase as any)
    .from('gym_memberships')
    .insert({
      gym_id: gymId,
      user_id: user.id,
      role: 'member',
      status: 'pending',
    })
    .select()
    .single()

  if (membershipError) {
    return { error: membershipError.message }
  }

  revalidatePath('/dashboard')
  return { data: membership }
}

export async function approveMembership(membershipId: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: membership, error } = await (supabase as any)
    .from('gym_memberships')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: user.id,
    })
    .eq('id', membershipId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { data: membership }
}

export async function rejectMembership(membershipId: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: membership, error } = await (supabase as any)
    .from('gym_memberships')
    .update({
      status: 'rejected',
    })
    .eq('id', membershipId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { data: membership }
}

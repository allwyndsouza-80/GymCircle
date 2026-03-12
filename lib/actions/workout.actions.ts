'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface CreateWorkoutInput {
  gymId: string
  workoutDate: string // ISO date (YYYY-MM-DD)
  workoutTime: string // HH:MM
  workoutType: string
  notes?: string
  lookingForPartner?: boolean
  revalidateTarget?: string
}

export async function createWorkout(input: CreateWorkoutInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Basic validation
  if (!input.workoutDate || !input.workoutTime || !input.workoutType) {
    return { error: 'Missing required fields' }
  }

  const { data, error } = await (supabase as any)
    .from('workout_plans')
    .insert({
      gym_id: input.gymId,
      user_id: user.id,
      workout_date: input.workoutDate,
      workout_time: input.workoutTime,
      workout_type: input.workoutType,
      notes: input.notes ?? null,
      looking_for_partner: !!input.lookingForPartner,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  if (input.revalidateTarget) {
    revalidatePath(input.revalidateTarget)
  }

  return { data }
}

export async function deleteWorkout(workoutId: string, revalidateTarget?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await (supabase as any)
    .from('workout_plans')
    .delete()
    .eq('id', workoutId)

  if (error) {
    return { error: error.message }
  }

  if (revalidateTarget) {
    revalidatePath(revalidateTarget)
  }

  return { success: true }
}


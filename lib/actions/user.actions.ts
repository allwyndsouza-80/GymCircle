'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Persona = 'owner' | 'member'

export async function setUserPersona(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const persona = formData.get('persona')

  if (persona !== 'owner' && persona !== 'member') {
    return { error: 'Invalid persona' }
  }

  const { error } = await (supabase as any)
    .from('users')
    .update({
      persona: persona as Persona,
      onboarding_completed: true,
    })
    .eq('id', user.id)

  if (error) {
    // In a server action, we can just redirect even if update failed; for now log to console.
    console.error('Error updating user persona:', error.message)
  }

  // Redirect into the correct first journey
  if (persona === 'owner') {
    redirect('/gyms/create')
  } else {
    redirect('/gyms/join')
  }
}



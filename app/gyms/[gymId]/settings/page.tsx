import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getGymAccess } from '@/lib/gym-access'
import { GymSettingsForm } from '@/components/gym/gym-settings-form'
import '@/app/landing.css'
import '@/app/internal.css'
import BackButton from '@/components/back-button/back-button'

interface GymSettingsPageProps {
  params: Promise<{ gymId: string }>
}

export default async function GymSettingsPage({ params }: GymSettingsPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { gymId } = await params
  const access = await getGymAccess((supabase as any), gymId, user.id)
  if (!access.allowed || access.role !== 'owner') {
    redirect('/dashboard')
  }

  const { gym } = access

  const { data: gymRow } = await (supabase as any)
    .from('gyms')
    .select('opening_time, closing_time, exact_location, description, photo_url, gym_code, qr_code_url')
    .eq('id', gymId)
    .single()

  return (
    <div className="gym-internal-page gym-section-sm">
      <div className="gym-container">
        <BackButton gymName="" pageName="Settings" />

        <GymSettingsForm
          gymId={gymId}
          initial={{
            opening_time: gymRow?.opening_time ?? null,
            closing_time: gymRow?.closing_time ?? null,
            exact_location: gymRow?.exact_location ?? null,
            description: gymRow?.description ?? null,
            photo_url: gymRow?.photo_url ?? null,
            gym_code: gymRow?.gym_code,
            qr_code_url: gymRow?.qr_code_url ?? null,
          }}
        />
      </div>
    </div>
  )
}


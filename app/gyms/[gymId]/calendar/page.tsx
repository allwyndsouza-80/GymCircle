import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateWorkoutForm } from '@/components/workout/create-workout-form'
import '@/app/landing.css'
import '@/app/internal.css'

interface CalendarPageProps {
  params: { gymId: string }
  searchParams: { date?: string }
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export default async function GymCalendarPage({ params, searchParams }: CalendarPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const gymId = params.gymId

  const { getGymAccess } = await import('@/lib/gym-access')
  const access = await getGymAccess((supabase as any), gymId, user.id)
  if (!access.allowed) redirect('/dashboard')

  const { role, gym } = access

  // Determine active date (default today)
  const today = new Date()
  const activeDateStr = searchParams.date ?? today.toISOString().slice(0, 10)
  const activeDate = new Date(activeDateStr)

  // Load workouts for this gym & date
  const { data: workouts } = await supabase
    .from('workout_plans')
    .select('id, user_id, workout_date, workout_time, workout_type, notes, looking_for_partner, users!inner(full_name, avatar_url)')
    .eq('gym_id', gymId)
    .eq('workout_date', activeDateStr)
    .order('workout_time', { ascending: true })

  return (
    <div className="gym-internal-page gym-section-sm">
      <div className="gym-container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <span className="gym-section-label">Calendar</span>
          <h1 className="gym-page-title">{gym.name}</h1>
          <p className="gym-page-subtitle">
            {gym.location} • {role.toUpperCase()}
          </p>
        </div>

        {/* Date selector + summary */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <div>
            <label htmlFor="date" className="gym-label">
              Day
            </label>
            <form action="" method="GET">
              <input
                id="date"
                name="date"
                type="date"
                defaultValue={activeDateStr}
                className="gym-input"
                style={{ maxWidth: '220px' }}
              />
            </form>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#777' }}>
              {formatDateLabel(activeDate)} • {workouts?.length ?? 0} session{(workouts?.length ?? 0) === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {/* Workouts list */}
        <div className="gym-grid" style={{ gap: 'var(--spacing-md)' }}>
          {workouts && workouts.length > 0 ? (
            workouts.map((workout: any) => (
              <div key={workout.id} className="gym-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#777', marginBottom: '4px' }}>
                      {workout.users?.full_name || 'Member'}
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {workout.workout_type}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 600 }}>
                      {workout.workout_time.slice(0, 5)}
                    </p>
                    {workout.looking_for_partner && (
                      <span className="gym-badge" style={{ marginTop: '4px', display: 'inline-block' }}>
                        Looking for partner
                      </span>
                    )}
                  </div>
                </div>
                {workout.notes && (
                  <p style={{ fontSize: '13px', color: '#777', marginTop: 'var(--spacing-sm)' }}>
                    {workout.notes}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="gym-card">
              <p style={{ fontSize: '14px', color: '#777' }}>
                No sessions planned for this day yet. Be the first to add one.
              </p>
            </div>
          )}
        </div>

        {/* Create workout form */}
        <CreateWorkoutForm
          gymId={gymId}
          defaultDate={activeDateStr}
          revalidateTarget={`/gyms/${gymId}/calendar`}
        />
      </div>
    </div>
  )
}


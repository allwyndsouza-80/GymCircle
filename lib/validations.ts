import { z } from 'zod'

export const createGymSchema = z.object({
  name: z.string().min(2, 'Gym name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
})

export const joinGymSchema = z.object({
  gymCode: z.string().min(6, 'Gym code must be at least 6 characters'),
})

export const createWorkoutSchema = z.object({
  gymId: z.string().uuid(),
  workoutDate: z.string(),
  workoutTime: z.string(),
  workoutType: z.enum(['Chest', 'Back', 'Legs', 'Cardio', 'Full Body']),
  notes: z.string().optional(),
  lookingForPartner: z.boolean().default(false),
})

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
})

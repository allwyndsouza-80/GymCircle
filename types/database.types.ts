export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          trial_ends_at: string | null
          subscription_tier: 'trial' | 'starter' | 'growth' | 'enterprise' | null
          max_gyms_allowed: number | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          trial_ends_at?: string | null
          subscription_tier?: 'trial' | 'starter' | 'growth' | 'enterprise' | null
          max_gyms_allowed?: number | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
          trial_ends_at?: string | null
          subscription_tier?: 'trial' | 'starter' | 'growth' | 'enterprise' | null
          max_gyms_allowed?: number | null
        }
      }
      gyms: {
        Row: {
          id: string
          name: string
          location: string
          gym_code: string
          owner_id: string
          qr_code_url: string | null
          created_at: string
          updated_at: string
          opening_time: string | null
          closing_time: string | null
          exact_location: string | null
          description: string | null
          photo_url: string | null
        }
        Insert: {
          id?: string
          name: string
          location: string
          gym_code: string
          owner_id: string
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
          opening_time?: string | null
          closing_time?: string | null
          exact_location?: string | null
          description?: string | null
          photo_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          location?: string
          gym_code?: string
          owner_id?: string
          qr_code_url?: string | null
          updated_at?: string
          opening_time?: string | null
          closing_time?: string | null
          exact_location?: string | null
          description?: string | null
          photo_url?: string | null
        }
      }
      gym_memberships: {
        Row: {
          id: string
          gym_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          status: 'pending' | 'approved' | 'rejected' | 'banned'
          created_at: string
          approved_at: string | null
          approved_by: string | null
        }
        Insert: {
          id?: string
          gym_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          status?: 'pending' | 'approved' | 'rejected' | 'banned'
          created_at?: string
          approved_at?: string | null
          approved_by?: string | null
        }
        Update: {
          id?: string
          gym_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          status?: 'pending' | 'approved' | 'rejected' | 'banned'
          approved_at?: string | null
          approved_by?: string | null
        }
      }
      workout_plans: {
        Row: {
          id: string
          gym_id: string
          user_id: string
          workout_date: string
          workout_time: string
          workout_type: string
          notes: string | null
          looking_for_partner: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gym_id: string
          user_id: string
          workout_date: string
          workout_time: string
          workout_type: string
          notes?: string | null
          looking_for_partner?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gym_id?: string
          user_id?: string
          workout_date?: string
          workout_time?: string
          workout_type?: string
          notes?: string | null
          looking_for_partner?: boolean
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          gym_id: string | null
          type: string
          title: string
          message: string
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gym_id?: string | null
          type: string
          title: string
          message: string
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gym_id?: string | null
          type?: string
          title?: string
          message?: string
          is_read?: boolean
          action_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

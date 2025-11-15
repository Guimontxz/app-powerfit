import { createClient } from '@supabase/supabase-js'

// Validação de variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Criar cliente apenas se as variáveis estiverem configuradas
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null

// Helper para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabase)
}

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          fitness_level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          fitness_level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          fitness_level?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_logs: {
        Row: {
          id: string
          user_id: string
          workout_day: number
          workout_title: string
          completed_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_day: number
          workout_title: string
          completed_at?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_day?: number
          workout_title?: string
          completed_at?: string
          notes?: string | null
          created_at?: string
        }
      }
      exercise_progress: {
        Row: {
          id: string
          user_id: string
          exercise_name: string
          weight: number | null
          reps: number | null
          sets: number | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_name: string
          weight?: number | null
          reps?: number | null
          sets?: number | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_name?: string
          weight?: number | null
          reps?: number | null
          sets?: number | null
          recorded_at?: string
          created_at?: string
        }
      }
    }
  }
}

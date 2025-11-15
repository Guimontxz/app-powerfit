import { supabase, isSupabaseConfigured } from './supabase'

export async function signUp(email: string, password: string, fullName?: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado. Configure suas credenciais.')
  }

  const { data, error } = await supabase!.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error

  // Criar perfil do usuário
  if (data.user) {
    const { error: profileError } = await supabase!
      .from('user_profiles')
      .insert({
        user_id: data.user.id,
        full_name: fullName || null,
        fitness_level: 'intermediário',
      })

    if (profileError) console.error('Erro ao criar perfil:', profileError)
  }

  return data
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado. Configure suas credenciais.')
  }

  const { data, error } = await supabase!.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    return
  }

  const { error } = await supabase!.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null
  }

  const { data: { user } } = await supabase!.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  if (!isSupabaseConfigured()) {
    return null
  }

  const { data, error } = await supabase!
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }

  return data
}

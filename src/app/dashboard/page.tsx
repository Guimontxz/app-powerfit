"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, signOut } from "@/lib/auth"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { 
  Flame, 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  LogOut, 
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Target,
  Activity
} from "lucide-react"

interface WorkoutDay {
  day: string
  focus: string
  warmup: string[]
  main: {
    exercise: string
    sets: number
    reps: string
    rest: string
  }[]
  cooldown: string[]
}

interface WorkoutCompletion {
  id?: string
  user_id: string
  workout_day: string
  completed_at: string
}

const workoutPlan: WorkoutDay[] = [
  {
    day: "Dia 1",
    focus: "Força de Membros Inferiores + Cardio",
    warmup: [
      "5 minutos de corda de pular (ritmo moderado)",
      "10 agachamentos livres",
      "10 lunges alternados"
    ],
    main: [
      { exercise: "Agachamento com barra", sets: 4, reps: "8-10", rest: "90s" },
      { exercise: "Levantamento terra com kettlebell", sets: 3, reps: "10-12", rest: "60s" },
      { exercise: "Afundo com halteres", sets: 3, reps: "10 cada perna", rest: "60s" },
      { exercise: "Swing com kettlebell", sets: 3, reps: "15", rest: "45s" },
      { exercise: "Burpees", sets: 3, reps: "10", rest: "60s" }
    ],
    cooldown: [
      "Alongamento de quadríceps (30s cada perna)",
      "Alongamento de isquiotibiais (30s cada perna)",
      "Alongamento de glúteos (30s cada lado)"
    ]
  },
  {
    day: "Dia 2",
    focus: "Força de Membros Superiores + Core",
    warmup: [
      "3 minutos de corda de pular",
      "10 círculos de braços para frente e para trás",
      "10 flexões de braço (pode ser no joelho)"
    ],
    main: [
      { exercise: "Supino com halteres", sets: 4, reps: "8-10", rest: "90s" },
      { exercise: "Remada curvada com barra", sets: 4, reps: "8-10", rest: "90s" },
      { exercise: "Desenvolvimento com halteres", sets: 3, reps: "10-12", rest: "60s" },
      { exercise: "Rosca direta com barra", sets: 3, reps: "10-12", rest: "45s" },
      { exercise: "Prancha abdominal", sets: 3, reps: "45-60s", rest: "45s" }
    ],
    cooldown: [
      "Alongamento de peitorais (30s)",
      "Alongamento de ombros (30s cada lado)",
      "Alongamento de tríceps (30s cada braço)"
    ]
  },
  {
    day: "Dia 3",
    focus: "Treino Funcional + Condicionamento",
    warmup: [
      "5 minutos de corda de pular (variando intensidade)",
      "10 jumping jacks",
      "10 mountain climbers"
    ],
    main: [
      { exercise: "Complexo com kettlebell (swing + clean + press)", sets: 4, reps: "8 cada", rest: "90s" },
      { exercise: "Agachamento com salto", sets: 3, reps: "12", rest: "60s" },
      { exercise: "Flexão de braço com rotação", sets: 3, reps: "10 cada lado", rest: "60s" },
      { exercise: "Turkish get-up com kettlebell", sets: 3, reps: "5 cada lado", rest: "90s" },
      { exercise: "Circuito final: 30s burpees + 30s mountain climbers + 30s prancha", sets: 3, reps: "3 rodadas", rest: "60s" }
    ],
    cooldown: [
      "Alongamento completo de corpo (5 minutos)",
      "Respiração profunda (2 minutos)",
      "Mobilidade de quadril e ombros"
    ]
  }
]

const progressionGuide = [
  { week: "Semanas 1-2", instruction: "Foque na técnica correta. Use cargas que permitam completar todas as séries e repetições com boa forma." },
  { week: "Semanas 3-4", instruction: "Aumente a carga em 5-10% nos exercícios principais. Mantenha a técnica." },
  { week: "Semanas 5-6", instruction: "Adicione 1-2 repetições por série OU aumente mais 5% na carga." },
  { week: "Semanas 7-8", instruction: "Teste seus limites! Tente cargas mais pesadas mantendo 8 repetições com boa forma." }
]

const stretchingRoutine = [
  "Alongamento de quadríceps em pé (30s cada perna)",
  "Alongamento de isquiotibiais sentado (45s)",
  "Alongamento de glúteos deitado (30s cada lado)",
  "Alongamento de peitorais na parede (30s)",
  "Alongamento de ombros cruzado (30s cada braço)",
  "Alongamento de tríceps (30s cada braço)",
  "Alongamento de lombar (gato-vaca) (1 minuto)",
  "Alongamento de flexores do quadril (30s cada lado)"
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    streak: 0
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase não configurado')
        setLoading(false)
        return
      }

      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }

      setUser(currentUser)
      await loadWorkoutData(currentUser.id)
    } catch (error) {
      console.error("Erro ao verificar usuário:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const loadWorkoutData = async (userId: string) => {
    if (!isSupabaseConfigured()) return

    try {
      const { data, error } = await supabase!
        .from('workout_completions')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error

      if (data) {
        const completed = new Set(data.map((w: WorkoutCompletion) => w.workout_day))
        setCompletedWorkouts(completed)

        // Calcular estatísticas
        const total = data.length
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const thisWeek = data.filter((w: WorkoutCompletion) => 
          new Date(w.completed_at) >= weekAgo
        ).length

        setStats({
          totalWorkouts: total,
          thisWeek,
          streak: calculateStreak(data)
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const calculateStreak = (workouts: WorkoutCompletion[]): number => {
    if (workouts.length === 0) return 0

    const sortedDates = workouts
      .map(w => new Date(w.completed_at).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    const uniqueDates = [...new Set(sortedDates)]
    let streak = 0
    const today = new Date().toDateString()

    for (let i = 0; i < uniqueDates.length; i++) {
      const date = new Date(uniqueDates[i])
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - i)

      if (date.toDateString() === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const toggleWorkoutCompletion = async (day: string) => {
    if (!isSupabaseConfigured() || !user) return

    try {
      const isCompleted = completedWorkouts.has(day)

      if (isCompleted) {
        // Remover conclusão
        const { error } = await supabase!
          .from('workout_completions')
          .delete()
          .eq('user_id', user.id)
          .eq('workout_day', day)

        if (error) throw error

        const newCompleted = new Set(completedWorkouts)
        newCompleted.delete(day)
        setCompletedWorkouts(newCompleted)
      } else {
        // Adicionar conclusão
        const { error } = await supabase!
          .from('workout_completions')
          .insert({
            user_id: user.id,
            workout_day: day,
            completed_at: new Date().toISOString()
          })

        if (error) throw error

        const newCompleted = new Set(completedWorkouts)
        newCompleted.add(day)
        setCompletedWorkouts(newCompleted)
      }

      // Recarregar estatísticas
      await loadWorkoutData(user.id)
    } catch (error) {
      console.error("Erro ao atualizar treino:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Flame className="w-16 h-16 text-[#ff6b00] animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1a1a1a] rounded-2xl border border-[#ff6b00]/20 p-8 text-center">
          <Flame className="w-16 h-16 text-[#ff6b00] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Configuração Necessária</h2>
          <p className="text-gray-400 mb-6">
            O Supabase não está configurado. Configure suas credenciais para usar o dashboard completo.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-[#ff6b00]/20 transition-all"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#ff6b00]/20 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] p-3 rounded-xl shadow-lg shadow-[#ff6b00]/20">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  PowerFit
                </h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-[#ff6b00] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Bem-vindo, <span className="text-[#ff6b00]">{user?.email?.split('@')[0] || 'Atleta'}</span>! 💪
          </h2>
          <p className="text-gray-400">Seu plano de treino semanal está pronto</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-[#ff6b00]/20">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#ff6b00]/10 p-3 rounded-xl">
                <Dumbbell className="w-6 h-6 text-[#ff6b00]" />
              </div>
              <span className="text-3xl font-bold text-[#ff6b00]">{stats.totalWorkouts}</span>
            </div>
            <p className="text-gray-400 text-sm">Treinos Completados</p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-[#ff6b00]/20">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#ff6b00]/10 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-[#ff6b00]" />
              </div>
              <span className="text-3xl font-bold text-[#ff6b00]">{stats.thisWeek}</span>
            </div>
            <p className="text-gray-400 text-sm">Esta Semana</p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-[#ff6b00]/20">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#ff6b00]/10 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-[#ff6b00]" />
              </div>
              <span className="text-3xl font-bold text-[#ff6b00]">{stats.streak}</span>
            </div>
            <p className="text-gray-400 text-sm">Dias Consecutivos</p>
          </div>
        </div>

        {/* Workout Plan */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#ff6b00]" />
            Plano de Treino Semanal
          </h3>

          <div className="space-y-4">
            {workoutPlan.map((workout) => (
              <div
                key={workout.day}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#ff6b00]/20 overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-[#1a1a1a]/50 transition-colors"
                  onClick={() => setExpandedDay(expandedDay === workout.day ? null : workout.day)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWorkoutCompletion(workout.day)
                        }}
                        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                          completedWorkouts.has(workout.day)
                            ? 'bg-[#ff6b00] border-[#ff6b00]'
                            : 'border-[#ff6b00]/20 hover:border-[#ff6b00]/40'
                        }`}
                      >
                        {completedWorkouts.has(workout.day) && (
                          <CheckCircle className="w-6 h-6 text-white" />
                        )}
                      </button>
                      <div>
                        <h4 className="text-xl font-bold">{workout.day}</h4>
                        <p className="text-[#ff6b00] text-sm">{workout.focus}</p>
                      </div>
                    </div>
                    {expandedDay === workout.day ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedDay === workout.day && (
                  <div className="px-6 pb-6 space-y-6">
                    {/* Aquecimento */}
                    <div>
                      <h5 className="text-sm font-bold text-[#ff6b00] mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        AQUECIMENTO (5 min)
                      </h5>
                      <ul className="space-y-2">
                        {workout.warmup.map((item, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-[#ff6b00] mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Parte Principal */}
                    <div>
                      <h5 className="text-sm font-bold text-[#ff6b00] mb-3 flex items-center gap-2">
                        <Dumbbell className="w-4 h-4" />
                        PARTE PRINCIPAL (20 min)
                      </h5>
                      <div className="space-y-3">
                        {workout.main.map((exercise, idx) => (
                          <div
                            key={idx}
                            className="bg-[#0a0a0a] rounded-xl p-4 border border-[#ff6b00]/10"
                          >
                            <p className="font-bold text-white mb-2">{exercise.exercise}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Target className="w-4 h-4 text-[#ff6b00]" />
                                {exercise.sets} séries
                              </span>
                              <span className="flex items-center gap-1">
                                <Activity className="w-4 h-4 text-[#ff6b00]" />
                                {exercise.reps} reps
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-[#ff6b00]" />
                                {exercise.rest} descanso
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Desaquecimento */}
                    <div>
                      <h5 className="text-sm font-bold text-[#ff6b00] mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        DESAQUECIMENTO (5 min)
                      </h5>
                      <ul className="space-y-2">
                        {workout.cooldown.map((item, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-[#ff6b00] mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progression Guide */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#ff6b00]" />
            Guia de Progressão
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {progressionGuide.map((guide, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-[#ff6b00]/20"
              >
                <h4 className="text-[#ff6b00] font-bold mb-2">{guide.week}</h4>
                <p className="text-gray-300 text-sm">{guide.instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stretching Routine */}
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#ff6b00]" />
            Rotina de Alongamento Pós-Treino
          </h3>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-[#ff6b00]/20">
            <p className="text-gray-400 text-sm mb-4">
              Execute esta rotina após cada treino para auxiliar na recuperação muscular e prevenir lesões:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {stretchingRoutine.map((stretch, idx) => (
                <div
                  key={idx}
                  className="bg-[#0a0a0a] rounded-xl p-4 border border-[#ff6b00]/10 flex items-start gap-3"
                >
                  <span className="text-[#ff6b00] font-bold text-sm">{idx + 1}</span>
                  <p className="text-gray-300 text-sm">{stretch}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

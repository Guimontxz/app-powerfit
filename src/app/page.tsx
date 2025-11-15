"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Flame, Dumbbell, TrendingUp, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const router = useRouter()

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
                <p className="text-xs text-gray-400">Seu Personal Trainer Digital</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white hover:text-[#ff6b00] transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 text-sm font-bold bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] text-white rounded-xl hover:shadow-lg hover:shadow-[#ff6b00]/20 transition-all"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#ff6b00]/10 text-[#ff6b00] px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Flame className="w-4 h-4" />
            <span>Plano Personalizado de Treino</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Maximize sua Força em{" "}
            <span className="text-[#ff6b00]">30 Minutos</span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Treinos profissionais de força e condicionamento físico desenvolvidos especialmente 
            para pessoas com rotinas ocupadas. Resultados reais em menos tempo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 text-lg font-bold bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] text-white rounded-xl hover:shadow-2xl hover:shadow-[#ff6b00]/30 transition-all flex items-center justify-center gap-2"
            >
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-lg font-bold bg-[#1a1a1a] text-white rounded-xl border border-[#ff6b00]/20 hover:border-[#ff6b00]/40 transition-all"
            >
              Já tenho conta
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-[#ff6b00]/20">
              <div className="text-3xl font-bold text-[#ff6b00] mb-2">3x</div>
              <div className="text-sm text-gray-400">Treinos/Semana</div>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-[#ff6b00]/20">
              <div className="text-3xl font-bold text-[#ff6b00] mb-2">30min</div>
              <div className="text-sm text-gray-400">Por Sessão</div>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-[#ff6b00]/20">
              <div className="text-3xl font-bold text-[#ff6b00] mb-2">8</div>
              <div className="text-sm text-gray-400">Semanas</div>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-[#ff6b00]/20">
              <div className="text-3xl font-bold text-[#ff6b00] mb-2">100%</div>
              <div className="text-sm text-gray-400">Resultados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 border-t border-[#ff6b00]/20">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Por que escolher o <span className="text-[#ff6b00]">PowerFit</span>?
          </h3>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Um sistema completo de treinamento desenvolvido por especialistas para maximizar seus resultados
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-8 rounded-2xl border border-[#ff6b00]/20 hover:border-[#ff6b00]/40 transition-all">
              <div className="bg-[#ff6b00]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Dumbbell className="w-7 h-7 text-[#ff6b00]" />
              </div>
              <h4 className="text-xl font-bold mb-3">Treinos Profissionais</h4>
              <p className="text-gray-400 leading-relaxed">
                Planos desenvolvidos por personal trainers especializados em treinamento de força, 
                combinando exercícios de força com cardio para resultados máximos.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-8 rounded-2xl border border-[#ff6b00]/20 hover:border-[#ff6b00]/40 transition-all">
              <div className="bg-[#ff6b00]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-[#ff6b00]" />
              </div>
              <h4 className="text-xl font-bold mb-3">Progressão Inteligente</h4>
              <p className="text-gray-400 leading-relaxed">
                Sistema de progressão estruturado em 8 semanas com orientações claras de quando e 
                como aumentar cargas, repetições e intensidade.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-8 rounded-2xl border border-[#ff6b00]/20 hover:border-[#ff6b00]/40 transition-all">
              <div className="bg-[#ff6b00]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#ff6b00]" />
              </div>
              <h4 className="text-xl font-bold mb-3">Acompanhamento Total</h4>
              <p className="text-gray-400 leading-relaxed">
                Registre seus treinos, acompanhe seu progresso e veja sua evolução ao longo do tempo 
                com estatísticas detalhadas e histórico completo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl border border-[#ff6b00]/20 p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar seu corpo?
          </h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Comece agora mesmo e tenha acesso ao plano completo de treino, 
            acompanhamento de progresso e muito mais.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] text-white rounded-xl hover:shadow-2xl hover:shadow-[#ff6b00]/30 transition-all"
          >
            Começar Gratuitamente
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-[#ff6b00]/20">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-6 h-6 text-[#ff6b00]" />
            <span className="text-xl font-bold">PowerFit</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Seu personal trainer especializado em treinamento de força para rotinas ocupadas
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>© 2024 PowerFit</span>
            <span>•</span>
            <span>Desenvolvido com tecnologia de ponta</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

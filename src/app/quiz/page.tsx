'use client'

import { useRouter } from 'next/navigation'
import { Wallet, ArrowRight, CheckCircle } from 'lucide-react'

export default function QuizPage() {
  const router = useRouter()

  const handleRedirect = () => {
    window.location.href = 'https://pag.ae/81ovHmF7R'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C2A44] via-[#243552] to-[#1C2A44] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Card Principal */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] flex items-center justify-center shadow-lg">
              <Wallet className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bem-vindo ao <span className="text-[#4CAF84]">FinWise IA</span>!
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Para acessar todos os recursos da plataforma, você precisa de uma assinatura ativa.
          </p>

          {/* Benefícios */}
          <div className="space-y-4 mb-10 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#4CAF84] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Controle Financeiro Completo</h3>
                <p className="text-gray-400 text-sm">Gerencie receitas, despesas e metas em um só lugar</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#4CAF84] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Análises Inteligentes</h3>
                <p className="text-gray-400 text-sm">Insights automáticos sobre seus gastos e economia</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#4CAF84] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Gamificação e Conquistas</h3>
                <p className="text-gray-400 text-sm">Torne suas finanças mais divertidas e motivadoras</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#4CAF84] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Comunidade Exclusiva</h3>
                <p className="text-gray-400 text-sm">Compartilhe experiências e aprenda com outros usuários</p>
              </div>
            </div>
          </div>

          {/* Botão de Redirecionamento */}
          <button
            onClick={handleRedirect}
            className="w-full bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#4CAF84]/20 transition-all duration-300 flex items-center justify-center gap-3"
          >
            Assinar Agora
            <ArrowRight className="w-6 h-6" />
          </button>

          <p className="text-gray-400 text-sm mt-6">
            Clique no botão acima para realizar sua assinatura
          </p>
        </div>

        {/* Informação Adicional */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Já é assinante?{' '}
            <button
              onClick={() => router.push('/')}
              className="text-[#4CAF84] hover:text-[#3d8a6a] font-medium transition-colors"
            >
              Faça login aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

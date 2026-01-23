'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Sparkles, TrendingUp, Shield, ArrowRight } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/pagbank'
import { authService } from '@/lib/auth'

export default function AssinaturaPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Buscar dados reais do usuário
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)
  }, [router])

  const handleSubscribe = () => {
    // Redirecionar diretamente para o link de pagamento do PagBank
    window.location.href = 'https://pag.ae/81ovHmF7R'
  }

  // Loading state enquanto busca usuário
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C2A44] via-[#243552] to-[#1C2A44] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF84]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C2A44] via-[#243552] to-[#1C2A44]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#1C2A44]/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Voltar
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#4CAF84]/10 border border-[#4CAF84]/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#4CAF84]" />
            <span className="text-sm text-[#4CAF84] font-medium">Escolha seu plano ideal</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Planos de Assinatura
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta às suas necessidades e comece a controlar suas finanças com inteligência
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Plano Mensal */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-[#4CAF84]/50 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {SUBSCRIPTION_PLANS.monthly.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {SUBSCRIPTION_PLANS.monthly.description}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">
                  R$ {SUBSCRIPTION_PLANS.monthly.price.toFixed(2)}
                </span>
                <span className="text-gray-400">/mês</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {SUBSCRIPTION_PLANS.monthly.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#4CAF84] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscribe}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              Assinar agora
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Plano Semestral - DESTAQUE */}
          <div className="bg-gradient-to-br from-[#4CAF84]/20 to-[#3d8a6a]/20 backdrop-blur-md border-2 border-[#4CAF84] rounded-3xl p-8 relative transform md:scale-105 shadow-2xl shadow-[#4CAF84]/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white px-4 py-1 rounded-full text-sm font-semibold">
              Mais Popular
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {SUBSCRIPTION_PLANS.semiannual.name}
              </h3>
              <p className="text-gray-300 text-sm">
                {SUBSCRIPTION_PLANS.semiannual.description}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-white">
                  R$ {SUBSCRIPTION_PLANS.semiannual.price.toFixed(2)}
                </span>
                <span className="text-gray-300">/6 meses</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through text-sm">
                  R$ {SUBSCRIPTION_PLANS.semiannual.originalPrice?.toFixed(2)}
                </span>
                <span className="bg-[#4CAF84] text-white text-xs font-bold px-2 py-1 rounded-full">
                  {SUBSCRIPTION_PLANS.semiannual.discount}% OFF
                </span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {SUBSCRIPTION_PLANS.semiannual.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#4CAF84] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscribe}
              className="w-full bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#4CAF84]/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Assinar agora
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Plano Anual */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-[#4CAF84]/50 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {SUBSCRIPTION_PLANS.annual.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {SUBSCRIPTION_PLANS.annual.description}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-white">
                  R$ {SUBSCRIPTION_PLANS.annual.price.toFixed(2)}
                </span>
                <span className="text-gray-400">/ano</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through text-sm">
                  R$ {SUBSCRIPTION_PLANS.annual.originalPrice?.toFixed(2)}
                </span>
                <span className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white text-xs font-bold px-2 py-1 rounded-full">
                  {SUBSCRIPTION_PLANS.annual.discount}% OFF
                </span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {SUBSCRIPTION_PLANS.annual.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#4CAF84] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscribe}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              Assinar agora
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#4CAF84]/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#4CAF84]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">100% Seguro</h3>
            <p className="text-gray-400 text-sm">
              Pagamentos processados com segurança pelo PagBank
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#4CAF84]/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-[#4CAF84]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Cancele quando quiser</h3>
            <p className="text-gray-400 text-sm">
              Sem multas ou taxas de cancelamento
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#4CAF84]/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#4CAF84]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Suporte Premium</h3>
            <p className="text-gray-400 text-sm">
              Atendimento prioritário para assinantes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

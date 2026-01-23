'use client'

import { Check } from 'lucide-react'
import { Wallet } from 'lucide-react'

export default function PlansPage() {
  const plans = [
    {
      name: 'Mensal',
      price: 'R$ 29,90',
      period: '/mês',
      description: 'Ideal para começar',
      features: [
        'Acesso completo à plataforma',
        'Análise inteligente de gastos',
        'Relatórios detalhados',
        'Suporte prioritário',
        'Atualizações automáticas'
      ],
      link: 'https://go.perfectpay.com.br/PPU38CQ697G',
      popular: false
    },
    {
      name: 'Semestral',
      price: 'R$ 149,90',
      period: '/6 meses',
      description: 'Melhor custo-benefício',
      features: [
        'Acesso completo à plataforma',
        'Análise inteligente de gastos',
        'Relatórios detalhados',
        'Suporte prioritário',
        'Atualizações automáticas',
        'Economia de 16%'
      ],
      link: 'https://go.perfectpay.com.br/PPU38CQ698L',
      popular: true
    },
    {
      name: 'Anual',
      price: 'R$ 269,90',
      period: '/ano',
      description: 'Máxima economia',
      features: [
        'Acesso completo à plataforma',
        'Análise inteligente de gastos',
        'Relatórios detalhados',
        'Suporte prioritário',
        'Atualizações automáticas',
        'Economia de 25%',
        'Bônus exclusivos'
      ],
      link: 'https://go.perfectpay.com.br/PPU38CQ69A0',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C2A44] via-[#243552] to-[#1C2A44]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#1C2A44]/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FinWise IA</span>
          </div>
        </div>
      </header>

      {/* Plans Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Escolha seu plano
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Selecione o plano ideal para começar a transformar suas finanças com inteligência artificial
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white/5 backdrop-blur-md border rounded-3xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular
                  ? 'border-[#4CAF84] shadow-lg shadow-[#4CAF84]/20'
                  : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#4CAF84]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#4CAF84]" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3 rounded-xl font-semibold text-center transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white hover:shadow-lg hover:shadow-[#4CAF84]/30'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                Assinar agora
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Todos os planos incluem 7 dias de garantia. Cancele quando quiser.
          </p>
        </div>
      </div>
    </div>
  )
}

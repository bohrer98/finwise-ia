'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Calendar, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'

interface SubscriptionData {
  id: string
  status: string
  isActive: boolean
  reason: string
  amount: number
  frequency: number
  createdAt: string
  lastModified: string
}

export default function GerenciarAssinaturaPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  // Simular dados do usuário (em produção, buscar do contexto/sessão)
  const userId = 'user-123'
  const subscriptionId = 'subscription-id-123' // Em produção, buscar do banco

  useEffect(() => {
    loadSubscription()
  }, [])

  const loadSubscription = async () => {
    try {
      const response = await fetch(
        `/api/subscription/status?subscriptionId=${subscriptionId}&userId=${userId}`
      )
      const data = await response.json()

      if (response.ok) {
        setSubscription(data.subscription)
      } else {
        setError(data.error || 'Erro ao carregar assinatura')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar assinatura')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) {
      return
    }

    setCancelling(true)
    setError('')

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
          userId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Assinatura cancelada com sucesso!')
        loadSubscription()
      } else {
        setError(data.error || 'Erro ao cancelar assinatura')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao cancelar assinatura')
    } finally {
      setCancelling(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      authorized: {
        label: 'Ativa',
        icon: CheckCircle,
        className: 'bg-green-500/10 text-green-400 border-green-500/20',
      },
      pending: {
        label: 'Pendente',
        icon: AlertCircle,
        className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      },
      paused: {
        label: 'Pausada',
        icon: AlertCircle,
        className: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      },
      cancelled: {
        label: 'Cancelada',
        icon: XCircle,
        className: 'bg-red-500/10 text-red-400 border-red-500/20',
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.className}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C2A44] via-[#243552] to-[#1C2A44] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4CAF84] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C2A44] via-[#243552] to-[#1C2A44]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#1C2A44]/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Voltar ao Dashboard
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Gerenciar Assinatura</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {subscription ? (
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Status da Assinatura</h2>
                  {getStatusBadge(subscription.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">Plano</span>
                    </div>
                    <p className="text-white font-medium">{subscription.reason}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Valor</span>
                    </div>
                    <p className="text-white font-medium">
                      R$ {subscription.amount.toFixed(2)} / {subscription.frequency} {subscription.frequency > 1 ? 'meses' : 'mês'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Data de Início</span>
                    </div>
                    <p className="text-white font-medium">
                      {new Date(subscription.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Última Atualização</span>
                    </div>
                    <p className="text-white font-medium">
                      {new Date(subscription.lastModified).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {subscription.isActive && (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Ações</h2>
                  
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelling ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        Cancelar Assinatura
                      </>
                    )}
                  </button>

                  <p className="text-gray-400 text-sm text-center mt-4">
                    Ao cancelar, você terá acesso até o fim do período já pago
                  </p>
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">Informações Importantes</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Pagamentos são processados automaticamente pelo Mercado Pago</li>
                      <li>• Você pode cancelar a qualquer momento sem multas</li>
                      <li>• Após o cancelamento, o acesso permanece até o fim do período pago</li>
                      <li>• Para alterar o plano, cancele e assine novamente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Nenhuma assinatura ativa</h2>
              <p className="text-gray-400 mb-6">
                Você ainda não possui uma assinatura. Escolha um plano para começar!
              </p>
              <button
                onClick={() => router.push('/assinatura')}
                className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#4CAF84]/20 transition-all duration-300"
              >
                Ver Planos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoService, type WebhookNotification } from '@/lib/mercadopago'
import { subscriptionService } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body: WebhookNotification = await request.json()

    console.log('Webhook recebido:', body)

    // Verificar tipo de notificação
    if (body.type !== 'subscription_preapproval') {
      return NextResponse.json({ received: true })
    }

    const { action, data } = body

    // Buscar detalhes da assinatura
    const subscription = await mercadoPagoService.getPreapproval(data.id)

    // Processar ações
    switch (action) {
      case 'created':
        // Assinatura criada (ainda pendente de pagamento)
        console.log('Assinatura criada:', subscription.id)
        // Status já foi salvo como 'pending' na criação
        break

      case 'updated':
        // Assinatura atualizada
        console.log('Assinatura atualizada:', subscription.id, subscription.status)
        
        if (subscription.status === 'authorized') {
          // Pagamento aprovado - liberar acesso
          console.log('✅ Assinatura aprovada - liberar acesso')
          await subscriptionService.updateStatus(subscription.id, 'active')
        } else if (subscription.status === 'paused') {
          // Assinatura pausada
          console.log('⏸️ Assinatura pausada')
          await subscriptionService.updateStatus(subscription.id, 'paused')
        } else if (subscription.status === 'cancelled') {
          // Assinatura cancelada
          console.log('❌ Assinatura cancelada')
          await subscriptionService.updateStatus(subscription.id, 'cancelled')
        }
        break

      case 'payment_created':
        // Novo pagamento recorrente criado
        console.log('💰 Pagamento recorrente criado')
        // Aqui você pode registrar o pagamento em uma tabela separada se necessário
        break

      case 'payment_updated':
        // Pagamento atualizado
        console.log('💰 Pagamento atualizado')
        break

      default:
        console.log('Ação não tratada:', action)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Desabilitar verificação de body para webhooks
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoService } from '@/lib/mercadopago'
import { subscriptionService } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscriptionId, userId } = body

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: 'Dados incompletos. Forneça subscriptionId e userId.' },
        { status: 400 }
      )
    }

    // Verificar se a assinatura pertence ao usuário
    const subscription = await subscriptionService.getBySubscriptionId(subscriptionId)
    
    if (!subscription || subscription.user_id !== userId) {
      return NextResponse.json(
        { error: 'Assinatura não encontrada' },
        { status: 404 }
      )
    }

    // Cancelar assinatura no Mercado Pago
    const cancelledSubscription = await mercadoPagoService.cancelPreapproval(subscriptionId)

    // Atualizar banco de dados
    await subscriptionService.updateStatus(subscriptionId, 'cancelled')

    return NextResponse.json({
      success: true,
      message: 'Assinatura cancelada com sucesso',
      subscription: {
        id: cancelledSubscription.id,
        status: cancelledSubscription.status,
      },
    })
  } catch (error: any) {
    console.error('Erro ao cancelar assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao cancelar assinatura' },
      { status: 500 }
    )
  }
}

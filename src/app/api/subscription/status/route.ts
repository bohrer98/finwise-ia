import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoService } from '@/lib/mercadopago'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get('subscriptionId')
    const userId = searchParams.get('userId')

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: 'Parâmetros incompletos' },
        { status: 400 }
      )
    }

    // Buscar assinatura no Mercado Pago
    const subscription = await mercadoPagoService.getPreapproval(subscriptionId)

    // Verificar se assinatura está ativa
    const isActive = subscription.status === 'authorized'

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        isActive,
        reason: subscription.reason,
        amount: subscription.auto_recurring.transaction_amount,
        frequency: subscription.auto_recurring.frequency,
        createdAt: subscription.date_created,
        lastModified: subscription.last_modified,
      },
    })
  } catch (error: any) {
    console.error('Erro ao buscar status da assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar assinatura' },
      { status: 500 }
    )
  }
}

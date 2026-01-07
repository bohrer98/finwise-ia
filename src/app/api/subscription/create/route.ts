import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoService, SUBSCRIPTION_PLANS, type SubscriptionPlanId } from '@/lib/mercadopago'
import { subscriptionService } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, userEmail, userId } = body

    if (!planId || !userEmail || !userId) {
      return NextResponse.json(
        { error: 'Dados incompletos. Forneça planId, userEmail e userId.' },
        { status: 400 }
      )
    }

    const plan = SUBSCRIPTION_PLANS[planId as SubscriptionPlanId]
    
    if (!plan) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      )
    }

    // Criar preapproval (assinatura recorrente)
    const preapprovalData = {
      reason: `${plan.name} - FinWise IA`,
      auto_recurring: {
        frequency: plan.intervalCount,
        frequency_type: 'months' as const,
        transaction_amount: plan.price,
        currency_id: 'BRL' as const,
      },
      back_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?subscription=success`,
      payer_email: userEmail,
    }

    const preapproval = await mercadoPagoService.createPreapproval(preapprovalData)

    // Salvar no banco de dados
    await subscriptionService.create({
      userId,
      subscriptionId: preapproval.id,
      planId,
      amount: plan.price
    })

    return NextResponse.json({
      success: true,
      subscriptionId: preapproval.id,
      initPoint: preapproval.sandbox_init_point || preapproval.init_point,
      status: preapproval.status,
    })
  } catch (error: any) {
    console.error('Erro ao criar assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar assinatura' },
      { status: 500 }
    )
  }
}

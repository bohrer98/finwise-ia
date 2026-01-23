import { NextRequest, NextResponse } from 'next/server'
import { pagBankService, type PagBankWebhookNotification } from '@/lib/pagbank'
import { subscriptionService } from '@/lib/supabase-admin'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticidade do webhook (PagBank envia token no header)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.PAGBANK_TOKEN

    if (!authHeader || !authHeader.includes(expectedToken || '')) {
      console.error('Webhook não autorizado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const notification: PagBankWebhookNotification = await request.json()

    console.log('Webhook PagBank recebido:', JSON.stringify(notification, null, 2))

    // Extrair informações do webhook
    const orderId = notification.id
    const referenceId = notification.reference_id
    const charges = notification.charges || []

    // Verificar se há cobranças
    if (charges.length === 0) {
      console.log('Nenhuma cobrança encontrada no webhook')
      return NextResponse.json({ received: true })
    }

    // Pegar a primeira cobrança (normalmente só há uma)
    const charge = charges[0]
    const chargeStatus = charge.status
    const amount = charge.amount?.value || 0

    console.log(`Status da cobrança: ${chargeStatus}`)

    // Mapear status do PagBank para status interno
    let subscriptionStatus: 'active' | 'pending' | 'cancelled' | 'expired' = 'pending'
    
    switch (chargeStatus) {
      case 'PAID':
      case 'AUTHORIZED':
        subscriptionStatus = 'active'
        break
      case 'DECLINED':
      case 'CANCELED':
        subscriptionStatus = 'cancelled'
        break
      case 'IN_ANALYSIS':
        subscriptionStatus = 'pending'
        break
      default:
        subscriptionStatus = 'pending'
    }

    // Buscar assinatura pelo reference_id
    let subscription = await subscriptionService.findByReferenceId(referenceId)

    // Se não encontrou assinatura, tentar extrair email do reference_id e buscar usuário
    if (!subscription && subscriptionStatus === 'active') {
      console.log('Assinatura não encontrada, tentando criar automaticamente...')
      
      // Extrair email do reference_id (formato esperado: email-planId-timestamp)
      const emailMatch = referenceId.match(/^(.+?)-(monthly|semiannual|annual)-/)
      
      if (emailMatch) {
        const email = emailMatch[1]
        const planId = emailMatch[2]
        
        // Buscar usuário por email
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()
        
        if (user && !userError) {
          console.log(`Usuário encontrado: ${user.email}`)
          
          // Criar assinatura automaticamente
          try {
            subscription = await subscriptionService.create({
              userId: user.id,
              subscriptionId: orderId,
              referenceId: referenceId,
              planId: planId,
              amount: amount / 100 // Converter centavos para reais
            })
            
            console.log('✅ Assinatura criada automaticamente')
          } catch (createError) {
            console.error('Erro ao criar assinatura:', createError)
          }
        } else {
          console.error('Usuário não encontrado para email:', email)
        }
      }
    }

    if (!subscription) {
      console.error(`Assinatura não encontrada e não foi possível criar: ${referenceId}`)
      return NextResponse.json(
        { error: 'Assinatura não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar status da assinatura
    if (subscriptionStatus === 'active') {
      // Calcular data de expiração baseado no plano
      const expirationDate = new Date()
      
      // Extrair informações do plano do reference_id
      const planMatch = referenceId.match(/-(monthly|semiannual|annual)-/)
      const planId = planMatch ? planMatch[1] : 'monthly'
      
      switch (planId) {
        case 'monthly':
          expirationDate.setMonth(expirationDate.getMonth() + 1)
          break
        case 'semiannual':
          expirationDate.setMonth(expirationDate.getMonth() + 6)
          break
        case 'annual':
          expirationDate.setFullYear(expirationDate.getFullYear() + 1)
          break
      }

      await subscriptionService.updateStatus(
        subscription.user_id,
        subscriptionStatus,
        expirationDate.toISOString()
      )

      console.log(`✅ Assinatura ativada para usuário ${subscription.user_id}`)
    } else {
      await subscriptionService.updateStatus(
        subscription.user_id,
        subscriptionStatus
      )

      console.log(`⚠️ Status da assinatura atualizado para: ${subscriptionStatus}`)
    }

    return NextResponse.json({ 
      received: true,
      status: subscriptionStatus,
      orderId,
      referenceId,
    })
  } catch (error: any) {
    console.error('Erro ao processar webhook PagBank:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

// Método GET para verificação de saúde do webhook
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Webhook PagBank está funcionando',
    timestamp: new Date().toISOString(),
  })
}

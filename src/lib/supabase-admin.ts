import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseAdminInstance: SupabaseClient | null = null

// Função para obter cliente admin com service role key
export function getSupabaseAdmin() {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variáveis de ambiente do Supabase não configuradas')
  }

  supabaseAdminInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return supabaseAdminInstance
}

// Tipos para a tabela subscriptions
export interface Subscription {
  id: string
  user_id: string
  subscription_id: string
  plan_id: 'monthly' | 'semiannual' | 'annual'
  status: 'pending' | 'active' | 'paused' | 'cancelled'
  amount: number
  created_at: string
  activated_at?: string
  cancelled_at?: string
  updated_at: string
}

// Funções helper para gerenciar assinaturas
export const subscriptionService = {
  // Criar nova assinatura
  async create(data: {
    userId: string
    subscriptionId: string
    planId: string
    amount: number
  }) {
    const supabaseAdmin = getSupabaseAdmin()
    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: data.userId,
        subscription_id: data.subscriptionId,
        plan_id: data.planId,
        amount: data.amount,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return subscription
  },

  // Atualizar status da assinatura
  async updateStatus(
    subscriptionId: string,
    status: 'pending' | 'active' | 'paused' | 'cancelled'
  ) {
    const supabaseAdmin = getSupabaseAdmin()
    const updateData: any = { status, updated_at: new Date().toISOString() }

    if (status === 'active') {
      updateData.activated_at = new Date().toISOString()
    } else if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update(updateData)
      .eq('subscription_id', subscriptionId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Buscar assinatura por ID do Mercado Pago
  async getBySubscriptionId(subscriptionId: string) {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .single()

    if (error) throw error
    return data as Subscription
  },

  // Buscar assinatura ativa do usuário
  async getActiveByUserId(userId: string) {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as Subscription | null
  },

  // Verificar se usuário tem assinatura ativa
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getActiveByUserId(userId)
    return subscription !== null
  }
}

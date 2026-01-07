// Mercado Pago Configuration and Types

export const MERCADO_PAGO_CONFIG = {
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '',
  baseUrl: 'https://api.mercadopago.com',
}

export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Plano Mensal',
    price: 19.90,
    interval: 'monthly',
    intervalCount: 1,
    description: 'Acesso completo ao FinWise IA',
    features: [
      'Controle ilimitado de receitas e despesas',
      'Análise inteligente com IA',
      'Metas financeiras personalizadas',
      'Relatórios detalhados',
      'Suporte prioritário',
    ],
  },
  semiannual: {
    id: 'semiannual',
    name: 'Plano Semestral',
    price: 99.90, // 6 meses = 119.40, com desconto = 99.90 (16% off)
    originalPrice: 119.40,
    interval: 'monthly',
    intervalCount: 6,
    description: 'Economize 16% no plano semestral',
    discount: 16,
    features: [
      'Todos os recursos do plano mensal',
      '16% de desconto',
      'Pagamento único semestral',
      'Sem surpresas na fatura',
    ],
  },
  annual: {
    id: 'annual',
    name: 'Plano Anual',
    price: 179.90, // 12 meses = 238.80, com desconto = 179.90 (25% off)
    originalPrice: 238.80,
    interval: 'monthly',
    intervalCount: 12,
    description: 'Melhor custo-benefício - economize 25%',
    discount: 25,
    features: [
      'Todos os recursos do plano mensal',
      '25% de desconto',
      'Pagamento único anual',
      'Máxima economia',
    ],
  },
}

export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS

export interface PreapprovalRequest {
  reason: string
  auto_recurring: {
    frequency: number
    frequency_type: 'months'
    transaction_amount: number
    currency_id: 'BRL'
  }
  back_url: string
  payer_email: string
  status?: 'pending' | 'authorized' | 'paused' | 'cancelled'
}

export interface PreapprovalResponse {
  id: string
  payer_id: number
  payer_email: string
  back_url: string
  init_point: string
  sandbox_init_point: string
  status: string
  reason: string
  auto_recurring: {
    frequency: number
    frequency_type: string
    transaction_amount: number
    currency_id: string
  }
  date_created: string
  last_modified: string
}

export interface WebhookNotification {
  id: string
  live_mode: boolean
  type: string
  date_created: string
  application_id: string
  user_id: string
  version: string
  api_version: string
  action: string
  data: {
    id: string
  }
}

export class MercadoPagoService {
  private accessToken: string
  private baseUrl: string

  constructor() {
    this.accessToken = MERCADO_PAGO_CONFIG.accessToken
    this.baseUrl = MERCADO_PAGO_CONFIG.baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  async createPreapproval(data: PreapprovalRequest): Promise<PreapprovalResponse> {
    return this.request<PreapprovalResponse>('/preapproval', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getPreapproval(id: string): Promise<PreapprovalResponse> {
    return this.request<PreapprovalResponse>(`/preapproval/${id}`, {
      method: 'GET',
    })
  }

  async cancelPreapproval(id: string): Promise<PreapprovalResponse> {
    return this.request<PreapprovalResponse>(`/preapproval/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'cancelled' }),
    })
  }

  async pausePreapproval(id: string): Promise<PreapprovalResponse> {
    return this.request<PreapprovalResponse>(`/preapproval/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'paused' }),
    })
  }

  async resumePreapproval(id: string): Promise<PreapprovalResponse> {
    return this.request<PreapprovalResponse>(`/preapproval/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'authorized' }),
    })
  }
}

export const mercadoPagoService = new MercadoPagoService()

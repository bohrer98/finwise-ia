// Constantes dos planos de assinatura
export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Plano Mensal',
    description: 'Ideal para começar',
    price: 29.90,
    duration: 30,
    features: [
      'Controle completo de receitas e despesas',
      'Relatórios financeiros detalhados',
      'Categorização automática',
      'Suporte por email',
      'Acesso mobile e desktop',
    ],
  },
  semiannual: {
    id: 'semiannual',
    name: 'Plano Semestral',
    description: 'Melhor custo-benefício',
    price: 149.90,
    originalPrice: 179.40,
    discount: 16,
    duration: 180,
    features: [
      'Tudo do plano mensal',
      'Análise de investimentos',
      'Metas financeiras personalizadas',
      'Alertas inteligentes',
      'Suporte prioritário',
      'Relatórios avançados',
    ],
  },
  annual: {
    id: 'annual',
    name: 'Plano Anual',
    description: 'Máxima economia',
    price: 269.90,
    originalPrice: 358.80,
    discount: 25,
    duration: 365,
    features: [
      'Tudo do plano semestral',
      'Consultoria financeira mensal',
      'Planejamento tributário',
      'Integração com bancos',
      'Suporte VIP 24/7',
      'Backup automático na nuvem',
    ],
  },
} as const

export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS

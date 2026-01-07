import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ ERRO CRÍTICO: Variáveis de ambiente do Supabase não configuradas!')
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Criar cliente com configuração otimizada
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
})

// Função para testar conexão
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) {
      console.error('❌ Erro ao conectar com Supabase:', error.message)
      return false
    }
    console.log('✅ Conexão com Supabase estabelecida com sucesso')
    return true
  } catch (err) {
    console.error('❌ Erro crítico ao testar conexão:', err)
    return false
  }
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'income' | 'expense_fixed' | 'expense_variable'
          category: string
          amount: number
          description: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'income' | 'expense_fixed' | 'expense_variable'
          category: string
          amount: number
          description: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'income' | 'expense_fixed' | 'expense_variable'
          category?: string
          amount?: number
          description?: string
          date?: string
          created_at?: string
        }
      }
      future_transactions: {
        Row: {
          id: string
          user_id: string
          type: 'receivable' | 'payable'
          category: string
          amount: number
          description: string
          due_date: string
          status: 'pending' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'receivable' | 'payable'
          category: string
          amount: number
          description: string
          due_date: string
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'receivable' | 'payable'
          category?: string
          amount?: number
          description?: string
          due_date?: string
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          target_amount: number
          current_amount: number
          deadline: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          target_amount: number
          current_amount?: number
          deadline: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          target_amount?: number
          current_amount?: number
          deadline?: string
          created_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          user_name: string
          content: string
          likes: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          content: string
          likes?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          content?: string
          likes?: number
          created_at?: string
        }
      }
    }
  }
}

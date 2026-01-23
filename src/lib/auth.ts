import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
}

// Função helper para gerenciar cookies
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

// Verificar se usuário tem assinatura ativa
export const checkSubscription = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Erro ao verificar assinatura:', error)
      return false
    }

    if (!data) {
      return false
    }

    // Verificar se está expirada
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at)
      const now = new Date()
      
      if (now > expiresAt) {
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return false
  }
}

// Simular autenticação local (sem Supabase Auth)
export const authService = {
  async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
    try {
      // Verificar se usuário já existe
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      if (checkError) {
        console.error('Erro ao verificar usuário existente:', checkError)
        return { 
          user: null, 
          error: `Erro de conexão: ${checkError.message}. Verifique se suas credenciais do Supabase estão configuradas corretamente.` 
        }
      }

      if (existingUser) {
        return { user: null, error: 'Email já cadastrado' }
      }

      // Criar novo usuário
      const { data, error } = await supabase
        .from('users')
        .insert([{ email, name }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar usuário:', error)
        return { 
          user: null, 
          error: `Erro ao criar conta: ${error.message}. Verifique se a tabela 'users' existe no Supabase e se as credenciais estão corretas.` 
        }
      }

      // Salvar no localStorage e cookie
      if (typeof window !== 'undefined') {
        localStorage.setItem('finwise_user', JSON.stringify(data))
        setCookie('finwise_user', JSON.stringify(data))
      }

      return { user: data, error: null }
    } catch (error: any) {
      console.error('Erro no signUp:', error)
      return { 
        user: null, 
        error: `Erro ao criar conta: ${error.message || 'Verifique sua conexão com o banco de dados e se as credenciais do Supabase estão configuradas.'}` 
      }
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      // Buscar usuário por email
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      if (error) {
        console.error('Erro ao buscar usuário:', error)
        return { 
          user: null, 
          error: `Erro de conexão: ${error.message}. Verifique se suas credenciais do Supabase estão configuradas corretamente.` 
        }
      }

      if (!data) {
        return { user: null, error: 'Email ou senha incorretos' }
      }

      // Salvar no localStorage e cookie
      if (typeof window !== 'undefined') {
        localStorage.setItem('finwise_user', JSON.stringify(data))
        setCookie('finwise_user', JSON.stringify(data))
      }

      return { user: data, error: null }
    } catch (error: any) {
      console.error('Erro no signIn:', error)
      return { 
        user: null, 
        error: `Erro ao fazer login: ${error.message || 'Verifique se as credenciais do Supabase estão configuradas.'}` 
      }
    }
  },

  async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // Buscar usuário por email
      const { data: users, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)

      if (checkError) {
        console.error('Erro ao buscar usuário:', checkError)
        return { 
          success: false, 
          error: `Erro de conexão: ${checkError.message}. Verifique se suas credenciais do Supabase estão configuradas.` 
        }
      }

      // Se o array está vazio, usuário não existe
      if (!users || users.length === 0) {
        return { 
          success: false, 
          error: 'Email não encontrado no sistema. Verifique se você já criou uma conta.' 
        }
      }

      // Usuário encontrado - simula envio de email
      console.log(`Email de recuperação enviado para: ${email}`)
      
      return { 
        success: true, 
        error: null 
      }
    } catch (error: any) {
      console.error('Erro no resetPassword:', error)
      return { 
        success: false, 
        error: `Erro ao enviar email de recuperação: ${error.message || 'Verifique se as credenciais do Supabase estão configuradas.'}` 
      }
    }
  },

  async signOut(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finwise_user')
      deleteCookie('finwise_user')
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem('finwise_user')
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }
}

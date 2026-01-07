import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
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

      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('finwise_user', JSON.stringify(data))
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

      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('finwise_user', JSON.stringify(data))
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

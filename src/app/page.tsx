'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet, TrendingUp, Shield, Users, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react'
import { authService } from '@/lib/auth'

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    // Verificar se usuário já está logado
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      router.push('/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { user, error } = await authService.signIn(formData.email, formData.password)
        if (error) {
          setError(error)
        } else if (user) {
          // Redireciona diretamente para o dashboard
          router.push('/dashboard')
        }
      } else {
        const { user, error } = await authService.signUp(formData.email, formData.password, formData.name)
        if (error) {
          setError(error)
        } else if (user) {
          // Redireciona diretamente para o dashboard
          router.push('/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setResetSuccess(false)

    try {
      const { success, error } = await authService.resetPassword(resetEmail)
      if (error) {
        setError(error)
      } else if (success) {
        setResetSuccess(true)
        setResetEmail('')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C2A44] via-[#243552] to-[#1C2A44]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#1C2A44]/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FinWise IA</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Controle suas finanças com
                <span className="text-[#4CAF84]"> inteligência</span>
              </h1>
              <p className="text-xl text-gray-300">
                Gerencie receitas, despesas e metas financeiras de forma simples, segura e inteligente.
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#4CAF84]/20 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#4CAF84]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Análise Inteligente</h3>
                <p className="text-sm text-gray-400">Insights automáticos sobre seus gastos</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#4CAF84]/20 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#4CAF84]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">100% Seguro</h3>
                <p className="text-sm text-gray-400">Seus dados protegidos com criptografia</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#4CAF84]/20 flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-[#4CAF84]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Controle Total</h3>
                <p className="text-sm text-gray-400">Visualize todas suas transações</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#4CAF84]/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#4CAF84]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Comunidade</h3>
                <p className="text-sm text-gray-400">Compartilhe dicas e experiências</p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
            {!showForgotPassword ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                  </h2>
                  <p className="text-gray-400">
                    {isLogin ? 'Entre para continuar gerenciando suas finanças' : 'Comece a controlar suas finanças hoje'}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome completo
                      </label>
                      <input
                        type="text"
                        required={!isLogin}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF84] focus:border-transparent transition-all"
                        placeholder="Seu nome"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF84] focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF84] focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true)
                          setError('')
                        }}
                        className="text-sm text-[#4CAF84] hover:text-[#3d8a6a] transition-colors"
                      >
                        Esqueceu sua senha?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#4CAF84]/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar conta')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setError('')
                    }}
                    className="text-[#4CAF84] hover:text-[#3d8a6a] transition-colors text-sm font-medium"
                  >
                    {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Recuperar senha
                  </h2>
                  <p className="text-gray-400">
                    Digite seu email cadastrado para receber instruções de recuperação
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {resetSuccess && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-green-400 text-sm">
                      Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.
                    </p>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email cadastrado
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF84] focus:border-transparent transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#4CAF84]/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Enviando...' : 'Enviar email de recuperação'}
                    <Mail className="w-5 h-5" />
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setShowForgotPassword(false)
                      setError('')
                      setResetSuccess(false)
                      setResetEmail('')
                    }}
                    className="text-[#4CAF84] hover:text-[#3d8a6a] transition-colors text-sm font-medium"
                  >
                    Voltar para o login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, TrendingUp, DollarSign, Calendar, Tag, PieChart, TrendingDown, Wallet, Target, Users, Settings, LogOut, Bell, Moon, Sun, Trophy, Clock, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { authService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/components/custom/theme-provider'

export default function DashboardPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    pendingReceivables: 0,
    pendingPayables: 0,
    expensesByCategory: [],
    recentTransactions: []
  })

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)
    loadDashboardData()
    processDueTransactions() // Processar transações vencidas ao carregar
  }, [router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const currentUser = authService.getCurrentUser()
      if (!currentUser) return

      // Buscar transações do mês atual
      const currentDate = new Date()
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0]
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]

      // Receitas do mês
      const { data: incomeData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('type', 'income')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      // Despesas do mês
      const { data: expenseData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('type', 'expense')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      // Transações futuras pendentes
      const { data: futureTransactions } = await supabase
        .from('future_transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('status', 'pending')

      // Calcular totais
      const totalIncome = incomeData?.reduce((sum, t) => sum + t.amount, 0) || 0
      const totalExpenses = expenseData?.reduce((sum, t) => sum + t.amount, 0) || 0
      const balance = totalIncome - totalExpenses

      // Calcular valores a receber e pagar
      const pendingReceivables = futureTransactions?.filter(t => t.type === 'receivable').reduce((sum, t) => sum + t.amount, 0) || 0
      const pendingPayables = futureTransactions?.filter(t => t.type === 'payable').reduce((sum, t) => sum + t.amount, 0) || 0

      // Agrupar despesas por categoria
      const expensesByCategory = expenseData?.reduce((acc, transaction) => {
        const category = transaction.category
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += transaction.amount
        return acc
      }, {} as Record<string, number>) || {}

      const expensesByCategoryArray = Object.entries(expensesByCategory).map(([category, amount]) => ({
        category,
        amount,
        color: getCategoryColor(category, 'expense')
      }))

      // Transações recentes (últimas 5)
      const allTransactions = [...(incomeData || []), ...(expenseData || [])]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

      setDashboardData({
        totalIncome,
        totalExpenses,
        balance,
        pendingReceivables,
        pendingPayables,
        expensesByCategory: expensesByCategoryArray,
        recentTransactions: allTransactions
      })
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const processDueTransactions = async () => {
    try {
      const currentUser = authService.getCurrentUser()
      if (!currentUser) return

      const today = new Date().toISOString().split('T')[0]

      // Buscar transações futuras vencidas hoje
      const { data: dueTransactions } = await supabase
        .from('future_transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('status', 'pending')
        .lte('due_date', today)

      if (dueTransactions && dueTransactions.length > 0) {
        // Mover para transactions
        const transactionsToInsert = dueTransactions.map(t => ({
          user_id: t.user_id,
          type: t.type === 'receivable' ? 'income' : 'expense',
          category: t.category,
          amount: t.amount,
          description: t.description,
          date: today
        }))

        const { error: insertError } = await supabase
          .from('transactions')
          .insert(transactionsToInsert)

        if (insertError) throw insertError

        // Atualizar status para completed
        const { error: updateError } = await supabase
          .from('future_transactions')
          .update({ status: 'completed' })
          .in('id', dueTransactions.map(t => t.id))

        if (updateError) throw updateError

        // Recarregar dados após processamento
        loadDashboardData()
      }
    } catch (error) {
      console.error('Erro ao processar transações vencidas:', error)
    }
  }

  const getCategoryColor = (category: string, type: 'income' | 'expense') => {
    const incomeColors = [
      '#4CAF84', // Verde principal
      '#66BB6A', // Verde claro
      '#81C784', // Verde mais claro
      '#A5D6A7', // Verde pastel
      '#C8E6C9', // Verde muito claro
      '#E8F5E8'  // Verde quase branco
    ]

    const expenseColors = [
      '#FF6B6B', // Vermelho coral
      '#FF8E8E', // Vermelho claro
      '#FFB3B3', // Vermelho pastel
      '#FFCCCC', // Vermelho muito claro
      '#FFE6E6', // Vermelho quase branco
      '#FF5252'  // Vermelho escuro
    ]

    const categories = type === 'income' ? [
      'Salário', 'Freelance', 'Investimentos', 'Vendas', 'Bônus', 'Outros'
    ] : [
      'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Outros'
    ]

    const index = categories.indexOf(category)
    const colors = type === 'income' ? incomeColors : expenseColors
    return colors[index % colors.length]
  }

  const handleLogout = async () => {
    await authService.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF84]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Menu Dropdown */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowMenu(false)}>
          <div className="absolute top-20 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 w-72 animate-in slide-in-from-top-5" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: PieChart, href: '/dashboard' },
                { id: 'receitas', label: 'Receitas', icon: TrendingUp, href: '/receitas' },
                { id: 'despesas', label: 'Despesas', icon: TrendingDown, href: '/despesas' },
                { id: 'gastos', label: 'Visualizar Gastos', icon: Wallet, href: '/gastos' },
                { id: 'metas', label: 'Metas', icon: Target, href: '/metas' },
                { id: 'comunidade', label: 'Comunidade', icon: Users, href: '/comunidade' },
                { id: 'gamificacao', label: 'Conquistas', icon: Trophy, href: '/gamificacao' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(item.href)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[#4CAF84]/10 hover:text-[#4CAF84] transition-all duration-300"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[#4CAF84]/10 hover:text-[#4CAF84] transition-all"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Configurações</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1C2A44] dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visão geral das suas finanças
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#4CAF84] rounded-full"></span>
            </button>
            <button onClick={() => setShowMenu(!showMenu)}>
              <Avatar className="w-10 h-10 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] cursor-pointer hover:scale-105 transition-transform">
                <AvatarFallback className="text-white font-semibold bg-[#1C2A44] dark:bg-[#4CAF84]">
                  {user?.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Receitas do Mês</p>
                  <p className="text-2xl font-bold text-[#4CAF84]">
                    R$ {dashboardData.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#4CAF84]/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#4CAF84]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Despesas do Mês</p>
                  <p className="text-2xl font-bold text-red-500">
                    R$ {dashboardData.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo do Mês</p>
                  <p className={`text-2xl font-bold ${dashboardData.balance >= 0 ? 'text-[#4CAF84]' : 'text-red-500'}`}>
                    R$ {dashboardData.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">A Receber</p>
                  <p className="text-2xl font-bold text-orange-500">
                    R$ {dashboardData.pendingReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Despesas por Categoria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1C2A44] dark:text-white">
                <PieChart className="w-5 h-5 text-[#4CAF84]" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.expensesByCategory.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.expensesByCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-[#1C2A44] dark:text-white font-medium">{item.category}</span>
                      </div>
                      <span className="text-[#1C2A44] dark:text-white font-semibold">
                        R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhuma despesa registrada este mês
                </p>
              )}
            </CardContent>
          </Card>

          {/* Transações Recentes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1C2A44] dark:text-white">
                <Clock className="w-5 h-5 text-[#4CAF84]" />
                Transações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-[#4CAF84]/10' : 'bg-red-500/10'
                        }`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-5 h-5 text-[#4CAF84]" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-[#1C2A44] dark:text-white font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-[#4CAF84]' : 'text-red-500'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhuma transação recente
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1C2A44] dark:text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => router.push('/receitas')}
                className="h-20 bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-2">
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">Nova Receita</span>
                </div>
              </Button>

              <Button
                onClick={() => router.push('/despesas')}
                className="h-20 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-2">
                  <TrendingDown className="w-6 h-6" />
                  <span className="text-sm">Nova Despesa</span>
                </div>
              </Button>

              <Button
                onClick={() => router.push('/metas')}
                className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-2">
                  <Target className="w-6 h-6" />
                  <span className="text-sm">Ver Metas</span>
                </div>
              </Button>

              <Button
                onClick={() => router.push('/gastos')}
                className="h-20 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-2">
                  <Wallet className="w-6 h-6" />
                  <span className="text-sm">Ver Gastos</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
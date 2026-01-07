'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, TrendingDown, DollarSign, Calendar, Tag, PieChart, Wallet, Target, Users, Settings, LogOut, Bell, Moon, Sun, Trophy, Clock, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { authService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/components/custom/theme-provider'

interface Transaction {
  id: string
  category: string
  amount: number
  description: string
  date: string
  type: string
}

export default function DespesasPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [expenseType, setExpenseType] = useState<'expense_fixed' | 'expense_variable'>('expense_fixed')
  const [isParceled, setIsParceled] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    parcelNumber: '1',
    parcelValue: ''
  })

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)
    loadTransactions(currentUser.id)
  }, [router])

  const loadTransactions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'expense')
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar transações:', error.message)
    }
  }

  // Calcular valor da parcela automaticamente
  useEffect(() => {
    if (isParceled && formData.amount && formData.parcelNumber) {
      const totalAmount = parseFloat(formData.amount)
      const parcelNumber = parseInt(formData.parcelNumber)
      if (parcelNumber > 0) {
        const parcelValue = totalAmount / parcelNumber
        setFormData(prev => ({ ...prev, parcelValue: parcelValue.toFixed(2) }))
      }
    }
  }, [formData.amount, formData.parcelNumber, isParceled])

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setFormData({
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date,
      parcelNumber: '1',
      parcelValue: ''
    })
    setIsParceled(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Despesa excluída com sucesso!')
      loadTransactions(user.id)
    } catch (error: any) {
      alert('Erro ao excluir despesa: ' + error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      selectedDate.setHours(0, 0, 0, 0)
      const isPastDate = selectedDate <= today

      const totalAmount = parseFloat(formData.amount)
      const parcelNumber = isParceled ? parseInt(formData.parcelNumber) : 1
      const parcelValue = isParceled ? parseFloat(formData.parcelValue) : totalAmount

      if (editingId) {
        // Atualizar transação existente
        const { error } = await supabase
          .from('transactions')
          .update({
            category: formData.category,
            amount: totalAmount,
            description: formData.description,
            date: formData.date
          })
          .eq('id', editingId)

        if (error) throw error
        alert('Despesa atualizada com sucesso!')
        setEditingId(null)
      } else {
        // Criar nova transação
        if (isPastDate && !isParceled) {
          // Data já passou e não é parcelado - salvar direto em transactions
          const { error } = await supabase
            .from('transactions')
            .insert([
              {
                user_id: user.id,
                type: 'expense',
                category: formData.category,
                amount: totalAmount,
                description: formData.description,
                date: formData.date
              }
            ])

          if (error) throw error
        } else {
          // Data futura ou parcelado - salvar em future_transactions
          const installments = []
          const startDate = new Date(formData.date)

          for (let i = 0; i < parcelNumber; i++) {
            const dueDate = new Date(startDate)
            dueDate.setMonth(startDate.getMonth() + i)
            dueDate.setHours(0, 0, 0, 0)
            
            const dueDateToday = new Date()
            dueDateToday.setHours(0, 0, 0, 0)
            
            // Se a parcela já venceu, salvar direto em transactions
            if (dueDate <= dueDateToday) {
              const { error } = await supabase
                .from('transactions')
                .insert([
                  {
                    user_id: user.id,
                    type: 'expense',
                    category: formData.category,
                    amount: parcelValue,
                    description: `${formData.description}${parcelNumber > 1 ? ` (${i + 1}/${parcelNumber})` : ''}`,
                    date: dueDate.toISOString().split('T')[0]
                  }
                ])
              
              if (error) throw error
            } else {
              // Parcela futura - salvar em future_transactions
              installments.push({
                user_id: user.id,
                type: 'payable',
                category: formData.category,
                amount: parcelValue,
                description: `${formData.description}${parcelNumber > 1 ? ` (${i + 1}/${parcelNumber})` : ''}`,
                due_date: dueDate.toISOString().split('T')[0],
                status: 'pending'
              })
            }
          }

          if (installments.length > 0) {
            const { error } = await supabase
              .from('future_transactions')
              .insert(installments)

            if (error) throw error
          }
        }
        alert('Despesa adicionada com sucesso!')
      }

      // Resetar formulário
      setFormData({
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        parcelNumber: '1',
        parcelValue: ''
      })
      setIsParceled(false)
      loadTransactions(user.id)
      router.push('/dashboard')
    } catch (error: any) {
      alert('Erro ao processar despesa: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await authService.signOut()
    router.push('/')
  }

  const fixedCategories = [
    'Aluguel',
    'Condomínio',
    'Internet',
    'Energia',
    'Água',
    'Telefone',
    'Assinaturas',
    'Outros'
  ]

  const variableCategories = [
    'Alimentação',
    'Transporte',
    'Lazer',
    'Saúde',
    'Educação',
    'Vestuário',
    'Compras',
    'Cartão de Crédito',
    'Mercado',
    'Petshop',
    'Outros'
  ]

  const categories = expenseType === 'expense_fixed' ? fixedCategories : variableCategories

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Menu Dropdown */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowMenu(false)}>
          <div className="absolute top-20 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 w-72 animate-in slide-in-from-top-5" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: PieChart, href: '/dashboard' },
                { id: 'receitas', label: 'Receitas', icon: TrendingDown, href: '/receitas' },
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
              {editingId ? 'Editar Despesa' : 'Adicionar Despesa'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Registre suas saídas financeiras
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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-0 shadow-xl dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {editingId ? 'Editar Despesa' : 'Adicionar Despesa'}
                </CardTitle>
                <p className="text-sm opacity-90 mt-1">Registre suas saídas financeiras</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Tipo de Despesa */}
            <div className="mb-6">
              <Label className="text-[#1C2A44] dark:text-white font-semibold mb-3 block">Tipo de Despesa</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setExpenseType('expense_fixed')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    expenseType === 'expense_fixed'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <p className="font-semibold">Fixa</p>
                  <p className="text-xs mt-1">Aluguel, contas, etc.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setExpenseType('expense_variable')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    expenseType === 'expense_variable'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <p className="font-semibold">Variável</p>
                  <p className="text-xs mt-1">Alimentação, lazer, etc.</p>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[#1C2A44] dark:text-white font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4 text-red-500" />
                  Categoria
                </Label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-[#1C2A44] dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-[#1C2A44] dark:text-white font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-red-500" />
                  Valor Total
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0,00"
                  className="text-lg h-12 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#1C2A44] dark:text-white font-semibold">
                  Descrição
                </Label>
                <Input
                  id="description"
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Compra do notebook"
                  className="h-12 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-[#1C2A44] dark:text-white font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  Data
                </Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-12 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Parcelamento - apenas para novas despesas */}
              {!editingId && (
                <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <Label className="text-[#1C2A44] dark:text-white font-semibold">Parcelamento</Label>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="isParceled"
                      checked={isParceled}
                      onChange={(e) => setIsParceled(e.target.checked)}
                      className="w-4 h-4 text-red-500 focus:ring-red-500"
                    />
                    <Label htmlFor="isParceled" className="text-[#1C2A44] dark:text-white">
                      Pagar parcelado
                    </Label>
                  </div>

                  {isParceled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="parcelNumber" className="text-sm text-[#1C2A44] dark:text-white">
                          Número de parcelas
                        </Label>
                        <Input
                          id="parcelNumber"
                          type="number"
                          min="1"
                          required
                          value={formData.parcelNumber}
                          onChange={(e) => setFormData({ ...formData, parcelNumber: e.target.value })}
                          placeholder="3"
                          className="h-10 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parcelValue" className="text-sm text-[#1C2A44] dark:text-white">
                          Valor por parcela
                        </Label>
                        <Input
                          id="parcelValue"
                          type="number"
                          step="0.01"
                          required
                          value={formData.parcelValue}
                          onChange={(e) => setFormData({ ...formData, parcelValue: e.target.value })}
                          placeholder="333,33"
                          className="h-10 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      {editingId ? 'Atualizar Despesa' : 'Adicionar Despesa'}
                    </>
                  )}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingId(null)
                      setFormData({
                        category: '',
                        amount: '',
                        description: '',
                        date: new Date().toISOString().split('T')[0],
                        parcelNumber: '1',
                        parcelValue: ''
                      })
                    }}
                    className="h-12 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Despesas */}
        {transactions.length > 0 && (
          <Card className="mt-6 border-0 shadow-xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-xl">
              <CardTitle className="text-xl font-bold">Despesas Registradas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1C2A44] dark:text-white">
                          {transaction.description}
                        </span>
                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                          {transaction.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-red-600 dark:text-red-400">
                          R$ {transaction.amount.toFixed(2)}
                        </span>
                        <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            💡 <strong>Dica:</strong> Separe suas despesas fixas das variáveis para ter melhor controle do seu orçamento!
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Target, Plus, Calendar, DollarSign, TrendingUp, PieChart, TrendingDown, Wallet, Users, Settings, LogOut, Bell, Moon, Sun, Trophy, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { authService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/components/custom/theme-provider'

interface Goal {
  id: string
  title: string
  target_amount: number
  current_amount: number
  deadline: string
}

export default function MetasPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    deadline: ''
  })

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)
    loadGoals(currentUser.id)
  }, [router])

  const loadGoals = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGoals(data || [])
    } catch (error) {
      console.error('Erro ao carregar metas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            target_amount: parseFloat(formData.target_amount),
            current_amount: 0,
            deadline: formData.deadline
          }
        ])

      if (error) throw error

      // Resetar formulário
      setFormData({
        title: '',
        target_amount: '',
        deadline: ''
      })
      setShowForm(false)

      // Recarregar metas
      await loadGoals(user.id)
      alert('Meta criada com sucesso!')
    } catch (error: any) {
      alert('Erro ao criar meta: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProgress = async (goalId: string, currentAmount: number) => {
    const newAmount = prompt('Digite o novo valor atual da meta:', currentAmount.toString())
    if (!newAmount) return

    try {
      const { error } = await supabase
        .from('goals')
        .update({ current_amount: parseFloat(newAmount) })
        .eq('id', goalId)

      if (error) throw error

      // Recarregar metas
      await loadGoals(user.id)
      alert('Progresso atualizado com sucesso!')
    } catch (error: any) {
      alert('Erro ao atualizar progresso: ' + error.message)
    }
  }

  const calculateRequiredAmounts = (goal: Goal) => {
    const remaining = Number(goal.target_amount) - Number(goal.current_amount)
    const today = new Date()
    const deadline = new Date(goal.deadline)
    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysLeft <= 0) {
      return { daily: 0, weekly: 0, monthly: 0, daysLeft: 0 }
    }

    const daily = remaining / daysLeft
    const weeksLeft = daysLeft / 7
    const weekly = weeksLeft > 0 ? remaining / weeksLeft : 0
    const monthsLeft = daysLeft / 30
    const monthly = monthsLeft > 0 ? remaining / monthsLeft : 0

    return {
      daily: Math.max(0, daily),
      weekly: Math.max(0, weekly),
      monthly: Math.max(0, monthly),
      daysLeft
    }
  }

  const handleLogout = async () => {
    await authService.signOut()
    router.push('/')
  }

  if (loading && goals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4CAF84] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
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
              Metas Financeiras
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Defina e acompanhe seus objetivos financeiros
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

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-end mb-8">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Meta
          </Button>
        </div>

        {/* Formulário de Nova Meta */}
        {showForm && (
          <Card className="border-0 shadow-xl dark:bg-gray-800 mb-8">
            <CardHeader className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white rounded-t-xl">
              <CardTitle className="text-xl font-bold">Criar Nova Meta</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#1C2A44] dark:text-white font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#4CAF84]" />
                    Título da Meta
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Viagem para Europa"
                    className="h-12 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-[#4CAF84] focus:border-[#4CAF84]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_amount" className="text-[#1C2A44] dark:text-white font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#4CAF84]" />
                    Valor Alvo
                  </Label>
                  <Input
                    id="target_amount"
                    type="number"
                    step="0.01"
                    required
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    placeholder="0,00"
                    className="text-lg h-12 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-[#4CAF84] focus:border-[#4CAF84]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-[#1C2A44] dark:text-white font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#4CAF84]" />
                    Data Limite
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="h-12 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-[#4CAF84] focus:border-[#4CAF84]"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl font-semibold shadow-lg"
                  >
                    {loading ? 'Criando...' : 'Criar Meta'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="h-12 px-6 rounded-xl"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Metas */}
        {goals.length === 0 ? (
          <Card className="border-0 shadow-lg dark:bg-gray-800">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-[#1C2A44] dark:text-white mb-2">
                Nenhuma meta ainda
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Crie sua primeira meta financeira e comece a alcançar seus objetivos!
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Primeira Meta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {goals.map((goal) => {
              const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )
              const isCompleted = progress >= 100
              const required = calculateRequiredAmounts(goal)

              return (
                <Card
                  key={goal.id}
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800 ${
                    isCompleted ? 'bg-gradient-to-br from-[#4CAF84]/10 to-[#3d8a6a]/10' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-[#1C2A44] dark:text-white mb-2">
                          {goal.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {daysLeft > 0
                              ? `${daysLeft} dias restantes`
                              : daysLeft === 0
                              ? 'Hoje é o prazo!'
                              : `${Math.abs(daysLeft)} dias atrasado`}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isCompleted ? 'bg-[#4CAF84]' : 'bg-[#4CAF84]/20'
                        }`}
                      >
                        <Target
                          className={`w-6 h-6 ${
                            isCompleted ? 'text-white' : 'text-[#4CAF84]'
                          }`}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progresso</span>
                        <span className="text-sm font-bold text-[#1C2A44] dark:text-white">
                          {Math.min(progress, 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-3" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Valor Atual</p>
                        <p className="text-lg font-bold text-[#4CAF84]">
                          R$ {Number(goal.current_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Meta</p>
                        <p className="text-lg font-bold text-[#1C2A44] dark:text-white">
                          R$ {Number(goal.target_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    {/* Cálculos de quanto precisa por período */}
                    {!isCompleted && required.daysLeft > 0 && (
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                            Para alcançar sua meta, você precisa economizar:
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Por Dia</p>
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                              R$ {required.daily.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Por Semana</p>
                            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                              R$ {required.weekly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Por Mês</p>
                            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                              R$ {required.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => handleUpdateProgress(goal.id, Number(goal.current_amount))}
                      variant="outline"
                      className="w-full rounded-xl border-[#4CAF84] text-[#4CAF84] hover:bg-[#4CAF84] hover:text-white"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Atualizar Progresso
                    </Button>

                    {isCompleted && (
                      <div className="p-3 bg-[#4CAF84]/10 border border-[#4CAF84]/20 rounded-xl">
                        <p className="text-sm text-[#4CAF84] font-semibold text-center">
                          🎉 Meta alcançada! Parabéns!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Dica:</strong> Defina metas realistas e atualize o progresso regularmente para manter a motivação!
          </p>
        </div>
      </div>
    </div>
  )
}

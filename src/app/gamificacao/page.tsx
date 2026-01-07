'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Trophy,
  Flame,
  Star,
  Target,
  Award,
  TrendingUp,
  Users,
  Share2,
  ChevronRight,
  Lock,
  Check,
  Zap,
  Crown,
  Medal,
  Gift,
  Calendar,
  PieChart,
  TrendingDown,
  Wallet,
  Settings,
  LogOut,
  Bell,
  Moon,
  Sun,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { authService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/components/custom/theme-provider'

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  xp: number
  unlocked: boolean
  progress: number
  maxProgress: number
  category: 'transactions' | 'goals' | 'streak' | 'community' | 'special'
}

interface UserStats {
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  totalTransactions: number
  goalsCompleted: number
  communityPosts: number
  achievements: Achievement[]
}

export default function GamificacaoPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 0,
    totalTransactions: 0,
    goalsCompleted: 0,
    communityPosts: 0,
    achievements: []
  })
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)
    loadGameData(currentUser.id)
  }, [router])

  const loadGameData = async (userId: string) => {
    try {
      // Carregar dados do usuário
      const [transactionsRes, goalsRes, postsRes, gameDataRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', userId),
        supabase.from('goals').select('*').eq('user_id', userId),
        supabase.from('community_posts').select('*').eq('user_id', userId),
        supabase.from('user_game_data').select('*').eq('user_id', userId).single()
      ])

      const transactions = transactionsRes.data || []
      const goals = goalsRes.data || []
      const posts = postsRes.data || []
      const gameData = gameDataRes.data

      // Calcular estatísticas
      const totalTransactions = transactions.length
      const goalsCompleted = goals.filter(g => 
        Number(g.current_amount) >= Number(g.target_amount)
      ).length
      const communityPosts = posts.length

      // Calcular streak (dias consecutivos com atividade)
      const streak = gameData?.streak || 0

      // Calcular XP e nível
      let totalXP = gameData?.total_xp || 0
      const level = calculateLevel(totalXP)
      const xpToNextLevel = calculateXPToNextLevel(level)

      // Gerar conquistas
      const achievements = generateAchievements(
        totalTransactions,
        goalsCompleted,
        communityPosts,
        streak,
        level,
        gameData?.unlocked_achievements || []
      )

      setStats({
        level: calculateLevel(totalXP),
        xp: totalXP,
        xpToNextLevel: calculateXPToNextLevel(calculateLevel(totalXP)),
        streak,
        totalTransactions,
        goalsCompleted,
        communityPosts,
        achievements
      })

      // Carregar ranking
      await loadLeaderboard()
    } catch (error) {
      console.error('Erro ao carregar dados de gamificação:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateLevel = (xp: number) => {
    return Math.floor(Math.sqrt(xp / 50)) + 1
  }

  const calculateXPToNextLevel = (level: number) => {
    return Math.pow(level, 2) * 50
  }

  const generateAchievements = (
    transactions: number,
    goalsCompleted: number,
    posts: number,
    streak: number,
    level: number,
    unlockedIds: string[]
  ): Achievement[] => {
    const achievements: Achievement[] = [
      // Transações
      {
        id: 'first_transaction',
        title: 'Primeiro Passo',
        description: 'Registre sua primeira transação',
        icon: Star,
        xp: 10,
        unlocked: transactions >= 1,
        progress: Math.min(transactions, 1),
        maxProgress: 1,
        category: 'transactions'
      },
      {
        id: 'transaction_10',
        title: 'Organizador',
        description: 'Registre 10 transações',
        icon: Target,
        xp: 25,
        unlocked: transactions >= 10,
        progress: Math.min(transactions, 10),
        maxProgress: 10,
        category: 'transactions'
      },
      {
        id: 'transaction_50',
        title: 'Mestre das Finanças',
        description: 'Registre 50 transações',
        icon: Trophy,
        xp: 50,
        unlocked: transactions >= 50,
        progress: Math.min(transactions, 50),
        maxProgress: 50,
        category: 'transactions'
      },
      {
        id: 'transaction_100',
        title: 'Lenda Financeira',
        description: 'Registre 100 transações',
        icon: Crown,
        xp: 100,
        unlocked: transactions >= 100,
        progress: Math.min(transactions, 100),
        maxProgress: 100,
        category: 'transactions'
      },

      // Metas
      {
        id: 'first_goal',
        title: 'Sonhador',
        description: 'Crie sua primeira meta',
        icon: Target,
        xp: 20,
        unlocked: goalsCompleted >= 1,
        progress: Math.min(goalsCompleted, 1),
        maxProgress: 1,
        category: 'goals'
      },
      {
        id: 'goal_complete_3',
        title: 'Determinado',
        description: 'Complete 3 metas',
        icon: Medal,
        xp: 50,
        unlocked: goalsCompleted >= 3,
        progress: Math.min(goalsCompleted, 3),
        maxProgress: 3,
        category: 'goals'
      },
      {
        id: 'goal_complete_10',
        title: 'Campeão',
        description: 'Complete 10 metas',
        icon: Crown,
        xp: 100,
        unlocked: goalsCompleted >= 10,
        progress: Math.min(goalsCompleted, 10),
        maxProgress: 10,
        category: 'goals'
      },

      // Ofensiva
      {
        id: 'streak_3',
        title: 'Consistente',
        description: 'Mantenha 3 dias de ofensiva',
        icon: Flame,
        xp: 15,
        unlocked: streak >= 3,
        progress: Math.min(streak, 3),
        maxProgress: 3,
        category: 'streak'
      },
      {
        id: 'streak_7',
        title: 'Dedicado',
        description: 'Mantenha 7 dias de ofensiva',
        icon: Flame,
        xp: 30,
        unlocked: streak >= 7,
        progress: Math.min(streak, 7),
        maxProgress: 7,
        category: 'streak'
      },
      {
        id: 'streak_30',
        title: 'Imparável',
        description: 'Mantenha 30 dias de ofensiva',
        icon: Flame,
        xp: 100,
        unlocked: streak >= 30,
        progress: Math.min(streak, 30),
        maxProgress: 30,
        category: 'streak'
      },

      // Comunidade
      {
        id: 'first_post',
        title: 'Socialite',
        description: 'Faça seu primeiro post na comunidade',
        icon: Users,
        xp: 15,
        unlocked: posts >= 1,
        progress: Math.min(posts, 1),
        maxProgress: 1,
        category: 'community'
      },
      {
        id: 'post_10',
        title: 'Influenciador',
        description: 'Faça 10 posts na comunidade',
        icon: Star,
        xp: 50,
        unlocked: posts >= 10,
        progress: Math.min(posts, 10),
        maxProgress: 10,
        category: 'community'
      },

      // Especiais
      {
        id: 'level_5',
        title: 'Ascensão',
        description: 'Alcance o nível 5',
        icon: Zap,
        xp: 50,
        unlocked: level >= 5,
        progress: Math.min(level, 5),
        maxProgress: 5,
        category: 'special'
      },
      {
        id: 'level_10',
        title: 'Elite',
        description: 'Alcance o nível 10',
        icon: Crown,
        xp: 100,
        unlocked: level >= 10,
        progress: Math.min(level, 10),
        maxProgress: 10,
        category: 'special'
      },
    ]

    return achievements
  }

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('user_game_data')
        .select('user_id, total_xp, streak')
        .order('total_xp', { ascending: false })
        .limit(10)

      if (error) throw error

      // Buscar nomes dos usuários
      const leaderboardWithNames = await Promise.all(
        (data || []).map(async (entry) => {
          const { data: userData } = await supabase
            .from('users')
            .select('name')
            .eq('id', entry.user_id)
            .single()

          return {
            ...entry,
            name: userData?.name || 'Usuário',
            level: calculateLevel(entry.total_xp)
          }
        })
      )

      setLeaderboard(leaderboardWithNames)
    } catch (error) {
      console.error('Erro ao carregar ranking:', error)
    }
  }

  const shareAchievement = async (achievement: Achievement) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert([
          {
            user_id: user.id,
            user_name: user.name,
            content: `🏆 Acabei de desbloquear a conquista "${achievement.title}"!\n\n${achievement.description}\n\n+${achievement.xp} XP ganhos! 🎉\n\n#FinWise #Conquista`,
            likes: 0,
            comments: 0
          }
        ])

      if (error) throw error

      setShowShareModal(false)
      setSelectedAchievement(null)
      alert('Conquista compartilhada na comunidade! 🎉')
    } catch (error: any) {
      alert('Erro ao compartilhar: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await authService.signOut()
    router.push('/')
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transactions': return 'from-blue-400 to-blue-600'
      case 'goals': return 'from-purple-400 to-purple-600'
      case 'streak': return 'from-orange-400 to-orange-600'
      case 'community': return 'from-pink-400 to-pink-600'
      case 'special': return 'from-yellow-400 to-yellow-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'transactions': return 'Transações'
      case 'goals': return 'Metas'
      case 'streak': return 'Ofensiva'
      case 'community': return 'Comunidade'
      case 'special': return 'Especiais'
      default: return category
    }
  }

  if (loading) {
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
                onClick={() => {
                  router.push('/dashboard')
                  setShowMenu(false)
                }}
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

      {/* Share Modal */}
      {showShareModal && selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Compartilhar Conquista
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getCategoryColor(selectedAchievement.category)} flex items-center justify-center mb-4`}>
                  <selectedAchievement.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedAchievement.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedAchievement.description}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4CAF84]/10 rounded-full">
                  <Star className="w-5 h-5 text-[#4CAF84]" />
                  <span className="font-bold text-[#4CAF84]">+{selectedAchievement.xp} XP</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowShareModal(false)
                    setSelectedAchievement(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white"
                  onClick={() => shareAchievement(selectedAchievement)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1C2A44] dark:text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-[#4CAF84]" />
              Conquistas e Ranking
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe seu progresso e conquistas
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
            </button>
            <button onClick={() => setShowMenu(!showMenu)}>
              <Avatar className="w-10 h-10 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] cursor-pointer hover:scale-105 transition-transform">
                <AvatarFallback className="text-white font-semibold">
                  {user?.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Nível */}
          <Card className="bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90">Nível Atual</p>
                  <p className="text-4xl font-bold">{stats.level}</p>
                </div>
                <Crown className="w-12 h-12 opacity-50" />
              </div>
              <Progress 
                value={(stats.xp % stats.xpToNextLevel) / stats.xpToNextLevel * 100} 
                className="h-2 bg-white/20"
              />
              <p className="text-xs mt-2 opacity-90">
                {stats.xp % stats.xpToNextLevel} / {stats.xpToNextLevel} XP
              </p>
            </CardContent>
          </Card>

          {/* Ofensiva */}
          <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Ofensiva 🔥</p>
                  <p className="text-4xl font-bold">{stats.streak}</p>
                  <p className="text-sm opacity-90">dias consecutivos</p>
                </div>
                <Flame className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>

          {/* Conquistas */}
          <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Conquistas</p>
                  <p className="text-4xl font-bold">
                    {stats.achievements.filter(a => a.unlocked).length}
                  </p>
                  <p className="text-sm opacity-90">
                    de {stats.achievements.length}
                  </p>
                </div>
                <Award className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>

          {/* XP Total */}
          <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">XP Total</p>
                  <p className="text-4xl font-bold">{stats.xp}</p>
                  <p className="text-sm opacity-90">pontos de experiência</p>
                </div>
                <Star className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conquistas */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-[#4CAF84]" />
                  Suas Conquistas ({stats.achievements.filter(a => a.unlocked).length}/{stats.achievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['transactions', 'goals', 'streak', 'community', 'special'].map(category => {
                  const categoryAchievements = stats.achievements.filter(a => a.category === category)
                  if (categoryAchievements.length === 0) return null

                  return (
                    <div key={category} className="space-y-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                        {category === 'transactions' && <Target className="w-5 h-5" />}
                        {category === 'goals' && <Award className="w-5 h-5" />}
                        {category === 'streak' && <Flame className="w-5 h-5" />}
                        {category === 'community' && <Users className="w-5 h-5" />}
                        {category === 'special' && <Star className="w-5 h-5" />}
                        {getCategoryName(category)}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryAchievements.map(achievement => (
                          <div
                            key={achievement.id}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              achievement.unlocked
                                ? 'bg-gradient-to-br ' + getCategoryColor(achievement.category) + ' border-transparent text-white hover:scale-105'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60'
                            }`}
                            onClick={() => {
                              if (achievement.unlocked) {
                                setSelectedAchievement(achievement)
                                setShowShareModal(true)
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                achievement.unlocked ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                              }`}>
                                {achievement.unlocked ? (
                                  <achievement.icon className="w-6 h-6" />
                                ) : (
                                  <Lock className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-bold">{achievement.title}</h4>
                                  {achievement.unlocked && (
                                    <Check className="w-5 h-5" />
                                  )}
                                </div>
                                <p className={`text-sm mb-2 ${
                                  achievement.unlocked ? 'opacity-90' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {achievement.description}
                                </p>
                                {!achievement.unlocked && (
                                  <div className="space-y-1">
                                    <Progress 
                                      value={(achievement.progress / achievement.maxProgress) * 100}
                                      className="h-1"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {achievement.progress} / {achievement.maxProgress}
                                    </p>
                                  </div>
                                )}
                                <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-bold ${
                                  achievement.unlocked ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                                }`}>
                                  <Star className="w-3 h-3" />
                                  +{achievement.xp} XP
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ranking */}
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-[#1C2A44] to-[#243654] text-white rounded-t-xl">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Medal className="w-5 h-5" />
                  Ranking Global
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      entry.user_id === user.id
                        ? 'bg-[#4CAF84]/20 border-2 border-[#4CAF84]'
                        : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a]'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {entry.name}
                        {entry.user_id === user.id && ' (Você)'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Nível {entry.level} • {entry.total_xp} XP
                      </p>
                    </div>
                    {entry.streak > 0 && (
                      <div className="flex items-center gap-1 text-orange-500">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-bold">{entry.streak}</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Progresso Diário */}
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#4CAF84]" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Transações
                    </span>
                  </div>
                  <span className="font-bold text-blue-600">{stats.totalTransactions}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Metas Completas
                    </span>
                  </div>
                  <span className="font-bold text-green-600">{stats.goalsCompleted}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Posts na Comunidade
                    </span>
                  </div>
                  <span className="font-bold text-purple-600">{stats.communityPosts}</span>
                </div>
              </CardContent>
            </Card>

            {/* Dica */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Gift className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">💡 Dica do Dia</h3>
                    <p className="text-sm opacity-90">
                      Entre no app todos os dias para manter sua ofensiva ativa e ganhar XP bônus! 🔥
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

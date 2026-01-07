'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, TrendingUp, Award, Target, Zap, Crown, Flame, Gift, Rocket } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  progress: number
  total: number
  unlocked: boolean
  points: number
  category: 'beginner' | 'intermediate' | 'advanced' | 'master'
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Conquistas Iniciantes
  {
    id: '1',
    title: 'Primeiro Passo',
    description: 'Registre sua primeira transação',
    icon: Star,
    progress: 0,
    total: 1,
    unlocked: false,
    points: 10,
    category: 'beginner'
  },
  {
    id: '2',
    title: 'Bem-vindo',
    description: 'Complete o tutorial de onboarding',
    icon: Gift,
    progress: 0,
    total: 1,
    unlocked: false,
    points: 15,
    category: 'beginner'
  },
  {
    id: '3',
    title: 'Organizador',
    description: 'Crie sua primeira meta financeira',
    icon: Target,
    progress: 0,
    total: 1,
    unlocked: false,
    points: 20,
    category: 'beginner'
  },
  // Conquistas Intermediárias
  {
    id: '4',
    title: 'Economista',
    description: 'Registre 10 transações',
    icon: TrendingUp,
    progress: 0,
    total: 10,
    unlocked: false,
    points: 50,
    category: 'intermediate'
  },
  {
    id: '5',
    title: 'Disciplinado',
    description: 'Use o app por 7 dias consecutivos',
    icon: Flame,
    progress: 0,
    total: 7,
    unlocked: false,
    points: 75,
    category: 'intermediate'
  },
  {
    id: '6',
    title: 'Meta Alcançada',
    description: 'Complete sua primeira meta financeira',
    icon: Trophy,
    progress: 0,
    total: 1,
    unlocked: false,
    points: 100,
    category: 'intermediate'
  },
  // Conquistas Avançadas
  {
    id: '7',
    title: 'Especialista',
    description: 'Registre 50 transações',
    icon: Zap,
    progress: 0,
    total: 50,
    unlocked: false,
    points: 150,
    category: 'advanced'
  },
  {
    id: '8',
    title: 'Persistente',
    description: 'Use o app por 30 dias consecutivos',
    icon: Award,
    progress: 0,
    total: 30,
    unlocked: false,
    points: 200,
    category: 'advanced'
  },
  {
    id: '9',
    title: 'Realizador',
    description: 'Complete 5 metas financeiras',
    icon: Rocket,
    progress: 0,
    total: 5,
    unlocked: false,
    points: 250,
    category: 'advanced'
  },
  // Conquistas Mestres
  {
    id: '10',
    title: 'Mestre das Finanças',
    description: 'Registre 100 transações',
    icon: Crown,
    progress: 0,
    total: 100,
    unlocked: false,
    points: 500,
    category: 'master'
  }
]

export function Gamification() {
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS)
  const [totalPoints, setTotalPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [currentXP, setCurrentXP] = useState(0)
  const [xpToNextLevel, setXpToNextLevel] = useState(100)
  const [showUnlock, setShowUnlock] = useState<Achievement | null>(null)
  const [showLevelUp, setShowLevelUp] = useState(false)

  useEffect(() => {
    // Carregar progresso do localStorage
    const savedProgress = localStorage.getItem('achievements')
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      setAchievements(parsed.achievements || INITIAL_ACHIEVEMENTS)
      setTotalPoints(parsed.totalPoints || 0)
      setLevel(parsed.level || 1)
      setCurrentXP(parsed.currentXP || 0)
      setXpToNextLevel(parsed.xpToNextLevel || 100)
    }
  }, [])

  useEffect(() => {
    // Salvar progresso no localStorage
    localStorage.setItem('achievements', JSON.stringify({
      achievements,
      totalPoints,
      level,
      currentXP,
      xpToNextLevel
    }))
  }, [achievements, totalPoints, level, currentXP, xpToNextLevel])

  const addXP = (points: number) => {
    let newXP = currentXP + points
    let newLevel = level
    let newXPToNext = xpToNextLevel

    // Verificar se subiu de nível
    while (newXP >= newXPToNext) {
      newXP -= newXPToNext
      newLevel += 1
      newXPToNext = Math.floor(newXPToNext * 1.5) // Aumenta 50% a cada nível
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 3000)
    }

    setCurrentXP(newXP)
    setLevel(newLevel)
    setXpToNextLevel(newXPToNext)
    setTotalPoints(prev => prev + points)
  }

  const updateProgress = (achievementId: string, progress: number) => {
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (a.id === achievementId && !a.unlocked) {
          const newProgress = Math.min(progress, a.total)
          
          // Verificar se desbloqueou
          if (newProgress >= a.total) {
            setShowUnlock(a)
            addXP(a.points)
            setTimeout(() => setShowUnlock(null), 3000)
            
            // Desbloquear próximas conquistas da mesma categoria
            unlockNextAchievements(a.category)
            
            return { ...a, progress: newProgress, unlocked: true }
          }
          
          return { ...a, progress: newProgress }
        }
        return a
      })
      return updated
    })
  }

  const unlockNextAchievements = (category: Achievement['category']) => {
    // Lógica para desbloquear conquistas da próxima categoria
    const categoryOrder: Achievement['category'][] = ['beginner', 'intermediate', 'advanced', 'master']
    const currentIndex = categoryOrder.indexOf(category)
    
    if (currentIndex < categoryOrder.length - 1) {
      const nextCategory = categoryOrder[currentIndex + 1]
      
      // Verificar se todas as conquistas da categoria atual foram desbloqueadas
      const currentCategoryAchievements = achievements.filter(a => a.category === category)
      const allUnlocked = currentCategoryAchievements.every(a => a.unlocked)
      
      if (allUnlocked) {
        // Mostrar notificação de novas conquistas disponíveis
        console.log(`Novas conquistas ${nextCategory} disponíveis!`)
      }
    }
  }

  // Função pública para atualizar progresso (pode ser chamada de outros componentes)
  useEffect(() => {
    // Expor função globalmente para outros componentes
    (window as any).updateAchievementProgress = updateProgress
  }, [])

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'beginner': return 'from-green-400 to-green-600'
      case 'intermediate': return 'from-blue-400 to-blue-600'
      case 'advanced': return 'from-purple-400 to-purple-600'
      case 'master': return 'from-yellow-400 to-yellow-600'
    }
  }

  const getCategoryLabel = (category: Achievement['category']) => {
    switch (category) {
      case 'beginner': return 'Iniciante'
      case 'intermediate': return 'Intermediário'
      case 'advanced': return 'Avançado'
      case 'master': return 'Mestre'
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalAchievements = achievements.length

  return (
    <>
      {/* Level Up Notification */}
      {showLevelUp && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-500">
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Subiu de Nível!</p>
                  <p className="text-2xl font-bold">Nível {level}</p>
                  <p className="text-sm opacity-80">Continue assim!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Unlock Notification */}
      {showUnlock && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-500">
          <Card className="bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] text-white border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Conquista Desbloqueada!</p>
                  <p className="text-lg font-bold">{showUnlock.title}</p>
                  <p className="text-sm opacity-80">+{showUnlock.points} XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Achievements Panel */}
      <Card className="border-0 shadow-lg dark:bg-gray-800">
        <CardContent className="p-6">
          {/* Header com Level e XP */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Conquistas e Recompensas
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unlockedCount} de {totalAchievements} desbloqueadas
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    Nível {level}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {totalPoints} pontos totais
                </p>
              </div>
            </div>

            {/* Barra de XP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Experiência</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currentXP} / {xpToNextLevel} XP
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={(currentXP / xpToNextLevel) * 100} 
                  className="h-3"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    {Math.round((currentXP / xpToNextLevel) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Conquistas por Categoria */}
          {(['beginner', 'intermediate', 'advanced', 'master'] as Achievement['category'][]).map(category => {
            const categoryAchievements = achievements.filter(a => a.category === category)
            const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length
            
            return (
              <div key={category} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getCategoryLabel(category)}
                  </h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {categoryUnlocked}/{categoryAchievements.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {categoryAchievements.map((achievement) => {
                    const Icon = achievement.icon
                    const progress = (achievement.progress / achievement.total) * 100

                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                          achievement.unlocked
                            ? `bg-gradient-to-r ${getCategoryColor(category)} bg-opacity-10 border-transparent shadow-lg`
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                              achievement.unlocked
                                ? `bg-gradient-to-br ${getCategoryColor(category)} text-white shadow-lg`
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {achievement.title}
                              </h4>
                              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                                achievement.unlocked
                                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }`}>
                                {achievement.points} XP
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {achievement.description}
                            </p>
                            {!achievement.unlocked && (
                              <div className="space-y-1">
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Progresso: {achievement.progress} / {achievement.total}
                                </p>
                              </div>
                            )}
                            {achievement.unlocked && (
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                  Desbloqueado!
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Dica */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              💡 <strong>Dica:</strong> Complete conquistas para ganhar XP e subir de nível! Quanto mais você usa o app, mais recompensas você desbloqueia.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

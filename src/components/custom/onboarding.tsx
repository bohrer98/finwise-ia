'use client'

import { useState } from 'react'
import { X, ArrowRight, ArrowLeft, Sparkles, TrendingUp, Target, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface OnboardingProps {
  onComplete: () => void
}

const steps = [
  {
    icon: Sparkles,
    title: 'Bem-vindo ao FinWise IA',
    description: 'Sua jornada para o controle financeiro começa aqui. Vamos te mostrar como usar o app!',
    color: 'from-[#4CAF84] to-[#3d8a6a]'
  },
  {
    icon: TrendingUp,
    title: 'Registre suas Finanças',
    description: 'Adicione suas receitas e despesas para ter uma visão completa da sua situação financeira.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Target,
    title: 'Defina suas Metas',
    description: 'Crie metas financeiras e acompanhe seu progresso. Alcance seus objetivos com planejamento!',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Users,
    title: 'Participe da Comunidade',
    description: 'Compartilhe dicas, aprenda com outros usuários e cresça junto com a comunidade FinWise.',
    color: 'from-orange-500 to-orange-600'
  }
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    if (dontShowAgain) {
      localStorage.setItem('dontShowOnboarding', 'true')
    }
    onComplete()
  }

  const step = steps[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {step.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {step.description}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 py-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-[#4CAF84]'
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Checkbox "Não mostrar novamente" */}
          <div className="flex items-center justify-center gap-2 py-2">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <label
              htmlFor="dontShowAgain"
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Não mostrar essa mensagem novamente
            </label>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <Button
              onClick={handlePrev}
              variant="outline"
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white"
            >
              {currentStep === steps.length - 1 ? 'Começar' : 'Próximo'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

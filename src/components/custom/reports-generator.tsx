'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ReportData {
  period: string
  income: number
  expenses: number
  balance: number
  categories: { name: string; amount: number }[]
}

export function ReportsGenerator() {
  const [period, setPeriod] = useState('month')
  const [generating, setGenerating] = useState(false)

  const generateReport = async () => {
    setGenerating(true)
    // Simular geração de relatório
    setTimeout(() => {
      setGenerating(false)
      // Aqui você pode implementar a lógica real de geração
      const report: ReportData = {
        period: period,
        income: 5000,
        expenses: 3500,
        balance: 1500,
        categories: [
          { name: 'Alimentação', amount: 800 },
          { name: 'Transporte', amount: 500 },
          { name: 'Moradia', amount: 1200 }
        ]
      }
      downloadReport(report)
    }, 2000)
  }

  const downloadReport = (data: ReportData) => {
    const reportText = `
RELATÓRIO FINANCEIRO - FINWISE IA
Período: ${data.period}
Data: ${new Date().toLocaleDateString('pt-BR')}

═══════════════════════════════════════

RESUMO FINANCEIRO
─────────────────────────────────────
Receitas:        R$ ${data.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Despesas:        R$ ${data.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Saldo:           R$ ${data.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

DESPESAS POR CATEGORIA
─────────────────────────────────────
${data.categories.map(c => `${c.name.padEnd(20)} R$ ${c.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('\n')}

═══════════════════════════════════════
Gerado automaticamente pelo FinWise IA
    `

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-financeiro-${new Date().getTime()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <FileText className="w-6 h-6 text-[#4CAF84]" />
          Relatórios Personalizados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Período do Relatório
            </label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="quarter">Último Trimestre</SelectItem>
                <SelectItem value="year">Último Ano</SelectItem>
                <SelectItem value="custom">Período Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Formato</p>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">PDF / TXT</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Filtros</p>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">Todos</p>
            </div>
          </div>
        </div>

        <Button
          onClick={generateReport}
          disabled={generating}
          className="w-full bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white h-12"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Gerando Relatório...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Gerar e Baixar Relatório
            </>
          )}
        </Button>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Dica:</strong> Os relatórios incluem análise detalhada de receitas, despesas por categoria, tendências e recomendações personalizadas.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

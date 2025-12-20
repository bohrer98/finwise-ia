"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Target, TrendingUp, Calendar, DollarSign, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

export default function MetasPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const metas = [
    {
      id: 1,
      nome: "Viagem para Europa",
      valorAlvo: 15000,
      valorAtual: 8500,
      prazo: "2024-12-31",
      categoria: "Viagem",
      cor: "#4CAF84",
      icone: "✈️",
    },
    {
      id: 2,
      nome: "Fundo de Emergência",
      valorAlvo: 20000,
      valorAtual: 12000,
      prazo: "2024-08-31",
      categoria: "Segurança",
      cor: "#1C2A44",
      icone: "🛡️",
    },
    {
      id: 3,
      nome: "Carro Novo",
      valorAlvo: 50000,
      valorAtual: 18000,
      prazo: "2025-06-30",
      categoria: "Veículo",
      cor: "#3d8a6a",
      icone: "🚗",
    },
    {
      id: 4,
      nome: "Investimento em Ações",
      valorAlvo: 10000,
      valorAtual: 3200,
      prazo: "2024-12-31",
      categoria: "Investimento",
      cor: "#5bc99a",
      icone: "📈",
    },
  ];

  const calcularProgresso = (atual: number, alvo: number) => {
    return Math.min((atual / alvo) * 100, 100);
  };

  const calcularDiasRestantes = (prazo: string) => {
    const hoje = new Date();
    const dataAlvo = new Date(prazo);
    const diff = dataAlvo.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calcularEconomiaMensal = (valorRestante: number, diasRestantes: number) => {
    const mesesRestantes = Math.max(diasRestantes / 30, 1);
    return valorRestante / mesesRestantes;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#1C2A44]">
                Metas Financeiras
              </h1>
              <p className="text-gray-600">Defina e acompanhe seus objetivos</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Meta
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">
                Total em Metas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R$ 41.700,00</p>
              <p className="text-sm opacity-80 mt-1">Economizado</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Metas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1C2A44]">4</p>
              <p className="text-sm text-gray-500 mt-1">Em andamento</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Progresso Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1C2A44]">44%</p>
              <p className="text-sm text-gray-500 mt-1">Das metas</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Próxima Meta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1C2A44]">60%</p>
              <p className="text-sm text-gray-500 mt-1">Fundo Emergência</p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#1C2A44]">
                Criar Nova Meta Financeira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-[#1C2A44] font-medium">
                      Nome da Meta
                    </Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Viagem, Carro, Casa..."
                      className="h-12 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valorAlvo" className="text-[#1C2A44] font-medium">
                      Valor Alvo
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="valorAlvo"
                        type="number"
                        placeholder="0,00"
                        className="h-12 pl-10 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valorAtual" className="text-[#1C2A44] font-medium">
                      Valor Atual (opcional)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="valorAtual"
                        type="number"
                        placeholder="0,00"
                        className="h-12 pl-10 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prazo" className="text-[#1C2A44] font-medium">
                      Prazo
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="prazo"
                        type="date"
                        className="h-12 pl-10 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1 h-12 rounded-xl border-2"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl shadow-lg"
                  >
                    Criar Meta
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {metas.map((meta) => {
            const progresso = calcularProgresso(meta.valorAtual, meta.valorAlvo);
            const diasRestantes = calcularDiasRestantes(meta.prazo);
            const valorRestante = meta.valorAlvo - meta.valorAtual;
            const economiaMensal = calcularEconomiaMensal(valorRestante, diasRestantes);

            return (
              <Card
                key={meta.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${meta.cor}20` }}
                      >
                        {meta.icone}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-[#1C2A44]">
                          {meta.nome}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{meta.categoria}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: meta.cor }}>
                        {progresso.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Progress
                      value={progresso}
                      className="h-3"
                      style={
                        {
                          "--progress-background": meta.cor,
                        } as React.CSSProperties
                      }
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        R$ {meta.valorAtual.toLocaleString("pt-BR")}
                      </span>
                      <span className="font-semibold text-[#1C2A44]">
                        R$ {meta.valorAlvo.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Faltam</p>
                      <p className="font-bold text-[#1C2A44]">
                        R$ {valorRestante.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Prazo</p>
                      <p className="font-bold text-[#1C2A44]">
                        {diasRestantes > 0 ? `${diasRestantes} dias` : "Vencido"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-[#4CAF84]/10 to-[#3d8a6a]/10 rounded-xl border-l-4 border-[#4CAF84]">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-[#4CAF84]" />
                      <p className="text-sm font-semibold text-[#1C2A44]">
                        Sugestão de Economia
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">
                      Economize <strong>R$ {economiaMensal.toFixed(2)}/mês</strong> para
                      atingir sua meta no prazo
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-10 rounded-xl border-2"
                    >
                      Adicionar Valor
                    </Button>
                    <Button
                      className="flex-1 h-10 rounded-xl"
                      style={{ backgroundColor: meta.cor }}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Achievements */}
        <Card className="bg-gradient-to-br from-[#1C2A44] to-[#243654] text-white border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#4CAF84]/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#4CAF84]" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Conquistas</CardTitle>
                <p className="text-sm opacity-80">Continue assim e alcance seus objetivos!</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="flex-1">
                <p className="font-semibold">Primeira Meta Criada</p>
                <p className="text-sm opacity-80">Você deu o primeiro passo!</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-3xl">💪</div>
              <div className="flex-1">
                <p className="font-semibold">50% de Progresso</p>
                <p className="text-sm opacity-80">Metade do caminho percorrido!</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm opacity-50">
              <div className="text-3xl">🏆</div>
              <div className="flex-1">
                <p className="font-semibold">Meta Concluída</p>
                <p className="text-sm opacity-80">Complete sua primeira meta para desbloquear</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

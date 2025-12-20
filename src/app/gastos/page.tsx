"use client";

import { ArrowLeft, PieChart as PieChartIcon, BarChart3, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function GastosPage() {
  const router = useRouter();

  const pieData = [
    { name: "Moradia", value: 1200, color: "#1C2A44" },
    { name: "Alimentação", value: 575, color: "#4CAF84" },
    { name: "Transporte", value: 185, color: "#3d8a6a" },
    { name: "Saúde", value: 89, color: "#5bc99a" },
    { name: "Lazer", value: 125, color: "#6dd4ab" },
  ];

  const barData = [
    { mes: "Jan", despesas: 2049, receitas: 8500 },
    { mes: "Fev", despesas: 2180, receitas: 8500 },
    { mes: "Mar", despesas: 1950, receitas: 8500 },
    { mes: "Abr", despesas: 2250, receitas: 9200 },
    { mes: "Mai", despesas: 2100, receitas: 8500 },
    { mes: "Jun", despesas: 2049, receitas: 8500 },
  ];

  const categorias = [
    { nome: "Moradia", valor: 1200, percentual: 55, cor: "#1C2A44" },
    { nome: "Alimentação", valor: 575, percentual: 26, cor: "#4CAF84" },
    { nome: "Transporte", valor: 185, percentual: 8, cor: "#3d8a6a" },
    { nome: "Saúde", valor: 89, percentual: 4, cor: "#5bc99a" },
    { nome: "Lazer", valor: 125, percentual: 6, cor: "#6dd4ab" },
  ];

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
                Visualização de Gastos
              </h1>
              <p className="text-gray-600">Análise detalhada dos seus gastos</p>
            </div>
          </div>
          <Select defaultValue="mes">
            <SelectTrigger className="w-48 h-12 rounded-xl border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">Este mês</SelectItem>
              <SelectItem value="trimestre">Último trimestre</SelectItem>
              <SelectItem value="semestre">Último semestre</SelectItem>
              <SelectItem value="ano">Este ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">
                Total Gasto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R$ 2.174,00</p>
              <p className="text-sm opacity-80 mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Média Diária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1C2A44]">R$ 72,47</p>
              <p className="text-sm text-gray-500 mt-1">Últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Maior Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1C2A44]">Moradia</p>
              <p className="text-sm text-gray-500 mt-1">55% do total</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Economia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#4CAF84]">R$ 6.326,00</p>
              <p className="text-sm text-gray-500 mt-1">74% da renda</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-[#1C2A44] flex items-center gap-2">
                  <PieChartIcon className="w-6 h-6 text-[#4CAF84]" />
                  Gastos por Categoria
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category List */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#1C2A44]">
                Detalhamento por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categorias.map((categoria, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: categoria.cor }}
                      />
                      <span className="font-semibold text-[#1C2A44]">
                        {categoria.nome}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1C2A44]">
                        R$ {categoria.valor.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-sm text-gray-500">{categoria.percentual}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${categoria.percentual}%`,
                        backgroundColor: categoria.cor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bar Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#1C2A44] flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#4CAF84]" />
              Evolução Mensal - Receitas vs Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="receitas" fill="#4CAF84" name="Receitas" radius={[8, 8, 0, 0]} />
                <Bar dataKey="despesas" fill="#ef4444" name="Despesas" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-gradient-to-br from-[#1C2A44] to-[#243654] text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-[#4CAF84]" />
              Análise Inteligente dos Gastos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-sm opacity-90">
                💰 Seus gastos com <strong>Moradia</strong> representam 55% do total. Considere
                buscar alternativas mais econômicas se possível.
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-sm opacity-90">
                📊 Você gastou <strong>R$ 575</strong> com alimentação este mês. Isso é 8% a menos
                que o mês passado. Continue assim!
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-sm opacity-90">
                🎯 Seus gastos estão <strong>12% abaixo</strong> da média dos últimos 6 meses.
                Excelente controle financeiro!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

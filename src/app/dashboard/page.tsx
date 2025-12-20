"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  PieChart,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  DollarSign,
  CreditCard,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dados mockados
  const balance = 5420.5;
  const income = 8500.0;
  const expenses = 3079.5;
  const savings = balance;

  const recentTransactions = [
    {
      id: 1,
      type: "expense",
      category: "Alimentação",
      amount: 125.5,
      date: "Hoje",
      icon: Receipt,
    },
    {
      id: 2,
      type: "income",
      category: "Salário",
      amount: 8500.0,
      date: "Ontem",
      icon: DollarSign,
    },
    {
      id: 3,
      type: "expense",
      category: "Transporte",
      amount: 85.0,
      date: "Ontem",
      icon: CreditCard,
    },
  ];

  const goals = [
    { name: "Viagem", current: 3200, target: 5000, color: "#4CAF84" },
    { name: "Emergência", current: 8500, target: 10000, color: "#3d8a6a" },
    { name: "Investimento", current: 1200, target: 3000, color: "#5bc99a" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-[#1C2A44] text-white p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold">FinWise IA</span>
        </div>

        <nav className="space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: PieChart },
            { id: "receitas", label: "Receitas", icon: TrendingUp },
            { id: "despesas", label: "Despesas", icon: TrendingDown },
            { id: "gastos", label: "Visualizar Gastos", icon: Wallet },
            { id: "metas", label: "Metas", icon: Target },
            { id: "comunidade", label: "Comunidade", icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-[#4CAF84] text-white shadow-lg"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1C2A44]">
                Olá, João! 👋
              </h1>
              <p className="text-gray-600">
                Aqui está um resumo das suas finanças
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-all">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#4CAF84] rounded-full"></span>
              </button>
              <Avatar className="w-10 h-10 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a]">
                <AvatarFallback className="text-white font-semibold">
                  JS
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium opacity-90">
                  Saldo Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">
                      R$ {balance.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-sm opacity-80 mt-1">+12.5% este mês</p>
                  </div>
                  <Wallet className="w-10 h-10 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Receitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-[#1C2A44]">
                      R$ {income.toLocaleString("pt-BR")}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-4 h-4 text-[#4CAF84]" />
                      <p className="text-sm text-[#4CAF84]">+8.2%</p>
                    </div>
                  </div>
                  <TrendingUp className="w-10 h-10 text-[#4CAF84] opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Despesas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-[#1C2A44]">
                      R$ {expenses.toLocaleString("pt-BR")}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                      <p className="text-sm text-red-500">-3.1%</p>
                    </div>
                  </div>
                  <TrendingDown className="w-10 h-10 text-red-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Economia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-[#1C2A44]">
                      R$ {savings.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">36% da renda</p>
                  </div>
                  <Target className="w-10 h-10 text-[#4CAF84] opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-[#1C2A44]">
                  Transações Recentes
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#4CAF84] hover:text-[#3d8a6a]"
                >
                  Ver todas
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          transaction.type === "income"
                            ? "bg-[#4CAF84]/20"
                            : "bg-red-50"
                        }`}
                      >
                        <transaction.icon
                          className={`w-6 h-6 ${
                            transaction.type === "income"
                              ? "text-[#4CAF84]"
                              : "text-red-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1C2A44]">
                          {transaction.category}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-bold text-lg ${
                        transaction.type === "income"
                          ? "text-[#4CAF84]"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}R${" "}
                      {transaction.amount.toLocaleString("pt-BR")}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Goals */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1C2A44]">
                  Metas Financeiras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {goals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[#1C2A44]">
                        {goal.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {Math.round((goal.current / goal.target) * 100)}%
                      </p>
                    </div>
                    <Progress
                      value={(goal.current / goal.target) * 100}
                      className="h-2"
                      style={
                        {
                          "--progress-background": goal.color,
                        } as React.CSSProperties
                      }
                    />
                    <p className="text-xs text-gray-500">
                      R$ {goal.current.toLocaleString("pt-BR")} de R${" "}
                      {goal.target.toLocaleString("pt-BR")}
                    </p>
                  </div>
                ))}
                <Button className="w-full bg-[#4CAF84] hover:bg-[#3d8a6a] text-white rounded-xl mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Meta
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="bg-gradient-to-br from-[#1C2A44] to-[#243654] text-white border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4CAF84]/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#4CAF84]" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Insights da IA
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-sm opacity-90">
                  💡 Você economizou 12% a mais este mês! Continue assim e você
                  atingirá sua meta de viagem em 2 meses.
                </p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-sm opacity-90">
                  📊 Seus gastos com alimentação aumentaram 15%. Considere
                  planejar refeições para economizar até R$ 300/mês.
                </p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-sm opacity-90">
                  🎯 Você tem R$ 1.340 sobrando este mês. Que tal investir 70%
                  e usar 30% para lazer?
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 bg-white hover:bg-gray-50 text-[#1C2A44] border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all">
              <Plus className="w-5 h-5 mr-2 text-[#4CAF84]" />
              <span className="font-semibold">Adicionar Receita</span>
            </Button>
            <Button className="h-20 bg-white hover:bg-gray-50 text-[#1C2A44] border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all">
              <Plus className="w-5 h-5 mr-2 text-red-500" />
              <span className="font-semibold">Adicionar Despesa</span>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
              <Target className="w-5 h-5 mr-2" />
              <span className="font-semibold">Criar Nova Meta</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

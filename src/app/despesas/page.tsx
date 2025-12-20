"use client";

import { useState } from "react";
import { ArrowLeft, Plus, TrendingDown, Calendar, DollarSign, Home, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function DespesasPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [tipoForm, setTipoForm] = useState<"fixa" | "variavel">("fixa");

  const despesasFixas = [
    { id: 1, descricao: "Aluguel", valor: 1200.0, data: "2024-01-05", categoria: "Moradia" },
    { id: 2, descricao: "Internet", valor: 99.9, data: "2024-01-10", categoria: "Contas" },
    { id: 3, descricao: "Academia", valor: 89.0, data: "2024-01-15", categoria: "Saúde" },
  ];

  const despesasVariaveis = [
    { id: 1, descricao: "Supermercado", valor: 450.0, data: "2024-01-08", categoria: "Alimentação" },
    { id: 2, descricao: "Uber", valor: 85.0, data: "2024-01-12", categoria: "Transporte" },
    { id: 3, descricao: "Restaurante", valor: 125.5, data: "2024-01-18", categoria: "Alimentação" },
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
                Registro de Despesas
              </h1>
              <p className="text-gray-600">Controle seus gastos fixos e variáveis</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Despesa
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">
                Total de Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R$ 2.049,40</p>
              <p className="text-sm opacity-80 mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Despesas Fixas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-[#1C2A44]" />
                <p className="text-3xl font-bold text-[#1C2A44]">R$ 1.388,90</p>
              </div>
              <p className="text-sm text-gray-500 mt-1">Mensais</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Despesas Variáveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#1C2A44]" />
                <p className="text-3xl font-bold text-[#1C2A44]">R$ 660,50</p>
              </div>
              <p className="text-sm text-gray-500 mt-1">Este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#1C2A44]">
                Adicionar Nova Despesa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={tipoForm === "fixa" ? "default" : "outline"}
                    onClick={() => setTipoForm("fixa")}
                    className={`flex-1 h-12 rounded-xl ${
                      tipoForm === "fixa"
                        ? "bg-[#1C2A44] text-white"
                        : "border-2"
                    }`}
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Despesa Fixa
                  </Button>
                  <Button
                    type="button"
                    variant={tipoForm === "variavel" ? "default" : "outline"}
                    onClick={() => setTipoForm("variavel")}
                    className={`flex-1 h-12 rounded-xl ${
                      tipoForm === "variavel"
                        ? "bg-[#1C2A44] text-white"
                        : "border-2"
                    }`}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Despesa Variável
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="descricao" className="text-[#1C2A44] font-medium">
                      Descrição
                    </Label>
                    <Input
                      id="descricao"
                      placeholder="Ex: Aluguel, Supermercado..."
                      className="h-12 rounded-xl border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor" className="text-[#1C2A44] font-medium">
                      Valor
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="valor"
                        type="number"
                        placeholder="0,00"
                        className="h-12 pl-10 rounded-xl border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria" className="text-[#1C2A44] font-medium">
                      Categoria
                    </Label>
                    <Select>
                      <SelectTrigger className="h-12 rounded-xl border-gray-300">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoForm === "fixa" ? (
                          <>
                            <SelectItem value="moradia">Moradia</SelectItem>
                            <SelectItem value="contas">Contas</SelectItem>
                            <SelectItem value="saude">Saúde</SelectItem>
                            <SelectItem value="educacao">Educação</SelectItem>
                            <SelectItem value="seguros">Seguros</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="alimentacao">Alimentação</SelectItem>
                            <SelectItem value="transporte">Transporte</SelectItem>
                            <SelectItem value="lazer">Lazer</SelectItem>
                            <SelectItem value="compras">Compras</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data" className="text-[#1C2A44] font-medium">
                      Data
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="data"
                        type="date"
                        className="h-12 pl-10 rounded-xl border-gray-300 focus:border-red-500 focus:ring-red-500"
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
                    className="flex-1 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg"
                  >
                    Adicionar Despesa
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="fixas" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-white border-2 border-gray-200 rounded-xl p-1">
            <TabsTrigger
              value="fixas"
              className="rounded-lg data-[state=active]:bg-[#1C2A44] data-[state=active]:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Despesas Fixas
            </TabsTrigger>
            <TabsTrigger
              value="variaveis"
              className="rounded-lg data-[state=active]:bg-[#1C2A44] data-[state=active]:text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Despesas Variáveis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fixas">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1C2A44]">
                  Despesas Fixas Mensais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {despesasFixas.map((despesa) => (
                  <div
                    key={despesa.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1C2A44]">
                          {despesa.descricao}
                        </p>
                        <p className="text-sm text-gray-500">{despesa.categoria}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-red-500">
                        -R$ {despesa.valor.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(despesa.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variaveis">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1C2A44]">
                  Despesas Variáveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {despesasVariaveis.map((despesa) => (
                  <div
                    key={despesa.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1C2A44]">
                          {despesa.descricao}
                        </p>
                        <p className="text-sm text-gray-500">{despesa.categoria}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-red-500">
                        -R$ {despesa.valor.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(despesa.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ArrowLeft, Plus, TrendingUp, Calendar, DollarSign } from "lucide-react";
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
import { useRouter } from "next/navigation";

export default function ReceitasPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const receitas = [
    {
      id: 1,
      descricao: "Salário",
      valor: 8500.0,
      data: "2024-01-05",
      categoria: "Salário",
      recorrente: true,
    },
    {
      id: 2,
      descricao: "Freelance Design",
      valor: 1200.0,
      data: "2024-01-15",
      categoria: "Freelance",
      recorrente: false,
    },
    {
      id: 3,
      descricao: "Investimentos",
      valor: 450.0,
      data: "2024-01-20",
      categoria: "Investimentos",
      recorrente: true,
    },
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
                Registro de Receitas
              </h1>
              <p className="text-gray-600">Gerencie suas fontes de renda</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Receita
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">
                Total de Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R$ 10.150,00</p>
              <p className="text-sm opacity-80 mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Receitas Recorrentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1C2A44]">R$ 8.950,00</p>
              <p className="text-sm text-gray-500 mt-1">Mensais</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Receitas Extras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1C2A44]">R$ 1.200,00</p>
              <p className="text-sm text-gray-500 mt-1">Este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#1C2A44]">
                Adicionar Nova Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="descricao" className="text-[#1C2A44] font-medium">
                      Descrição
                    </Label>
                    <Input
                      id="descricao"
                      placeholder="Ex: Salário, Freelance..."
                      className="h-12 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
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
                        className="h-12 pl-10 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
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
                        <SelectItem value="salario">Salário</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="investimentos">Investimentos</SelectItem>
                        <SelectItem value="bonus">Bônus</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
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
                        className="h-12 pl-10 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recorrente"
                    className="w-5 h-5 rounded border-gray-300 text-[#4CAF84] focus:ring-[#4CAF84]"
                  />
                  <Label htmlFor="recorrente" className="text-[#1C2A44] font-medium cursor-pointer">
                    Receita recorrente (mensal)
                  </Label>
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
                    Adicionar Receita
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#1C2A44]">
              Histórico de Receitas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {receitas.map((receita) => (
              <div
                key={receita.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#4CAF84]/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#4CAF84]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C2A44]">
                      {receita.descricao}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-500">{receita.categoria}</p>
                      {receita.recorrente && (
                        <span className="px-2 py-0.5 bg-[#4CAF84]/20 text-[#4CAF84] text-xs rounded-full font-medium">
                          Recorrente
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-[#4CAF84]">
                    +R$ {receita.valor.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(receita.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

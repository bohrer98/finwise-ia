"use client";

import { useState } from "react";
import { ArrowRight, TrendingUp, Shield, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C2A44] via-[#243654] to-[#1C2A44]">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FinWise IA</span>
          </div>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Controle suas
                <span className="text-[#4CAF84]"> finanças</span> com
                inteligência
              </h1>
              <p className="text-xl text-gray-300">
                Gestão financeira inteligente, segura e intuitiva para você
                alcançar seus objetivos.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#4CAF84]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-[#4CAF84]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Análise Inteligente
                  </h3>
                  <p className="text-gray-400">
                    IA analisa seus gastos e sugere melhorias automáticas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#4CAF84]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#4CAF84]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Segurança Premium
                  </h3>
                  <p className="text-gray-400">
                    Seus dados protegidos com criptografia de ponta
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#4CAF84]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#4CAF84]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Comunidade Ativa
                  </h3>
                  <p className="text-gray-400">
                    Compartilhe experiências e aprenda com outros usuários
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login/Signup Form */}
          <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-0">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-[#1C2A44]">
                  {isLogin ? "Bem-vindo de volta" : "Criar conta"}
                </h2>
                <p className="text-gray-600">
                  {isLogin
                    ? "Entre para continuar sua jornada financeira"
                    : "Comece sua jornada financeira hoje"}
                </p>
              </div>

              <div className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#1C2A44] font-medium">
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="João Silva"
                      className="h-12 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1C2A44] font-medium">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="h-12 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#1C2A44] font-medium">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
                  />
                </div>

                {isLogin && (
                  <div className="flex items-center justify-end">
                    <button className="text-sm text-[#4CAF84] hover:underline font-medium">
                      Esqueceu a senha?
                    </button>
                  </div>
                )}

                <Button
                  className="w-full h-12 bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    // Simula login/cadastro e redireciona para dashboard
                    window.location.href = "/dashboard";
                  }}
                >
                  {isLogin ? "Entrar" : "Criar conta"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-gray-600 hover:text-[#1C2A44] font-medium"
                >
                  {isLogin ? (
                    <>
                      Não tem uma conta?{" "}
                      <span className="text-[#4CAF84]">Cadastre-se</span>
                    </>
                  ) : (
                    <>
                      Já tem uma conta?{" "}
                      <span className="text-[#4CAF84]">Entrar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

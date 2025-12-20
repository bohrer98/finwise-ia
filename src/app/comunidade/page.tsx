"use client";

import { useState } from "react";
import { ArrowLeft, Users, MessageCircle, ThumbsUp, Send, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function ComunidadePage() {
  const router = useRouter();
  const [novaPostagem, setNovaPostagem] = useState("");

  const postagens = [
    {
      id: 1,
      autor: "Maria Silva",
      avatar: "MS",
      tempo: "2h atrás",
      conteudo:
        "Consegui economizar R$ 500 este mês seguindo as dicas da comunidade! Muito obrigada a todos! 🎉",
      likes: 24,
      comentarios: 8,
      categoria: "Conquista",
    },
    {
      id: 2,
      autor: "João Santos",
      avatar: "JS",
      tempo: "5h atrás",
      conteudo:
        "Alguém tem dicas de como reduzir gastos com alimentação? Estou gastando muito com delivery...",
      likes: 12,
      comentarios: 15,
      categoria: "Dúvida",
    },
    {
      id: 3,
      autor: "Ana Costa",
      avatar: "AC",
      tempo: "1d atrás",
      conteudo:
        "Dica: Comecei a fazer planejamento semanal de refeições e economizei 30% no supermercado! 🥗",
      likes: 45,
      comentarios: 22,
      categoria: "Dica",
    },
    {
      id: 4,
      autor: "Pedro Lima",
      avatar: "PL",
      tempo: "2d atrás",
      conteudo:
        "Atingi minha primeira meta financeira! Juntei R$ 5.000 para emergências. Próximo objetivo: viagem! ✈️",
      likes: 67,
      comentarios: 31,
      categoria: "Conquista",
    },
  ];

  const topMembros = [
    { nome: "Carlos Mendes", avatar: "CM", pontos: 1250, badge: "🏆" },
    { nome: "Juliana Rocha", avatar: "JR", pontos: 980, badge: "🥈" },
    { nome: "Ricardo Alves", avatar: "RA", pontos: 875, badge: "🥉" },
    { nome: "Fernanda Dias", avatar: "FD", pontos: 720, badge: "⭐" },
    { nome: "Lucas Martins", avatar: "LM", pontos: 650, badge: "⭐" },
  ];

  const categorias = [
    { nome: "Todas", cor: "#1C2A44" },
    { nome: "Dúvidas", cor: "#4CAF84" },
    { nome: "Dicas", cor: "#3d8a6a" },
    { nome: "Conquistas", cor: "#5bc99a" },
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
              <h1 className="text-2xl font-bold text-[#1C2A44]">Comunidade</h1>
              <p className="text-gray-600">
                Compartilhe experiências e aprenda com outros usuários
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#4CAF84]/10 rounded-xl">
            <Users className="w-5 h-5 text-[#4CAF84]" />
            <span className="font-semibold text-[#1C2A44]">2.847 membros</span>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Post */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a]">
                    <AvatarFallback className="text-white font-semibold">
                      VC
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="Compartilhe uma conquista, dúvida ou dica..."
                      value={novaPostagem}
                      onChange={(e) => setNovaPostagem(e.target.value)}
                      className="h-12 rounded-xl border-gray-300 focus:border-[#4CAF84] focus:ring-[#4CAF84]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {categorias.slice(1).map((cat) => (
                          <button
                            key={cat.nome}
                            className="px-3 py-1.5 text-sm rounded-lg border-2 border-gray-200 hover:border-[#4CAF84] hover:bg-[#4CAF84]/10 transition-all"
                          >
                            {cat.nome}
                          </button>
                        ))}
                      </div>
                      <Button
                        className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl"
                        disabled={!novaPostagem.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Publicar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filter Tabs */}
            <Tabs defaultValue="todas" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 h-12 bg-white border-2 border-gray-200 rounded-xl p-1">
                {categorias.map((cat) => (
                  <TabsTrigger
                    key={cat.nome}
                    value={cat.nome.toLowerCase()}
                    className="rounded-lg data-[state=active]:bg-[#1C2A44] data-[state=active]:text-white"
                  >
                    {cat.nome}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="todas" className="space-y-4">
                {postagens.map((post) => (
                  <Card
                    key={post.id}
                    className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a]">
                          <AvatarFallback className="text-white font-semibold">
                            {post.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-[#1C2A44]">
                                {post.autor}
                              </p>
                              <p className="text-sm text-gray-500">{post.tempo}</p>
                            </div>
                            <span className="px-3 py-1 bg-[#4CAF84]/10 text-[#4CAF84] text-xs rounded-full font-medium">
                              {post.categoria}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {post.conteudo}
                          </p>
                          <div className="flex items-center gap-6 pt-2">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-[#4CAF84] transition-all">
                              <ThumbsUp className="w-5 h-5" />
                              <span className="font-medium">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 hover:text-[#4CAF84] transition-all">
                              <MessageCircle className="w-5 h-5" />
                              <span className="font-medium">
                                {post.comentarios}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Members */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1C2A44] flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#4CAF84]" />
                  Top Membros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topMembros.map((membro, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <div className="text-2xl">{membro.badge}</div>
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a]">
                      <AvatarFallback className="text-white font-semibold text-sm">
                        {membro.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-[#1C2A44] text-sm">
                        {membro.nome}
                      </p>
                      <p className="text-xs text-gray-500">
                        {membro.pontos} pontos
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="bg-gradient-to-br from-[#1C2A44] to-[#243654] text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Estatísticas da Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[#4CAF84]" />
                    <span className="text-sm">Postagens hoje</span>
                  </div>
                  <span className="font-bold text-lg">127</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#4CAF84]" />
                    <span className="text-sm">Membros ativos</span>
                  </div>
                  <span className="font-bold text-lg">892</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#4CAF84]" />
                    <span className="text-sm">Dicas compartilhadas</span>
                  </div>
                  <span className="font-bold text-lg">1.2k</span>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#1C2A44]">
                  Diretrizes da Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>✅ Seja respeitoso e gentil</p>
                <p>✅ Compartilhe experiências reais</p>
                <p>✅ Ajude outros membros</p>
                <p>❌ Não faça spam ou propaganda</p>
                <p>❌ Não compartilhe informações falsas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

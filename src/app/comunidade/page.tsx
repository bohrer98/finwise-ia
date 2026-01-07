'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, MessageCircle, ThumbsUp, Send, TrendingUp, PieChart, TrendingDown, Wallet, Target, Settings, LogOut, Bell, Moon, Sun, Edit2, Trash2, X, Check, Heart, MessageSquare, Share2, Bookmark, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { authService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/components/custom/theme-provider'

interface Post {
  id: string
  user_id: string
  user_name: string
  content: string
  likes: number
  comments: number
  created_at: string
}

interface Comment {
  id: string
  post_id: string
  user_id: string
  user_name: string
  content: string
  created_at: string
}

export default function ComunidadePage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({})
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)
    loadPosts()
  }, [router])

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(prev => ({ ...prev, [postId]: data || [] }))
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    setPosting(true)
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert([
          {
            user_id: user.id,
            user_name: user.name,
            content: newPost,
            likes: 0,
            comments: 0
          }
        ])

      if (error) throw error

      setNewPost('')
      await loadPosts()
    } catch (error: any) {
      alert('Erro ao criar post: ' + error.message)
    } finally {
      setPosting(false)
    }
  }

  const handleEditPost = async (postId: string) => {
    if (!editContent.trim()) return

    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ content: editContent })
        .eq('id', postId)
        .eq('user_id', user.id) // Garantir que só o autor pode editar

      if (error) throw error

      setEditingPostId(null)
      setEditContent('')
      await loadPosts()
    } catch (error: any) {
      alert('Erro ao editar post: ' + error.message)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      // Deletar comentários primeiro
      await supabase
        .from('post_comments')
        .delete()
        .eq('post_id', postId)

      // Deletar post
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id) // Garantir que só o autor pode deletar

      if (error) throw error

      setShowDeleteConfirm(null)
      await loadPosts()
    } catch (error: any) {
      alert('Erro ao deletar post: ' + error.message)
    }
  }

  const handleLike = async (postId: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ likes: currentLikes + 1 })
        .eq('id', postId)

      if (error) throw error

      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: currentLikes + 1 } : post
      ))
    } catch (error: any) {
      alert('Erro ao curtir post: ' + error.message)
    }
  }

  const handleAddComment = async (postId: string) => {
    const commentText = newComment[postId]
    if (!commentText?.trim()) return

    try {
      const { error } = await supabase
        .from('post_comments')
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            user_name: user.name,
            content: commentText
          }
        ])

      if (error) throw error

      // Atualizar contador de comentários
      const post = posts.find(p => p.id === postId)
      if (post) {
        await supabase
          .from('community_posts')
          .update({ comments: (post.comments || 0) + 1 })
          .eq('id', postId)
      }

      setNewComment(prev => ({ ...prev, [postId]: '' }))
      await loadComments(postId)
      await loadPosts()
    } catch (error: any) {
      alert('Erro ao adicionar comentário: ' + error.message)
    }
  }

  const handleDeleteComment = async (commentId: string, postId: string) => {
    try {
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id) // Garantir que só o autor pode deletar

      if (error) throw error

      // Atualizar contador de comentários
      const post = posts.find(p => p.id === postId)
      if (post && post.comments > 0) {
        await supabase
          .from('community_posts')
          .update({ comments: post.comments - 1 })
          .eq('id', postId)
      }

      await loadComments(postId)
      await loadPosts()
    } catch (error: any) {
      alert('Erro ao deletar comentário: ' + error.message)
    }
  }

  const toggleComments = (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null)
    } else {
      setExpandedPost(postId)
      if (!comments[postId]) {
        loadComments(postId)
      }
    }
  }

  const startEdit = (post: Post) => {
    setEditingPostId(post.id)
    setEditContent(post.content)
  }

  const cancelEdit = () => {
    setEditingPostId(null)
    setEditContent('')
  }

  const handleLogout = async () => {
    await authService.signOut()
    router.push('/')
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Agora'
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d atrás`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4CAF84] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Menu Dropdown */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowMenu(false)}>
          <div className="absolute top-20 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 w-72 animate-in slide-in-from-top-5" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: PieChart, href: '/dashboard' },
                { id: 'receitas', label: 'Receitas', icon: TrendingUp, href: '/receitas' },
                { id: 'despesas', label: 'Despesas', icon: TrendingDown, href: '/despesas' },
                { id: 'gastos', label: 'Visualizar Gastos', icon: Wallet, href: '/gastos' },
                { id: 'metas', label: 'Metas', icon: Target, href: '/metas' },
                { id: 'comunidade', label: 'Comunidade', icon: Users, href: '/comunidade' },
                { id: 'gamificacao', label: 'Conquistas', icon: Trophy, href: '/gamificacao' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(item.href)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[#4CAF84]/10 hover:text-[#4CAF84] transition-all duration-300"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[#4CAF84]/10 hover:text-[#4CAF84] transition-all"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Configurações</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1C2A44] dark:text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-[#4CAF84]" />
              Comunidade FinWise
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Compartilhe dicas, experiências e aprenda com outros usuários
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#4CAF84] rounded-full"></span>
            </button>
            <button onClick={() => setShowMenu(!showMenu)}>
              <Avatar className="w-10 h-10 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a] cursor-pointer hover:scale-105 transition-transform">
                <AvatarFallback className="text-white font-semibold bg-[#1C2A44] dark:bg-[#4CAF84]">
                  {user?.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Criar Novo Post */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 mb-8">
          <CardHeader className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] text-white rounded-t-xl">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Compartilhe algo com a comunidade
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreatePost} className="space-y-4">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Compartilhe uma dica financeira, uma conquista ou peça ajuda..."
                className="min-h-[120px] border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-[#4CAF84] focus:border-[#4CAF84] resize-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={posting || !newPost.trim()}
                  className="bg-gradient-to-r from-[#4CAF84] to-[#3d8a6a] hover:from-[#3d8a6a] hover:to-[#4CAF84] text-white rounded-xl shadow-lg disabled:opacity-50"
                >
                  {posting ? 'Publicando...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publicar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Feed de Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-[#1C2A44] dark:text-white mb-2">
                  Nenhum post ainda
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Seja o primeiro a compartilhar algo com a comunidade!
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a]">
                      <AvatarFallback className="text-white font-semibold">
                        {post.user_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-[#1C2A44] dark:text-white">{post.user_name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(post.created_at)}</p>
                        </div>
                        {post.user_id === user.id && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(post)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowDeleteConfirm(post.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Modo de Edição */}
                      {editingPostId === post.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px] border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditPost(post.id)}
                              className="bg-[#4CAF84] hover:bg-[#3d8a6a] text-white"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                            {post.content}
                          </p>

                          {/* Ações do Post */}
                          <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id, post.likes)}
                              className="text-gray-600 dark:text-gray-400 hover:text-[#4CAF84] hover:bg-[#4CAF84]/10 rounded-xl"
                            >
                              <Heart className="w-4 h-4 mr-2" />
                              <span className="font-semibold">{post.likes}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleComments(post.id)}
                              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              <span className="font-semibold">{post.comments || 0}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Compartilhar
                            </Button>
                          </div>

                          {/* Seção de Comentários */}
                          {expandedPost === post.id && (
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                              {/* Adicionar Comentário */}
                              <div className="flex gap-3">
                                <Avatar className="w-8 h-8 bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a]">
                                  <AvatarFallback className="text-white text-xs font-semibold">
                                    {user?.name?.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 flex gap-2">
                                  <input
                                    type="text"
                                    value={newComment[post.id] || ''}
                                    onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                    placeholder="Adicione um comentário..."
                                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF84] focus:border-transparent"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddComment(post.id)
                                      }
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddComment(post.id)}
                                    disabled={!newComment[post.id]?.trim()}
                                    className="bg-[#4CAF84] hover:bg-[#3d8a6a] text-white"
                                  >
                                    <Send className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Lista de Comentários */}
                              <div className="space-y-3">
                                {comments[post.id]?.map((comment) => (
                                  <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600">
                                      <AvatarFallback className="text-white text-xs font-semibold">
                                        {comment.user_name.substring(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                          {comment.user_name}
                                        </p>
                                        {comment.user_id === user.id && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteComment(comment.id, post.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-6 w-6 p-0"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {comment.content}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {getTimeAgo(comment.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Modal de Confirmação de Exclusão */}
                {showDeleteConfirm === post.id && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Confirmar Exclusão
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3 justify-end">
                          <Button
                            variant="ghost"
                            onClick={() => setShowDeleteConfirm(null)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => handleDeletePost(post.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Excluir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Ranking de Usuários Mais Ativos */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 mt-8">
          <CardHeader className="bg-gradient-to-r from-[#1C2A44] to-[#243654] text-white rounded-t-xl">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Usuários Mais Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {posts
                .reduce((acc, post) => {
                  const existing = acc.find(u => u.user_id === post.user_id)
                  if (existing) {
                    existing.posts += 1
                    existing.likes += post.likes
                  } else {
                    acc.push({
                      user_id: post.user_id,
                      user_name: post.user_name,
                      posts: 1,
                      likes: post.likes
                    })
                  }
                  return acc
                }, [] as { user_id: string; user_name: string; posts: number; likes: number }[])
                .sort((a, b) => b.posts - a.posts)
                .slice(0, 5)
                .map((userStats, index) => (
                  <div
                    key={userStats.user_id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-gradient-to-br from-[#4CAF84] to-[#3d8a6a]'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1C2A44] dark:text-white">{userStats.user_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {userStats.posts} posts • {userStats.likes} curtidas
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
          <p className="text-sm text-purple-800 dark:text-purple-300">
            💡 <strong>Dica:</strong> Compartilhe suas conquistas financeiras e inspire outros membros da comunidade!
          </p>
        </div>
      </div>
    </div>
  )
}

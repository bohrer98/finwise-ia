import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas públicas que não precisam de autenticação
const publicRoutes = ['/', '/quiz', '/assinatura']

// Rotas da API que não precisam de verificação
const apiPublicRoutes = ['/api/webhooks/pagbank', '/api/subscription/create']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso a rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Permitir acesso a APIs públicas
  if (apiPublicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Permitir acesso a arquivos estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Verificar se usuário está logado (via cookie ou header)
  const userCookie = request.cookies.get('finwise_user')
  
  // Se não está logado, redirecionar para home
  if (!userCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const user = JSON.parse(userCookie.value)
    
    // Verificar assinatura ativa no Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Variáveis de ambiente do Supabase não configuradas')
      return NextResponse.redirect(new URL('/quiz', request.url))
    }

    // Fazer requisição ao Supabase para verificar assinatura
    const response = await fetch(`${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${user.id}&status=eq.active&order=created_at.desc&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Erro ao verificar assinatura:', response.statusText)
      return NextResponse.redirect(new URL('/quiz', request.url))
    }

    const subscriptions = await response.json()
    
    // Se não tem assinatura ativa, redirecionar para quiz
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.redirect(new URL('/quiz', request.url))
    }

    const subscription = subscriptions[0]

    // Verificar se a assinatura está expirada
    if (subscription.expires_at) {
      const expiresAt = new Date(subscription.expires_at)
      const now = new Date()
      
      if (now > expiresAt) {
        // Assinatura expirada - redirecionar para quiz
        return NextResponse.redirect(new URL('/quiz', request.url))
      }
    }

    // Usuário tem assinatura ativa - permitir acesso
    return NextResponse.next()
  } catch (error) {
    console.error('Erro no middleware:', error)
    // Em caso de erro, redirecionar para quiz por segurança
    return NextResponse.redirect(new URL('/quiz', request.url))
  }
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|lasy-bridge.js).*)',
  ],
}

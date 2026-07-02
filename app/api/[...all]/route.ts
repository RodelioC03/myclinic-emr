import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const url = new URL(request.url)
  // Only handle /api/auth/* paths
  if (!url.pathname.startsWith('/api/auth/')) {
    return new Response('Not Found', { status: 404 })
  }
  return await auth.handler(request)
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  // Only handle /api/auth/* paths
  if (!url.pathname.startsWith('/api/auth/')) {
    return new Response('Not Found', { status: 404 })
  }
  return await auth.handler(request)
}

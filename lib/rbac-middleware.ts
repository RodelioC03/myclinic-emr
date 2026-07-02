import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractToken } from '@/lib/auth-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type AuthContext = {
  userId: string
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT'
}

export async function requireAuth(
  request: NextRequest
): Promise<AuthContext | NextResponse> {
  try {
    const token = extractToken(request.headers.get('authorization'))

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Verify session still exists
    const session = await prisma.session.findUnique({
      where: { token },
    })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }

    return {
      userId: decoded.userId,
      role: decoded.role as 'ADMIN' | 'DOCTOR' | 'PATIENT',
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export function requireRole(
  auth: AuthContext | NextResponse,
  allowedRoles: string[]
): AuthContext | NextResponse {
  if (auth instanceof NextResponse) {
    return auth
  }

  if (!allowedRoles.includes(auth.role)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  return auth
}

export async function requireRoleWithScope(
  auth: AuthContext | NextResponse,
  allowedRoles: string[],
  requiredUserId?: string
): Promise<AuthContext | NextResponse> {
  if (auth instanceof NextResponse) {
    return auth
  }

  if (!allowedRoles.includes(auth.role)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  // PATIENT can only access their own data
  if (auth.role === 'PATIENT' && requiredUserId && auth.userId !== requiredUserId) {
    return NextResponse.json(
      { error: 'Cannot access other users data' },
      { status: 403 }
    )
  }

  return auth
}

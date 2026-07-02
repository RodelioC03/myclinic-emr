import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAuth, requireRole } from '@/lib/rbac-middleware'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const roleCheck = requireRole(auth, ['DOCTOR', 'ADMIN'])
  if (roleCheck instanceof NextResponse) return roleCheck

  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    const patients = await prisma.patientProfile.findMany({
      where: {
        OR: [
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { user: { email: { contains: query, mode: 'insensitive' } } },
          { contact: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        user: true,
      },
      take: 20,
    })

    return NextResponse.json({
      patients: patients.map((p) => ({
        id: p.id,
        userId: p.userId,
        name: p.user.name,
        email: p.user.email,
        age: p.dateOfBirth
          ? Math.floor((new Date().getTime() - new Date(p.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))
          : null,
        sex: p.sex,
        contact: p.contact,
      })),
    })
  } catch (error) {
    console.error('Patient search error:', error)
    return NextResponse.json(
      { error: 'Failed to search patients' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

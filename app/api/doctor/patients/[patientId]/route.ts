import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAuth, requireRoleWithScope } from '@/lib/rbac-middleware'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const roleCheck = await requireRoleWithScope(auth, ['DOCTOR', 'ADMIN'], undefined)
  if (roleCheck instanceof NextResponse) return roleCheck

  try {
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { id: params.patientId },
      include: {
        user: true,
        appointments: {
          orderBy: { scheduledAt: 'desc' },
          take: 10,
        },
        encounters: {
          orderBy: { encounteredAt: 'desc' },
          take: 10,
        },
        prescriptions: {
          orderBy: { issuedAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!patientProfile) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      patient: {
        id: patientProfile.id,
        name: patientProfile.user.name,
        email: patientProfile.user.email,
        dateOfBirth: patientProfile.dateOfBirth,
        age: patientProfile.dateOfBirth
          ? Math.floor((new Date().getTime() - new Date(patientProfile.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))
          : null,
        sex: patientProfile.sex,
        contact: patientProfile.contact,
        address: patientProfile.address,
        occupation: patientProfile.occupation,
        allergies: patientProfile.allergies,
        pmh: patientProfile.pmh,
        psh: patientProfile.psh,
        familyHistory: patientProfile.familyHistory,
        smoking: patientProfile.smoking,
        alcohol: patientProfile.alcohol,
        vaccination: patientProfile.vaccination,
        weight: patientProfile.weight,
        height: patientProfile.height,
        bmi: patientProfile.bmi,
      },
      appointments: patientProfile.appointments,
      recentEncounters: patientProfile.encounters,
      recentPrescriptions: patientProfile.prescriptions,
    })
  } catch (error) {
    console.error('Patient chart error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient chart' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

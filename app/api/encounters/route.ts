import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAuth, requireRole } from '@/lib/rbac-middleware'
import { z } from 'zod'

const prisma = new PrismaClient()

const EncounterSchema = z.object({
  patientId: z.string(),
  chiefComplaint: z.string().optional(),
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  bp: z.string().optional(),
  hr: z.number().optional(),
  rr: z.number().optional(),
  temp: z.number().optional(),
  spo2: z.number().optional(),
  weight: z.number().optional(),
})

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const roleCheck = requireRole(auth, ['DOCTOR', 'ADMIN'])
  if (roleCheck instanceof NextResponse) return roleCheck

  try {
    const body = await request.json()
    const data = EncounterSchema.parse(body)

    // Get doctor profile
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: auth.userId },
    })

    if (!doctorProfile) {
      return NextResponse.json(
        { error: 'Doctor profile not found' },
        { status: 404 }
      )
    }

    const encounter = await prisma.encounter.create({
      data: {
        patientId: data.patientId,
        doctorId: doctorProfile.id,
        chiefComplaint: data.chiefComplaint,
        subjective: data.subjective,
        objective: data.objective,
        assessment: data.assessment,
        plan: data.plan,
        bp: data.bp,
        hr: data.hr,
        rr: data.rr,
        temp: data.temp,
        spo2: data.spo2,
        weight: data.weight,
      },
      include: {
        patient: true,
        doctor: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Encounter created successfully',
        encounter,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Encounter creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create encounter' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')

    const encounters = await prisma.encounter.findMany({
      where: patientId ? { patientId } : { doctorId: { equals: undefined } },
      orderBy: { encounteredAt: 'desc' },
      include: {
        patient: true,
        doctor: true,
      },
    })

    return NextResponse.json({ encounters })
  } catch (error) {
    console.error('Encounter fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch encounters' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAuth, requireRole } from '@/lib/rbac-middleware'
import { z } from 'zod'

const prisma = new PrismaClient()

const PrescriptionSchema = z.object({
  patientId: z.string(),
  encounterId: z.string(),
  drug: z.string(),
  dose: z.string(),
  frequency: z.string(),
  duration: z.string().optional(),
  sig: z.string().optional(),
  quantity: z.number().optional(),
})

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const roleCheck = requireRole(auth, ['DOCTOR', 'ADMIN'])
  if (roleCheck instanceof NextResponse) return roleCheck

  try {
    const body = await request.json()
    const data = PrescriptionSchema.parse(body)

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: auth.userId },
    })

    if (!doctorProfile) {
      return NextResponse.json(
        { error: 'Doctor profile not found' },
        { status: 404 }
      )
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId: data.patientId,
        doctorId: doctorProfile.id,
        encounterId: data.encounterId,
        drug: data.drug,
        dose: data.dose,
        frequency: data.frequency,
        duration: data.duration,
        sig: data.sig,
        quantity: data.quantity,
      },
    })

    return NextResponse.json(
      {
        message: 'Prescription created successfully',
        prescription,
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
    console.error('Prescription creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create prescription' },
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

    const prescriptions = await prisma.prescription.findMany({
      where: patientId ? { patientId } : {},
      orderBy: { issuedAt: 'desc' },
      include: {
        patient: true,
        doctor: true,
      },
    })

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error('Prescription fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

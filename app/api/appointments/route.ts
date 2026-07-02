import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '@/lib/rbac-middleware'
import { z } from 'zod'

const prisma = new PrismaClient()

const AppointmentSchema = z.object({
  scheduledAt: z.string().optional(),
  reason: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { scheduledAt, reason } = AppointmentSchema.parse(body)

    // Get patient profile
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: auth.userId },
    })

    if (!patientProfile) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      )
    }

    // Create appointment request
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patientProfile.id,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        reason,
        status: 'PENDING',
      },
    })

    return NextResponse.json(
      {
        message: 'Appointment request created',
        appointment,
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
    console.error('Appointment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
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
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: auth.userId },
    })

    if (!patientProfile) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      )
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patientProfile.id },
      orderBy: { scheduledAt: 'desc' },
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Appointment fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

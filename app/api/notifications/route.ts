import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '@/lib/rbac-middleware'
import { z } from 'zod'

const prisma = new PrismaClient()

const NotificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  type: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { title, message, type } = NotificationSchema.parse(body)

    const notification = await prisma.notification.create({
      data: {
        userId: auth.userId,
        title,
        message,
        type,
      },
    })

    return NextResponse.json(
      {
        message: 'Notification created',
        notification,
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
    console.error('Notification creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
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
    const notifications = await prisma.notification.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: auth.userId, read: false },
    })

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (error) {
    console.error('Notification fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

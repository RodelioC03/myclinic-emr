import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '@/lib/rbac-middleware'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    if (notification.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'Cannot update other users notifications' },
        { status: 403 }
      )
    }

    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { read: true },
    })

    return NextResponse.json({
      message: 'Notification marked as read',
      notification: updated,
    })
  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    console.log('🔍 Admin API: Loading users...')

    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        firstName: true,
        lastName: true,
        club: true,
        points: true,
        level: true,
        createdAt: true,
        _count: {
          select: {
            workouts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ Found ${users.length} users`)

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        ...user,
        workoutCount: user._count.workouts
      }))
    })

  } catch (error) {
    console.error('❌ Error loading users:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
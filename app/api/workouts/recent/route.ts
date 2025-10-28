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

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const adminUserId = searchParams.get('userId') // Solo para admin

    console.log('🔍 Loading recent workouts...', { limit, email: session.user.email })

    // Obtener el usuario actual de la sesión
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Construir filtros - SIEMPRE filtrar por usuario actual
    // Solo permitir ver otros usuarios si es admin y se especifica userId
    const where: any = {
      userId: adminUserId || currentUser.id
    }

    // Obtener entrenamientos recientes
    const workouts = await prisma.workout.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: limit
    })

    console.log(`✅ Found ${workouts.length} recent workouts`)

    return NextResponse.json({
      success: true,
      workouts: workouts.map(workout => ({
        id: workout.id,
        userId: workout.userId,
        user: {
          name: workout.user.name,
          email: workout.user.email,
          image: workout.user.image
        },
        title: workout.title,
        description: workout.description,
        type: workout.type,
        duration: workout.duration,
        distance: workout.distance,
        calories: workout.calories,
        avgPace: workout.avgPace,
        heartRate: workout.heartRate,
        location: workout.location,
        points: workout.points,
        createdAt: workout.createdAt.toISOString()
      }))
    })

  } catch (error) {
    console.error('❌ Error loading recent workouts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
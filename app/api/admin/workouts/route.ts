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
    const userId = searchParams.get('userId')

    console.log('🔍 Admin API: Loading workouts...', { userId })

    // Construir el filtro
    const where: any = {}
    if (userId) {
      where.userId = userId
    }

    // Obtener los entrenamientos con información del usuario
    const workouts = await prisma.workout.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ Found ${workouts.length} workouts`)

    return NextResponse.json({
      success: true,
      workouts: workouts.map((workout: any) => ({
        id: workout.id,
        userId: workout.userId,
        userName: workout.user.name,
        userEmail: workout.user.email,
        type: workout.type,
        duration: workout.duration,
        distance: workout.distance,
        calories: workout.calories,
        avgHeartRate: workout.avgHeartRate || workout.heartRate,
        maxHeartRate: workout.maxHeartRate,
        pace: workout.pace || workout.avgPace,
        location: workout.location,
        notes: workout.notes || workout.description,
        date: workout.date ? workout.date.toISOString() : workout.createdAt.toISOString(),
        createdAt: workout.createdAt.toISOString()
      }))
    })

  } catch (error) {
    console.error('❌ Error loading workouts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.error('❌ No session found')
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📝 Admin API: Request body:', JSON.stringify(body, null, 2))
    
    const { 
      userId, 
      type, 
      duration, 
      distance, 
      calories, 
      avgHeartRate, 
      maxHeartRate, 
      pace, 
      location, 
      notes, 
      date,
      title
    } = body

    console.log('📝 Admin API: Creating workout for user:', userId)
    console.log('📝 Validation check:', {
      hasUserId: !!userId,
      hasType: !!type,
      hasDuration: !!duration,
      hasDate: !!date,
      userId,
      type,
      duration,
      date
    })

    // Validar campos requeridos (duration puede ser 0, así que verificamos undefined/null)
    if (!userId || !type || duration === undefined || duration === null || !date) {
      console.error('❌ Validation failed:', { userId, type, duration, date })
      return NextResponse.json(
        { error: 'Campos requeridos: userId, type, duration, date' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Generar título si no se proporciona
    const workoutTitle = title || `${type} - ${duration} min`

    // Crear el entrenamiento
    const workout = await prisma.workout.create({
      data: {
        userId,
        title: workoutTitle,
        type,
        duration,
        distance: distance || null,
        calories: calories || null,
        heartRate: avgHeartRate || null,
        avgPace: pace || null,
        location: location || null,
        description: notes || null,
        points: 0, // Se calculará después
        // Nuevos campos (TypeScript no los reconoce aún pero existen en DB)
        ...({
          avgHeartRate: avgHeartRate || null,
          maxHeartRate: maxHeartRate || null,
          pace: pace || null,
          notes: notes || null,
          date: date ? new Date(date) : new Date(),
          source: 'MANUAL'
        } as any)
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }) as any

    // Calcular puntos basados en el tipo y duración del entrenamiento
    let points = 0
    switch (type) {
      case 'RUNNING':
        points = Math.floor(duration / 10) * 5 // 5 puntos cada 10 minutos
        break
      case 'CYCLING':
        points = Math.floor(duration / 15) * 5 // 5 puntos cada 15 minutos
        break
      case 'SWIMMING':
        points = Math.floor(duration / 5) * 5 // 5 puntos cada 5 minutos
        break
      case 'TRIATHLON':
        points = Math.floor(duration / 8) * 10 // 10 puntos cada 8 minutos
        break
      default:
        points = Math.floor(duration / 12) * 5 // 5 puntos cada 12 minutos
    }

    // Actualizar workout con los puntos calculados
    await prisma.workout.update({
      where: { id: workout.id },
      data: { points }
    })

    // Agregar puntos al usuario
    if (points > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: points
          }
        }
      })

      // Crear registro de puntos
      await prisma.pointsHistory.create({
        data: {
          userId,
          points,
          type: 'WORKOUT',
          description: `Entrenamiento de ${type.toLowerCase()} - ${duration} minutos`,
          reference: workout.id
        }
      })
    }

    console.log(`✅ Workout created successfully for ${user.name}, awarded ${points} points`)

    return NextResponse.json({
      success: true,
      workout: {
        id: workout.id,
        userId: workout.userId,
        userName: workout.user.name,
        userEmail: workout.user.email,
        type: workout.type,
        duration: workout.duration,
        distance: workout.distance,
        calories: workout.calories,
        avgHeartRate: workout.avgHeartRate || workout.heartRate,
        maxHeartRate: workout.maxHeartRate,
        pace: workout.pace || workout.avgPace,
        location: workout.location,
        notes: workout.notes || workout.description,
        date: workout.date ? workout.date.toISOString() : workout.createdAt.toISOString(),
        createdAt: workout.createdAt.toISOString()
      },
      pointsAwarded: points,
      message: `Entrenamiento creado exitosamente. ${points} puntos otorgados.`
    })

  } catch (error) {
    console.error('❌ Error creating workout:', error)
    console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
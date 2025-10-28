import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        club: true,
        points: true,
        level: true,
        image: true,
        createdAt: true,
        inviteCode: true,
        invitedBy: true,
        _count: {
          select: {
            workouts: true,
            sentInvites: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Calcular estadísticas adicionales
    const [
      totalWorkouts,
      totalDistance,
      totalDuration,
      thisMonthWorkouts,
      thisMonthPoints
    ] = await Promise.all([
      prisma.workout.count({
        where: { userId: user.id }
      }),
      prisma.workout.aggregate({
        where: { userId: user.id },
        _sum: { distance: true }
      }),
      prisma.workout.aggregate({
        where: { userId: user.id },
        _sum: { duration: true }
      }),
      prisma.workout.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.pointsHistory.aggregate({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { points: true }
      })
    ])

    // Determinar nivel basado en puntos
    let level = 'Principiante'
    if (user.points >= 5000) level = 'Elite'
    else if (user.points >= 3000) level = 'Avanzado'
    else if (user.points >= 1500) level = 'Intermedio'

    // Calcular ranking simulado
    const rankingPosition = user.points >= 5000 ? 1 : 
                           user.points >= 3000 ? 2 : 
                           user.points >= 1500 ? 3 : 
                           user.points >= 500 ? 4 : 5

    const stats = {
      // Datos básicos del usuario
      id: user.id,
      name: user.name,
      email: user.email,
      club: user.club || `TriClub ${level}`,
      points: user.points,
      level,
      avatar: user.image || '/avatar-placeholder.jpg',
      inviteCode: user.inviteCode,
      memberSince: user.createdAt,
      
      // Estadísticas de entrenamientos
      totalWorkouts,
      totalDistance: totalDistance._sum.distance || 0,
      totalDuration: (totalDuration._sum.duration || 0) / 60, // en horas
      thisMonthWorkouts,
      thisMonthPoints: thisMonthPoints._sum.points || 0,
      
      // Gamificación
      rankingPosition,
      invitesSent: user._count.sentInvites,
      
      // Progreso semanal (vacío para usuarios nuevos)
      weeklyProgress: {
        swimming: 0,
        cycling: 0,
        running: 0,
        totalDistance: 0,
        workoutCount: 0
      }
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('❌ Error getting user stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
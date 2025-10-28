import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'

// Mock data que simula respuestas de Garmin Connect
const mockGarminActivities = [
  {
    id: "garmin_123",
    activityName: "Entrenamiento de Natación",
    activityType: "SWIMMING",
    startTimeLocal: "2024-10-27T07:00:00",
    duration: 3600, // 1 hora en segundos
    distance: 2000, // metros
    calories: 450,
    averageHR: 145,
    maxHR: 165,
    averagePace: "2:15", // min/100m
    location: "Club Náutico San Isidro"
  },
  {
    id: "garmin_124",
    activityName: "Rodaje Base",
    activityType: "RUNNING",
    startTimeLocal: "2024-10-26T18:30:00",
    duration: 2700, // 45 min
    distance: 8500, // metros
    calories: 520,
    averageHR: 155,
    maxHR: 172,
    averagePace: "5:18", // min/km
    location: "Costanera Norte"
  },
  {
    id: "garmin_125",
    activityName: "Entrenamiento de Ciclismo",
    activityType: "CYCLING",
    startTimeLocal: "2024-10-25T08:00:00",
    duration: 5400, // 1.5 horas
    distance: 45000, // metros
    calories: 890,
    averageHR: 148,
    maxHR: 168,
    averagePace: "30.0", // km/h
    location: "Circuito Tigre"
  }
]

export const workoutsRouter = createTRPCRouter({
  // Obtener entrenamientos del usuario
  getWorkouts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional().default(10),
        type: z.enum(['SWIMMING', 'CYCLING', 'RUNNING', 'TRIATHLON', 'OTHER']).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 10
      const type = input?.type

      console.log('🔍 getWorkouts called with:', { limit, type, userId: ctx.session?.user?.id })

      // Primero intentamos obtener de la base de datos
      const dbWorkouts = await ctx.prisma.workout.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(type && { type }),
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      })

      console.log('📊 DB workouts found:', dbWorkouts.length)

      // Solo usar mock data para el usuario demo específico
      if (dbWorkouts.length === 0) {
        // Solo el usuario demo original debería ver datos mock
        const demoUserEmail = 'atleta@triclub.ar'
        const currentUser = await ctx.prisma.user.findUnique({
          where: { id: ctx.session.user.id },
          select: { email: true }
        })
        
        if (currentUser?.email === demoUserEmail) {
          console.log('🎭 Using mock data for demo user')
          
          const filteredMockData = type 
            ? mockGarminActivities.filter(activity => activity.activityType === type)
            : mockGarminActivities

          const mockResult = filteredMockData.slice(0, limit).map(activity => ({
            id: activity.id,
            title: activity.activityName,
            type: activity.activityType,
            duration: Math.floor(activity.duration / 60), // convertir a minutos
            distance: activity.distance / 1000, // convertir a km
            calories: activity.calories,
            heartRate: activity.averageHR,
            avgPace: activity.averagePace,
            location: activity.location,
            points: calculatePoints(activity.activityType, activity.duration, activity.distance),
            createdAt: activity.startTimeLocal, // Usar string en lugar de Date
            garminId: activity.id,
          }))
          
          console.log('✅ Returning mock workouts for demo user:', mockResult.length)
          return mockResult
        } else {
          console.log('✅ New user - returning empty workouts list')
          return []
        }
      }

      console.log('✅ Returning DB workouts:', dbWorkouts.length, JSON.stringify(dbWorkouts, null, 2))
      return dbWorkouts
    }),

  // Obtener estadísticas del usuario
  getStats: protectedProcedure
    .input(
      z.object({
        period: z.enum(['week', 'month', 'year']).optional().default('month'),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const period = input?.period || 'month'

      // Calcular fecha de inicio según el período
      const now = new Date()
      const startDate = new Date()
      
      switch (period) {
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      const workouts = await ctx.prisma.workout.findMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: startDate,
          },
        },
      })

      // Si no hay datos en DB, usar mock stats
      if (workouts.length === 0) {
        return {
          totalWorkouts: 12,
          totalDistance: 156.5, // km
          totalDuration: 18.5, // horas
          totalCalories: 8450,
          avgHeartRate: 152,
          totalPoints: 1250,
          byType: {
            SWIMMING: { count: 4, distance: 8.0, duration: 4.5 },
            CYCLING: { count: 4, distance: 120.0, duration: 8.0 },
            RUNNING: { count: 4, distance: 28.5, duration: 6.0 },
          }
        }
      }

      // Calcular estadísticas reales
      const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0)
      const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0)
      const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0)
      const totalPoints = workouts.reduce((sum, w) => sum + w.points, 0)

      const byType = workouts.reduce((acc, workout) => {
        if (!acc[workout.type]) {
          acc[workout.type] = { count: 0, distance: 0, duration: 0 }
        }
        acc[workout.type].count++
        acc[workout.type].distance += workout.distance || 0
        acc[workout.type].duration += workout.duration
        return acc
      }, {} as Record<string, { count: number; distance: number; duration: number }>)

      return {
        totalWorkouts: workouts.length,
        totalDistance,
        totalDuration: totalDuration / 60, // convertir a horas
        totalCalories,
        avgHeartRate: workouts.reduce((sum, w) => sum + (w.heartRate || 0), 0) / workouts.length || 0,
        totalPoints,
        byType,
      }
    }),

  // Sincronizar con Garmin (mock por ahora)
  syncWithGarmin: protectedProcedure.mutation(async ({ ctx }) => {
    // TODO: Implementar sincronización real con Garmin API
    // Por ahora, creamos entrenamientos mock en la DB
    
    const mockWorkoutsToCreate = mockGarminActivities.map(activity => ({
      userId: ctx.session.user.id,
      title: activity.activityName,
      type: activity.activityType as any,
      duration: Math.floor(activity.duration / 60),
      distance: activity.distance / 1000,
      calories: activity.calories,
      heartRate: activity.averageHR,
      avgPace: activity.averagePace,
      location: activity.location,
      points: calculatePoints(activity.activityType, activity.duration, activity.distance),
      garminId: activity.id,
    }))

    // Verificar cuáles ya existen
    const existingGarminIds = await ctx.prisma.workout.findMany({
      where: {
        userId: ctx.session.user.id,
        garminId: { in: mockWorkoutsToCreate.map(w => w.garminId) }
      },
      select: { garminId: true }
    })

    const existingIds = new Set(existingGarminIds.map(w => w.garminId))
    const newWorkouts = mockWorkoutsToCreate.filter(w => !existingIds.has(w.garminId))

    if (newWorkouts.length > 0) {
      await ctx.prisma.workout.createMany({
        data: newWorkouts
      })

      // Agregar puntos al usuario
      const totalPoints = newWorkouts.reduce((sum, w) => sum + w.points, 0)
      
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { points: { increment: totalPoints } }
      })

      // Crear historial de puntos
      await ctx.prisma.pointsHistory.createMany({
        data: newWorkouts.map(workout => ({
          userId: ctx.session.user.id,
          points: workout.points,
          type: 'WORKOUT' as any,
          description: `Entrenamiento: ${workout.title}`,
          reference: workout.garminId,
        }))
      })
    }

    return {
      syncedWorkouts: newWorkouts.length,
      totalPoints: newWorkouts.reduce((sum, w) => sum + w.points, 0),
    }
  }),

  // Crear nuevo entrenamiento
  createWorkout: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(['SWIMMING', 'CYCLING', 'RUNNING', 'TRIATHLON', 'OTHER']),
        duration: z.number().positive(), // en minutos
        distance: z.number().positive().optional(), // en km
        calories: z.number().positive().optional(),
        heartRate: z.number().positive().optional(),
        avgPace: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, type, duration, distance, calories, heartRate, avgPace, location } = input

      // Calcular puntos automáticamente
      const points = calculatePoints(type, duration * 60, (distance || 0) * 1000)

      // Crear el entrenamiento
      const workout = await ctx.prisma.workout.create({
        data: {
          userId: ctx.session.user.id,
          title,
          description,
          type,
          duration,
          distance,
          calories,
          heartRate,
          avgPace,
          location,
          points,
        },
      })

      // Agregar puntos al usuario
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { points: { increment: points } }
      })

      // Crear historial de puntos
      await ctx.prisma.pointsHistory.create({
        data: {
          userId: ctx.session.user.id,
          points,
          type: 'WORKOUT',
          description: `Entrenamiento: ${title}`,
          reference: workout.id,
        },
      })

      return {
        workout,
        pointsEarned: points,
      }
    }),
})

// Función para calcular puntos basado en el tipo y duración del entrenamiento
function calculatePoints(type: string, durationSeconds: number, distanceMeters: number): number {
  const durationMinutes = durationSeconds / 60
  const distanceKm = distanceMeters / 1000

  switch (type) {
    case 'SWIMMING':
      return Math.floor(durationMinutes * 2 + distanceKm * 50) // 2 pts/min + 50 pts/km
    case 'CYCLING':
      return Math.floor(durationMinutes * 1.5 + distanceKm * 3) // 1.5 pts/min + 3 pts/km
    case 'RUNNING':
      return Math.floor(durationMinutes * 2.5 + distanceKm * 10) // 2.5 pts/min + 10 pts/km
    case 'TRIATHLON':
      return Math.floor(durationMinutes * 3 + distanceKm * 15) // Bonus por triatlón
    default:
      return Math.floor(durationMinutes * 1) // 1 pt/min para otros
  }
}
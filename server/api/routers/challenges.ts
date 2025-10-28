import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'

// Mock challenges que simula desafíos del club
const mockChallenges = [
  {
    id: "challenge_1",
    title: "Desafío Semanal: 50km",
    description: "Completa 50km en cualquier combinación de deportes durante esta semana",
    type: "INDIVIDUAL" as const,
    difficulty: "MEDIUM" as const,
    points: 200,
    target: { distance: 50, unit: "km" },
    duration: 7, // días
    startDate: new Date('2024-10-21'),
    endDate: new Date('2024-10-28'),
    isActive: true,
    category: "distance"
  },
  {
    id: "challenge_2", 
    title: "Maratón de Natación",
    description: "Nada un total de 5km durante el mes",
    type: "INDIVIDUAL" as const,
    difficulty: "HARD" as const,
    points: 350,
    target: { distance: 5, unit: "km", sport: "SWIMMING" },
    duration: 30,
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-10-31'),
    isActive: true,
    category: "sport_specific"
  },
  {
    id: "challenge_3",
    title: "Constancia Semanal",
    description: "Entrena al menos 4 días esta semana",
    type: "INDIVIDUAL" as const,
    difficulty: "EASY" as const,
    points: 100,
    target: { workouts: 4, unit: "sessions" },
    duration: 7,
    startDate: new Date('2024-10-21'),
    endDate: new Date('2024-10-28'),
    isActive: true,
    category: "frequency"
  },
  {
    id: "challenge_4",
    title: "Desafío del Club: 1000km",
    description: "Entre todos los miembros del club, completemos 1000km este mes",
    type: "CLUB" as const,
    difficulty: "EPIC" as const,
    points: 500,
    target: { distance: 1000, unit: "km", collective: true },
    duration: 30,
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-10-31'),
    isActive: true,
    category: "club_collective"
  }
]

export const challengesRouter = createTRPCRouter({
  // Obtener desafíos disponibles
  getAvailableChallenges: protectedProcedure
    .input(z.void().optional())
    .query(async ({ ctx }) => {
    // Primero intentamos obtener de la base de datos
    const dbChallenges = await ctx.prisma.challenge.findMany({
      where: { isActive: true },
      include: {
        participants: {
          where: { userId: ctx.session.user.id },
          select: { 
            id: true, 
            progress: true, 
            completed: true, 
            completedAt: true,
            points: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Si no hay desafíos en DB, usar mock data
    if (dbChallenges.length === 0) {
      return mockChallenges.map((challenge: any) => ({
        ...challenge,
        userParticipation: null, // Usuario no está participando aún
        progress: 0,
        isCompleted: false,
        canJoin: true
      }))
    }

    return dbChallenges.map(challenge => ({
      ...challenge,
      userParticipation: challenge.participants[0] || null,
      progress: challenge.participants[0]?.progress || 0,
      isCompleted: challenge.participants[0]?.completed || false,
      canJoin: challenge.participants.length === 0
    }))
  }),

  // Obtener desafíos del usuario
  getUserChallenges: protectedProcedure
    .input(z.void().optional())
    .query(async ({ ctx }) => {
    const userChallenges = await ctx.prisma.userChallenge.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        challenge: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Si no hay participaciones, simular con mock data
    if (userChallenges.length === 0) {
      return [
        {
          id: "user_challenge_1",
          challengeId: "challenge_1",
          challenge: mockChallenges[0],
          progress: { distance: 32.5, percentage: 65 },
          completed: false,
          completedAt: null,
          points: 0,
          createdAt: new Date('2024-10-21')
        },
        {
          id: "user_challenge_2",
          challengeId: "challenge_3", 
          challenge: mockChallenges[2],
          progress: { workouts: 3, percentage: 75 },
          completed: false,
          completedAt: null,
          points: 0,
          createdAt: new Date('2024-10-21')
        }
      ]
    }

    return userChallenges
  }),

  // Unirse a un desafío
  joinChallenge: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { challengeId } = input

      // Verificar si el desafío existe
      let challenge = await ctx.prisma.challenge.findUnique({
        where: { id: challengeId }
      })

      // Si no existe en DB, crear desde mock data
      if (!challenge) {
        const mockChallenge = mockChallenges.find(c => c.id === challengeId)
        if (!mockChallenge) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Challenge not found' })
        }

        challenge = await ctx.prisma.challenge.create({
          data: {
            id: mockChallenge.id,
            title: mockChallenge.title,
            description: mockChallenge.description,
            type: mockChallenge.type,
            difficulty: mockChallenge.difficulty,
            points: mockChallenge.points,
            target: mockChallenge.target as any,
            duration: mockChallenge.duration,
            startDate: mockChallenge.startDate,
            endDate: mockChallenge.endDate,
            isActive: mockChallenge.isActive,
          }
        })
      }

      // Verificar si ya está participando
      const existingParticipation = await ctx.prisma.userChallenge.findUnique({
        where: {
          userId_challengeId: {
            userId: ctx.session.user.id,
            challengeId: challengeId
          }
        }
      })

      if (existingParticipation) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Already participating in this challenge' })
      }

      // Crear participación
      const userChallenge = await ctx.prisma.userChallenge.create({
        data: {
          userId: ctx.session.user.id,
          challengeId: challengeId,
          progress: {},
          completed: false,
          points: 0,
        },
        include: {
          challenge: true
        }
      })

      return userChallenge
    }),

  // Actualizar progreso de desafío (simulado)
  updateProgress: protectedProcedure
    .input(z.object({ 
      challengeId: z.string(),
      progress: z.record(z.string(), z.any())
    }))
    .mutation(async ({ ctx, input }) => {
      const { challengeId, progress } = input

      // Buscar la participación del usuario
      const userChallenge = await ctx.prisma.userChallenge.findUnique({
        where: {
          userId_challengeId: {
            userId: ctx.session.user.id,
            challengeId: challengeId
          }
        },
        include: { challenge: true }
      })

      if (!userChallenge) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Not participating in this challenge' })
      }

      // Verificar si se completó el desafío
      const target = userChallenge.challenge.target as any
      let completed = false
      let pointsEarned = 0

      if (target.distance && (progress.distance as number) >= target.distance) {
        completed = true
        pointsEarned = userChallenge.challenge.points
      } else if (target.workouts && (progress.workouts as number) >= target.workouts) {
        completed = true
        pointsEarned = userChallenge.challenge.points
      }

      // Actualizar progreso
      const updatedChallenge = await ctx.prisma.userChallenge.update({
        where: {
          userId_challengeId: {
            userId: ctx.session.user.id,
            challengeId: challengeId
          }
        },
        data: {
          progress: progress,
          completed: completed,
          completedAt: completed ? new Date() : null,
          points: pointsEarned,
        }
      })

      // Si se completó, agregar puntos al usuario
      if (completed && pointsEarned > 0) {
        await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { points: { increment: pointsEarned } }
        })

        await ctx.prisma.pointsHistory.create({
          data: {
            userId: ctx.session.user.id,
            points: pointsEarned,
            type: 'CHALLENGE',
            description: `Desafío completado: ${userChallenge.challenge.title}`,
            reference: challengeId,
          }
        })
      }

      return {
        userChallenge: updatedChallenge,
        completed,
        pointsEarned
      }
    }),
})
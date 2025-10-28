import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'

export const pointsRouter = createTRPCRouter({
  getBalance: protectedProcedure
    .input(z.void().optional())
    .query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { points: true },
    })

    return user?.points || 0
  }),

  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input

      const history = await ctx.prisma.pointsHistory.findMany({
        where: { userId: ctx.session.user.id },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (history.length > limit) {
        const nextItem = history.pop()
        nextCursor = nextItem!.id
      }

      return {
        items: history,
        nextCursor,
      }
    }),

  addPoints: protectedProcedure
    .input(
      z.object({
        points: z.number().positive(),
        type: z.enum(['WORKOUT', 'CHALLENGE', 'INVITE', 'SALE', 'REVIEW', 'BONUS']),
        description: z.string(),
        reference: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { points, type, description, reference } = input

      // Update user points
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          points: {
            increment: points,
          },
        },
      })

      // Create points history record
      await ctx.prisma.pointsHistory.create({
        data: {
          userId: ctx.session.user.id,
          points,
          type,
          description,
          reference,
        },
      })

      return {
        newBalance: updatedUser.points,
        pointsAdded: points,
      }
    }),

  spendPoints: protectedProcedure
    .input(
      z.object({
        points: z.number().positive(),
        description: z.string(),
        reference: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { points, description, reference } = input

      // Check if user has enough points
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { points: true },
      })

      if (!user || user.points < points) {
        throw new Error('Insufficient points')
      }

      // Update user points
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          points: {
            decrement: points,
          },
        },
      })

      // Create points history record
      await ctx.prisma.pointsHistory.create({
        data: {
          userId: ctx.session.user.id,
          points: -points,
          type: 'BONUS', // We'll use BONUS for spending for now
          description,
          reference,
        },
      })

      return {
        newBalance: updatedUser.points,
        pointsSpent: points,
      }
    }),
})
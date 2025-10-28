import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/lib/trpc'
import bcrypt from 'bcryptjs'
import { TRPCError } from '@trpc/server'

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        inviteCode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password, firstName, lastName, inviteCode } = input

      // Check if user already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        })
      }

      // Validate invite code if provided
      if (inviteCode) {
        const validCodes = ['TRICLUB2024', 'ELITE123', 'GARMIN456', 'BUENOS789']
        if (!validCodes.includes(inviteCode.toUpperCase())) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid invite code',
          })
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          inviteCode,
          points: inviteCode ? 500 : 0, // Bonus points for invited users
        },
      })

      // Create initial points history
      if (inviteCode) {
        await ctx.prisma.pointsHistory.create({
          data: {
            userId: user.id,
            points: 500,
            type: 'BONUS',
            description: 'Bonus de bienvenida por invitación',
          },
        })
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      }
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        city: true,
        club: true,
        bio: true,
        level: true,
        points: true,
        image: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    return user
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        city: z.string().optional(),
        club: z.string().optional(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...input,
          name: input.firstName && input.lastName 
            ? `${input.firstName} ${input.lastName}` 
            : undefined,
        },
      })

      return updatedUser
    }),
})
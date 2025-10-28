import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/lib/trpc'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'

// Función para generar código de invitación único
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const invitationsRouter = createTRPCRouter({
  // Crear nueva invitación
  createInvitation: protectedProcedure
    .input(z.object({
      email: z.string().email().optional(),
      message: z.string().optional(),
      expiresInDays: z.number().min(1).max(30).default(7),
      maxUses: z.number().min(1).max(10).default(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { email, message, expiresInDays, maxUses } = input

      // Verificar que el usuario existe
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado'
        })
      }

      // Generar código único
      let code: string
      let attempts = 0
      do {
        code = generateInviteCode()
        const existing = await ctx.prisma.invitation.findUnique({
          where: { code }
        })
        if (!existing) break
        attempts++
      } while (attempts < 10)

      if (attempts >= 10) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo generar un código único'
        })
      }

      // Calcular fecha de expiración
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiresInDays)

      // Crear invitación
      const invitation = await ctx.prisma.invitation.create({
        data: {
          code,
          email,
          senderId: userId,
          senderName: user.name || user.email,
          message,
          maxUses,
          expiresAt,
          status: 'PENDING'
        },
        include: {
          sender: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      return {
        invitation,
        message: 'Invitación creada exitosamente'
      }
    }),

  // Validar código de invitación
  validateInviteCode: publicProcedure
    .input(z.object({
      code: z.string().min(6).max(10)
    }))
    .query(async ({ ctx, input }) => {
      const { code } = input

      const invitation = await ctx.prisma.invitation.findUnique({
        where: { code },
        include: {
          sender: {
            select: {
              name: true,
              email: true,
              club: true
            }
          }
        }
      })

      if (!invitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Código de invitación no válido'
        })
      }

      // Verificar si está expirado
      if (invitation.expiresAt < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El código de invitación ha expirado'
        })
      }

      // Verificar si ya se usó el máximo de veces
      if (invitation.currentUses >= invitation.maxUses) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El código de invitación ya fue utilizado'
        })
      }

      // Verificar estado
      if (invitation.status !== 'PENDING') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El código de invitación no está disponible'
        })
      }

      return {
        valid: true,
        invitation: {
          id: invitation.id,
          code: invitation.code,
          senderName: invitation.senderName,
          message: invitation.message,
          sender: invitation.sender,
          expiresAt: invitation.expiresAt
        }
      }
    }),

  // Registrar usuario con código de invitación
  registerWithInvite: publicProcedure
    .input(z.object({
      inviteCode: z.string().min(6).max(10),
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      phone: z.string().optional(),
      city: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { inviteCode, email, password, firstName, lastName, phone, city } = input

      // Verificar que el email no esté en uso
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'El email ya está registrado'
        })
      }

      // Validar código de invitación
      const invitation = await ctx.prisma.invitation.findUnique({
        where: { code: inviteCode },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              club: true
            }
          }
        }
      })

      if (!invitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Código de invitación no válido'
        })
      }

      if (invitation.expiresAt < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El código de invitación ha expirado'
        })
      }

      if (invitation.currentUses >= invitation.maxUses) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El código de invitación ya fue utilizado'
        })
      }

      if (invitation.status !== 'PENDING') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El código de invitación no está disponible'
        })
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 12)

      // Generar código de invitación para el nuevo usuario
      let newUserInviteCode: string
      let attempts = 0
      do {
        newUserInviteCode = generateInviteCode()
        const existing = await ctx.prisma.invitation.findUnique({
          where: { code: newUserInviteCode }
        })
        if (!existing) {
          const existingUser = await ctx.prisma.user.findUnique({
            where: { inviteCode: newUserInviteCode }
          })
          if (!existingUser) break
        }
        attempts++
      } while (attempts < 10)

      // Crear usuario en transacción
      const result = await ctx.prisma.$transaction(async (tx) => {
        // Crear usuario
        const newUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
            firstName,
            lastName,
            phone,
            city,
            club: invitation.sender.club || 'TriClub Argentina',
            inviteCode: newUserInviteCode,
            invitedBy: invitation.senderId,
            points: 100, // Puntos de bienvenida
            level: 'BEGINNER'
          }
        })

        // Actualizar invitación
        await tx.invitation.update({
          where: { id: invitation.id },
          data: {
            receiverId: newUser.id,
            currentUses: invitation.currentUses + 1,
            usedAt: new Date(),
            status: invitation.currentUses + 1 >= invitation.maxUses ? 'USED' : 'PENDING'
          }
        })

        // Dar puntos al invitador
        await tx.user.update({
          where: { id: invitation.senderId },
          data: {
            points: {
              increment: 200 // Puntos por invitar
            }
          }
        })

        // Crear registro de puntos para el invitador
        await tx.pointsHistory.create({
          data: {
            userId: invitation.senderId,
            points: 200,
            type: 'INVITE',
            description: `Invitación exitosa de ${firstName} ${lastName}`,
            reference: newUser.id
          }
        })

        // Crear registro de puntos de bienvenida
        await tx.pointsHistory.create({
          data: {
            userId: newUser.id,
            points: 100,
            type: 'BONUS',
            description: 'Puntos de bienvenida',
            reference: invitation.id
          }
        })

        return newUser
      })

      return {
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
          club: result.club,
          points: result.points,
          inviteCode: result.inviteCode
        },
        message: 'Usuario registrado exitosamente'
      }
    }),

  // Obtener invitaciones del usuario
  getUserInvitations: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { limit, offset } = input

      const [invitations, total] = await Promise.all([
        ctx.prisma.invitation.findMany({
          where: { senderId: userId },
          include: {
            receiver: {
              select: {
                name: true,
                email: true,
                createdAt: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset
        }),
        ctx.prisma.invitation.count({
          where: { senderId: userId }
        })
      ])

      return {
        invitations,
        total,
        hasMore: offset + limit < total
      }
    }),

  // Obtener estadísticas de invitaciones
  getInviteStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const [totalSent, totalUsed, totalPending, totalExpired] = await Promise.all([
        ctx.prisma.invitation.count({
          where: { senderId: userId }
        }),
        ctx.prisma.invitation.count({
          where: { 
            senderId: userId,
            status: 'USED'
          }
        }),
        ctx.prisma.invitation.count({
          where: { 
            senderId: userId,
            status: 'PENDING',
            expiresAt: { gt: new Date() }
          }
        }),
        ctx.prisma.invitation.count({
          where: { 
            senderId: userId,
            OR: [
              { status: 'EXPIRED' },
              { 
                status: 'PENDING',
                expiresAt: { lt: new Date() }
              }
            ]
          }
        })
      ])

      // Obtener invitados recientes
      const recentInvitees = await ctx.prisma.user.findMany({
        where: { invitedBy: userId },
        select: {
          name: true,
          email: true,
          createdAt: true,
          points: true,
          level: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })

      return {
        stats: {
          totalSent,
          totalUsed,
          totalPending,
          totalExpired,
          successRate: totalSent > 0 ? Math.round((totalUsed / totalSent) * 100) : 0
        },
        recentInvitees
      }
    })
})
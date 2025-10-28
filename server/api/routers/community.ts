import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/lib/trpc'
import { TRPCError } from '@trpc/server'

export const communityRouter = createTRPCRouter({
  // Obtener posts de la comunidad
  getPosts: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ ctx, input }) => {
      const { limit, offset } = input

      const [posts, total] = await Promise.all([
        ctx.prisma.communityPost.findMany({
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                name: true,
                club: true,
                level: true,
                image: true
              }
            },
            _count: {
              select: {
                likes: true,
                comments: true
              }
            }
          }
        }),
        ctx.prisma.communityPost.count()
      ])

      return {
        posts: posts.map(post => ({
          ...post,
          likesCount: post._count.likes,
          commentsCount: post._count.comments
        })),
        total,
        hasMore: offset + limit < total
      }
    }),

  // Crear nuevo post
  createPost: protectedProcedure
    .input(z.object({
      content: z.string().min(1).max(1000),
      imageUrl: z.string().optional(),
      location: z.string().optional(),
      achievement: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { content, imageUrl, location, achievement } = input

      const post = await ctx.prisma.communityPost.create({
        data: {
          authorId: userId,
          content,
          imageUrl,
          location,
          achievement
        },
        include: {
          author: {
            select: {
              name: true,
              club: true,
              level: true,
              image: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      })

      return {
        ...post,
        likesCount: post._count.likes,
        commentsCount: post._count.comments
      }
    }),

  // Dar like a un post
  toggleLike: protectedProcedure
    .input(z.object({
      postId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { postId } = input

      // Verificar si ya existe el like
      const existingLike = await ctx.prisma.postLike.findUnique({
        where: {
          postId_authorId: {
            postId,
            authorId: userId
          }
        }
      })

      if (existingLike) {
        // Remover like
        await ctx.prisma.postLike.delete({
          where: { id: existingLike.id }
        })
        return { liked: false, message: 'Like removido' }
      } else {
        // Agregar like
        await ctx.prisma.postLike.create({
          data: {
            postId,
            authorId: userId
          }
        })
        return { liked: true, message: 'Like agregado' }
      }
    }),

  // Obtener comentarios de un post
  getComments: publicProcedure
    .input(z.object({
      postId: z.string(),
      limit: z.number().min(1).max(50).default(20)
    }))
    .query(async ({ ctx, input }) => {
      const { postId, limit } = input

      const comments = await ctx.prisma.postComment.findMany({
        where: { postId },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              name: true,
              club: true,
              image: true
            }
          }
        }
      })

      return comments
    }),

  // Agregar comentario
  addComment: protectedProcedure
    .input(z.object({
      postId: z.string(),
      content: z.string().min(1).max(500)
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { postId, content } = input

      const comment = await ctx.prisma.postComment.create({
        data: {
          postId,
          authorId: userId,
          content
        },
        include: {
          author: {
            select: {
              name: true,
              club: true,
              image: true
            }
          }
        }
      })

      return comment
    }),

  // Obtener ranking de usuarios
  getLeaderboard: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10)
    }))
    .query(async ({ ctx, input }) => {
      const { limit } = input

      const users = await ctx.prisma.user.findMany({
        take: limit,
        orderBy: { points: 'desc' },
        select: {
          id: true,
          name: true,
          club: true,
          points: true,
          level: true,
          image: true
        }
      })

      return users.map((user, index) => ({
        ...user,
        rank: index + 1
      }))
    }),

  // Obtener eventos de la comunidad
  getEvents: publicProcedure
    .input(z.object({
      upcoming: z.boolean().default(true),
      limit: z.number().min(1).max(50).default(10)
    }))
    .query(async ({ ctx, input }) => {
      const { upcoming, limit } = input

      const events = await ctx.prisma.communityEvent.findMany({
        where: upcoming ? {
          date: { gte: new Date() }
        } : undefined,
        take: limit,
        orderBy: { date: 'asc' },
        include: {
          _count: {
            select: { participants: true }
          }
        }
      })

      return events.map(event => ({
        ...event,
        participantsCount: event._count.participants
      }))
    }),

  // Unirse a un evento
  joinEvent: protectedProcedure
    .input(z.object({
      eventId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { eventId } = input

      // Verificar si el evento existe
      const event = await ctx.prisma.communityEvent.findUnique({
        where: { id: eventId },
        include: {
          _count: { select: { participants: true } }
        }
      })

      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Evento no encontrado'
        })
      }

      // Verificar si hay cupo
      if (event.maxParticipants && event._count.participants >= event.maxParticipants) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El evento está lleno'
        })
      }

      // Verificar si ya está inscrito
      const existingParticipant = await ctx.prisma.eventParticipant.findUnique({
        where: {
          eventId_userId: {
            eventId,
            userId
          }
        }
      })

      if (existingParticipant) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ya estás inscrito en este evento'
        })
      }

      // Inscribir al usuario
      await ctx.prisma.eventParticipant.create({
        data: {
          eventId,
          userId
        }
      })

      return { message: 'Te has unido al evento exitosamente' }
    }),

  // Obtener estadísticas de la comunidad
  getCommunityStats: publicProcedure
    .query(async ({ ctx }) => {
      const [
        totalMembers,
        postsToday,
        eventsThisMonth,
        totalPosts
      ] = await Promise.all([
        ctx.prisma.user.count({
          where: { isActive: true }
        }),
        ctx.prisma.communityPost.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        ctx.prisma.communityEvent.count({
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            }
          }
        }),
        ctx.prisma.communityPost.count()
      ])

      return {
        totalMembers,
        postsToday,
        eventsThisMonth,
        totalPosts
      }
    }),

  // Obtener actividad del usuario en la comunidad
  getUserActivity: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const [
        postsCount,
        likesReceived,
        commentsCount,
        eventsJoined
      ] = await Promise.all([
        ctx.prisma.communityPost.count({
          where: { authorId: userId }
        }),
        ctx.prisma.postLike.count({
          where: {
            post: { authorId: userId }
          }
        }),
        ctx.prisma.postComment.count({
          where: { authorId: userId }
        }),
        ctx.prisma.eventParticipant.count({
          where: { userId }
        })
      ])

      return {
        postsCount,
        likesReceived,
        commentsCount,
        eventsJoined
      }
    })
})
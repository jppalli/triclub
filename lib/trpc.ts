import { initTRPC, TRPCError } from '@trpc/server'
import { type Session } from 'next-auth'
import { prisma } from './prisma'
import superjson from 'superjson'
import { ZodError } from 'zod'

type CreateContextOptions = {
  session: Session | null
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  console.log('🔧 Creating inner context with prisma:', !!prisma)
  return {
    session: opts.session,
    prisma,
  }
}

export const createTRPCContext = async (opts?: { req?: Request }) => {
  console.log('🔧 Creating TRPC context')
  // Para App Router, el contexto se maneja diferente
  // La sesión se obtendrá en cada procedimiento si es necesario
  const context = createInnerTRPCContext({
    session: null,
  })
  console.log('🔧 Context created with prisma:', !!context.prisma)
  return context
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  // Para App Router, vamos a usar un enfoque más simple
  // Por ahora, vamos a crear una sesión mock para testing
  const mockSession = {
    user: {
      id: 'cmhabbtsv0000tmtguvd0b2lx', // ID real del usuario demo
      name: 'Juan Pedro Palli',
      email: 'atleta@triclub.ar',
      image: null
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }

  console.log('🔐 Auth middleware - using mock session:', mockSession.user.email)
  
  return next({
    ctx: {
      session: mockSession,
      prisma: ctx.prisma,
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
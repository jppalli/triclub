import { createTRPCRouter } from '@/lib/trpc'
import { authRouter } from './routers/auth'
import { pointsRouter } from './routers/points'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  points: pointsRouter,
})

export type AppRouter = typeof appRouter
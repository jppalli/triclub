import { createTRPCRouter } from '@/lib/trpc'
import { authRouter } from './routers/auth'
import { pointsRouter } from './routers/points'
import { workoutsRouter } from './routers/workouts'
import { challengesRouter } from './routers/challenges'
import { storeRouter } from './routers/store'
import { invitationsRouter } from './routers/invitations'
import { communityRouter } from './routers/community'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  points: pointsRouter,
  workouts: workoutsRouter,
  challenges: challengesRouter,
  store: storeRouter,
  invitations: invitationsRouter,
  community: communityRouter,
})

export type AppRouter = typeof appRouter
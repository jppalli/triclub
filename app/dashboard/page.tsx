'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatsCards from '@/components/dashboard/StatsCards'
import ChallengesSection from '@/components/dashboard/ChallengesSection'
import PointsOverview from '@/components/dashboard/PointsOverview'
import RecentWorkouts from '@/components/dashboard/RecentWorkouts'
import GarminSync from '@/components/dashboard/GarminSync'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [userStats, setUserStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user) {
      loadUserStats()
    }
  }, [session, status, router])

  const loadUserStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/stats')
      
      if (response.ok) {
        const stats = await response.json()
        setUserStats(stats)
        setUser({
          id: 1, // Para compatibilidad con la interfaz
          name: stats.name || 'Usuario',
          email: stats.email || '',
          club: stats.club,
          points: stats.points,
          level: stats.level,
          avatar: stats.avatar
        })
      } else {
        // Fallback a datos de sesión si la API falla
        setUser({
          id: 1,
          name: session?.user?.name || 'Usuario',
          email: session?.user?.email || '',
          club: 'TriClub Principiante',
          points: 0,
          level: 'Principiante',
          avatar: session?.user?.image || '/avatar-placeholder.jpg'
        })
      }
    } catch (error) {
      console.error('Error loading user stats:', error)
      // Fallback a datos básicos
      setUser({
        id: 1,
        name: session?.user?.name || 'Usuario',
        email: session?.user?.email || '',
        club: 'TriClub Principiante',
        points: 0,
        level: 'Principiante',
        avatar: session?.user?.image || '/avatar-placeholder.jpg'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            ¡Hola, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-300">
            Bienvenido a tu dashboard. Aquí puedes ver tu progreso y actividades recientes.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards user={user} userStats={userStats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Workouts */}
          <div className="lg:col-span-2 space-y-8">
            <RecentWorkouts />
          </div>

          {/* Right Column - Garmin Sync, Points & Challenges */}
          <div className="space-y-8">
            <GarminSync />
            <PointsOverview user={user} userStats={userStats} />
            <ChallengesSection userStats={userStats} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
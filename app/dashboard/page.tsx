'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatsCards from '@/components/dashboard/StatsCards'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import ChallengesSection from '@/components/dashboard/ChallengesSection'
import PointsOverview from '@/components/dashboard/PointsOverview'

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
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('triclub_user')
    if (!userData) {
      router.push('/login/')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) {
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
        <StatsCards user={user} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>

          {/* Right Column - Points & Challenges */}
          <div className="space-y-8">
            <PointsOverview user={user} />
            <ChallengesSection />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
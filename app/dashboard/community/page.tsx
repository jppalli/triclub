'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Users, Wrench } from 'lucide-react'
import { calculateUserStats } from '@/lib/stats-calculator'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user) {
      const stats = calculateUserStats('cmhabbtsv0000tmtguvd0b2lx')
      setUser({
        id: 1,
        name: session.user.name || 'Usuario',
        email: session.user.email || '',
        club: `TriClub ${stats.level}`,
        points: stats.totalPoints,
        level: stats.level,
        avatar: session.user.image || '/avatar-placeholder.jpg'
      })
    }
  }, [session, status, router])

  if (status === 'loading' || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-slate-700/50 rounded-full p-4">
              <Wrench className="h-12 w-12 text-slate-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Comunidad</h1>
          <p className="text-slate-400 text-lg mb-2">En desarrollo</p>
          <p className="text-slate-500 max-w-md mx-auto">
            Estamos trabajando para crear una comunidad vibrante donde puedas conectarte 
            con otros triatletas, compartir experiencias y participar en eventos.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
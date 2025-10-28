'use client'

import { motion } from 'framer-motion'
import { Activity, Target, Trophy, TrendingUp } from 'lucide-react'
import { calculateUserStats, calculatePercentageChange } from '@/lib/stats-calculator'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

interface StatsCardsProps {
  user: User
  userStats?: any // Stats del usuario desde la API
}

export default function StatsCards({ user, userStats }: StatsCardsProps) {
  // Usar stats del usuario o fallback a datos vacíos
  const stats = userStats || {
    totalWorkouts: 0,
    totalDistance: 0,
    totalDuration: 0,
    thisMonthWorkouts: 0,
    thisMonthDistance: 0,
    thisMonthDuration: 0,
    lastMonthWorkouts: 0,
    lastMonthDistance: 0,
    lastMonthDuration: 0
  }

  const statsData = [
    {
      name: 'Entrenamientos',
      value: stats.totalWorkouts.toString(),
      change: stats.thisMonthWorkouts > 0 
        ? `${stats.thisMonthWorkouts} este mes` 
        : 'Sin entrenamientos este mes',
      changeType: stats.thisMonthWorkouts >= stats.lastMonthWorkouts ? 'positive' as const : 'negative' as const,
      icon: Activity,
      color: 'text-primary-500'
    },
    {
      name: 'Distancia Total',
      value: `${stats.totalDistance.toFixed(1)} km`,
      change: stats.thisMonthDistance > 0 
        ? `${stats.thisMonthDistance.toFixed(1)}km este mes`
        : 'Sin distancia este mes',
      changeType: stats.thisMonthDistance >= stats.lastMonthDistance ? 'positive' as const : 'negative' as const,
      icon: Target,
      color: 'text-accent-500'
    },
    {
      name: 'Ranking del Club',
      value: `#${stats.rankingPosition}`,
      change: stats.level,
      changeType: 'positive' as const,
      icon: Trophy,
      color: 'text-primary-500'
    },
    {
      name: 'Tiempo Total',
      value: `${stats.totalDuration.toFixed(1)}h`,
      change: stats.thisMonthDuration > 0 
        ? `${stats.thisMonthDuration.toFixed(1)}h este mes`
        : 'Sin tiempo este mes',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-accent-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
          
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.change}
            </span>
            <span className="text-slate-400 text-sm ml-2">vs mes anterior</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
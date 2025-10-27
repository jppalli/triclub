'use client'

import { motion } from 'framer-motion'
import { Activity, Target, Trophy, TrendingUp } from 'lucide-react'

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
}

const stats = [
  {
    name: 'Entrenamientos',
    value: '47',
    change: '+12%',
    changeType: 'positive',
    icon: Activity,
    color: 'text-primary-500'
  },
  {
    name: 'Desafíos Completados',
    value: '8',
    change: '+25%',
    changeType: 'positive',
    icon: Target,
    color: 'text-accent-500'
  },
  {
    name: 'Ranking del Club',
    value: '#3',
    change: '+2',
    changeType: 'positive',
    icon: Trophy,
    color: 'text-primary-500'
  },
  {
    name: 'Progreso Mensual',
    value: '85%',
    change: '+15%',
    changeType: 'positive',
    icon: TrendingUp,
    color: 'text-accent-500'
  }
]

export default function StatsCards({ user }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
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
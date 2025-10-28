'use client'

import { motion } from 'framer-motion'
import { Star, Gift, TrendingUp, ArrowRight } from 'lucide-react'
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

interface PointsOverviewProps {
  user: User
  userStats?: any
}

// Función para calcular próximas recompensas basadas en puntos actuales
const getNextRewards = (currentPoints: number) => {
  const rewards = [
    { name: 'Descuento Garmin 10%', points: 1000 },
    { name: 'Camiseta TriClub', points: 2500 },
    { name: 'Producto Gratis', points: 5000 },
    { name: 'Reloj Garmin', points: 10000 },
    { name: 'Bicicleta Premium', points: 25000 }
  ]
  
  return rewards
    .filter(reward => reward.points > currentPoints)
    .slice(0, 2)
    .map(reward => ({
      ...reward,
      progress: Math.min((currentPoints / reward.points) * 100, 100)
    }))
}

export default function PointsOverview({ user, userStats }: PointsOverviewProps) {
  // Usar puntos del usuario real
  const totalPoints = user.points || 0
  const thisMonthPoints = userStats?.thisMonthPoints || 0
  
  // Obtener próximas recompensas
  const nextRewards = getNextRewards(totalPoints)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Mis Puntos</h2>
        <Star className="h-6 w-6 text-accent-500" />
      </div>

      {/* Current Points */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white mb-2">
          {totalPoints.toLocaleString()}
        </div>
        <div className="text-slate-400">Puntos totales</div>
        
        {thisMonthPoints > 0 && (
          <div className="flex items-center justify-center gap-2 mt-3 text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">+{thisMonthPoints} este mes</span>
          </div>
        )}
      </div>

      {/* Progress to Next Rewards */}
      <div className="space-y-4 mb-6">
        <h3 className="text-white font-medium">Próximas Recompensas</h3>
        
        {nextRewards.map((reward, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">{reward.name}</span>
              <span className="text-slate-400">{reward.points} pts</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${reward.progress}%` }}
              />
            </div>
            <div className="text-xs text-slate-400">
              {reward.progress}% completado
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <a href="/dashboard/store" className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 rounded-xl font-medium hover:from-primary-700 hover:to-accent-700 transition-all flex items-center justify-center gap-2">
          <Gift className="h-4 w-4" />
          Ver Recompensas
        </a>
        
        <button className="w-full border border-slate-600 text-slate-300 py-3 rounded-xl font-medium hover:border-slate-500 hover:text-white transition-all flex items-center justify-center gap-2">
          Historial de Puntos
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
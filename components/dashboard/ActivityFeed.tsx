'use client'

import { motion } from 'framer-motion'
import { Activity, MapPin, Clock, Zap, Trophy, Target } from 'lucide-react'
import { getUserGarminActivities } from '@/lib/garmin-mock-data'

// Función para generar feed de actividades basado en entrenamientos reales
const generateActivityFeed = (userId?: string) => {
  // Si no hay userId, devolver array vacío
  if (!userId) {
    return []
  }
  
  const workouts = getUserGarminActivities(userId)
  
  // Convertir entrenamientos a formato de actividades
  const workoutActivities = workouts.slice(0, 4).map((workout, index) => {
    const daysAgo = index
    const timestamp = daysAgo === 0 ? 'Hace unas horas' : 
                     daysAgo === 1 ? 'Ayer' : 
                     `Hace ${daysAgo} días`
    
    return {
      id: workout.id,
      type: 'workout',
      title: workout.title,
      description: workout.distance ? `${workout.distance.toFixed(1)}km` : `${workout.duration} min`,
      time: `${workout.duration} min`,
      location: workout.location || 'Ubicación no especificada',
      points: workout.points,
      timestamp,
      icon: Activity,
      color: workout.type === 'SWIMMING' ? 'text-blue-500' : 
             workout.type === 'CYCLING' ? 'text-green-500' : 
             workout.type === 'RUNNING' ? 'text-orange-500' : 'text-primary-500'
    }
  })
  
  // Agregar algunas actividades de logros basadas en datos reales
  const totalPoints = workouts.reduce((sum, w) => sum + w.points, 0)
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0)
  
  const achievements = []
  
  if (totalPoints >= 5000) {
    // Calcular cuándo se alcanzó el nivel Elite (basado en el último entrenamiento que llevó a 5000+ puntos)
    let pointsAccumulated = 0
    let achievementDate = 'Recientemente'
    
    for (let i = workouts.length - 1; i >= 0; i--) {
      pointsAccumulated += workouts[i].points
      if (pointsAccumulated >= 5000) {
        const daysAgo = Math.floor((new Date().getTime() - new Date(workouts[i].createdAt).getTime()) / (1000 * 60 * 60 * 24))
        achievementDate = daysAgo === 0 ? 'Hoy' : 
                         daysAgo === 1 ? 'Ayer' : 
                         daysAgo <= 7 ? 'Esta semana' : 
                         `Hace ${daysAgo} días`
        break
      }
    }
    
    achievements.push({
      id: 'achievement_elite',
      type: 'achievement',
      title: 'Nivel Elite Alcanzado',
      description: `${totalPoints} puntos totales`,
      time: '',
      location: '',
      points: 500,
      timestamp: achievementDate,
      icon: Trophy,
      color: 'text-yellow-500'
    })
  }
  
  return [...workoutActivities, ...achievements].slice(0, 5)
}

interface ActivityFeedProps {
  userId?: string
}

export default function ActivityFeed({ userId }: ActivityFeedProps) {
  const activities = generateActivityFeed(userId)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Actividad Reciente</h2>
        <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
          Ver todo
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
          >
            <div className={`p-2 rounded-lg bg-slate-700 ${activity.color}`}>
              <activity.icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{activity.title}</h3>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-accent-500" />
                  <span className="text-accent-500 font-medium">+{activity.points}</span>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm mt-1">{activity.description}</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>{activity.timestamp}</span>
                {activity.time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{activity.time}</span>
                  </div>
                )}
                {activity.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{activity.location}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-slate-400 hover:text-white text-sm transition-colors">
          Cargar más actividades
        </button>
      </div>
    </motion.div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Clock, MapPin, Heart, Zap, User } from 'lucide-react'

const workoutTypeIcons = {
  SWIMMING: '🏊‍♂️',
  CYCLING: '🚴‍♂️',
  RUNNING: '🏃‍♂️',
  TRIATHLON: '🏆',
  STRENGTH: '💪',
  OTHER: '🏋️‍♂️'
}

const workoutTypeColors = {
  SWIMMING: 'text-blue-400',
  CYCLING: 'text-green-400',
  RUNNING: 'text-orange-400',
  TRIATHLON: 'text-purple-400',
  STRENGTH: 'text-red-400',
  OTHER: 'text-gray-400'
}

interface Workout {
  id: string
  userId: string
  user: {
    name: string
    email: string
    image?: string
  }
  title: string
  description?: string
  type: string
  duration: number
  distance?: number
  calories?: number
  avgPace?: string
  heartRate?: number
  location?: string
  points: number
  createdAt: string
}

export default function RecentWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecentWorkouts()
  }, [])

  const loadRecentWorkouts = async () => {
    setIsLoading(true)
    try {
      // Cargar más entrenamientos para poder filtrar por mes
      const response = await fetch('/api/workouts/recent?limit=50')
      const data = await response.json()
      
      if (data.success) {
        // Filtrar entrenamientos del mes actual
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        
        const thisMonthWorkouts = (data.workouts || []).filter((workout: Workout) => {
          const workoutDate = new Date(workout.createdAt)
          return workoutDate.getMonth() === currentMonth && workoutDate.getFullYear() === currentYear
        })
        
        // Tomar solo los 5 más recientes del mes
        setWorkouts(thisMonthWorkouts.slice(0, 5))
      }
    } catch (error) {
      console.error('Error loading recent workouts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getWorkoutTypeText = (type: string) => {
    switch (type) {
      case 'RUNNING': return 'Running'
      case 'CYCLING': return 'Ciclismo'
      case 'SWIMMING': return 'Natación'
      case 'TRIATHLON': return 'Triatlón'
      case 'STRENGTH': return 'Fuerza'
      case 'OTHER': return 'Otro'
      default: return type
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const calculatePoints = (workout: Workout) => {
    // Calcular puntos basado en tipo y duración
    let points = 0
    switch (workout.type) {
      case 'RUNNING':
        points = Math.floor(workout.duration / 10) * 5
        break
      case 'CYCLING':
        points = Math.floor(workout.duration / 15) * 5
        break
      case 'SWIMMING':
        points = Math.floor(workout.duration / 5) * 5
        break
      case 'TRIATHLON':
        points = Math.floor(workout.duration / 8) * 10
        break
      default:
        points = Math.floor(workout.duration / 12) * 5
    }
    return points
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6">Entrenamientos Recientes</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Entrenamientos de {new Date().toLocaleDateString('es-AR', { month: 'long' })}</h3>
        <Activity className="h-6 w-6 text-primary-500" />
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No hay entrenamientos este mes</p>
          <p className="text-slate-500 text-sm mt-2">
            Los entrenamientos de {new Date().toLocaleDateString('es-AR', { month: 'long' })} aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {workoutTypeIcons[workout.type as keyof typeof workoutTypeIcons] || '🏋️‍♂️'}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">
                      {workout.title}
                    </h4>
                    <div className="flex items-center space-x-1 text-xs text-slate-500 mb-2">
                      <User className="h-3 w-3" />
                      <span>{workout.user.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(workout.duration)}</span>
                      </div>
                      {workout.distance && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{workout.distance.toFixed(1)} km</span>
                        </div>
                      )}
                      {workout.heartRate && (
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{workout.heartRate} bpm</span>
                        </div>
                      )}
                    </div>
                    {workout.location && (
                      <p className="text-xs text-slate-500 mt-1">📍 {workout.location}</p>
                    )}
                    {workout.description && (
                      <p className="text-xs text-slate-400 mt-1 italic">"{workout.description}"</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-accent-400">
                    <Zap className="h-4 w-4" />
                    <span className="font-medium">{workout.points || calculatePoints(workout)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(workout.createdAt).toLocaleDateString('es-AR')}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    👤 Manual
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-700">
        <a
          href="/dashboard/workouts"
          className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
        >
          Ver todos los entrenamientos →
        </a>
      </div>
    </motion.div>
  )
}
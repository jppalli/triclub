'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Heart, Zap, Mountain, Activity, Target } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface Workout {
  id: string
  title: string
  type: string
  duration: number
  distance?: number
  calories?: number
  heartRate?: number
  points: number
  createdAt: string
}

export default function GarminStats() {
  const { data: session } = useSession()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      loadUserWorkouts()
    }
  }, [session])

  const loadUserWorkouts = async () => {
    try {
      // Cargar entrenamientos del usuario actual desde la base de datos
      const response = await fetch('/api/workouts/recent?limit=50')
      const data = await response.json()
      
      if (data.success) {
        const dbWorkouts: Workout[] = data.workouts.map((workout: any) => ({
          id: workout.id,
          title: workout.title,
          type: workout.type,
          duration: workout.duration,
          distance: workout.distance,
          calories: workout.calories,
          heartRate: workout.heartRate || workout.avgHeartRate,
          points: workout.points || calculatePoints(workout),
          createdAt: workout.createdAt
        }))
        
        setWorkouts(dbWorkouts)
      } else {
        setWorkouts([])
      }
    } catch (error) {
      console.error('Error loading workouts:', error)
      setWorkouts([])
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePoints = (workout: any) => {
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
  
  // Filtrar entrenamientos del mes actual
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const thisMonthWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.createdAt)
    return workoutDate.getMonth() === currentMonth && workoutDate.getFullYear() === currentYear
  })

  // Calcular estadísticas solo del mes actual
  const stats = thisMonthWorkouts.reduce((acc, workout) => {
    acc.totalWorkouts++
    acc.totalDuration += workout.duration
    acc.totalDistance += workout.distance || 0
    acc.totalCalories += workout.calories || 0
    acc.totalPoints += workout.points
    
    if (workout.heartRate) {
      acc.heartRateSum += workout.heartRate
      acc.heartRateCount++
    }
    
    return acc
  }, {
    totalWorkouts: 0,
    totalDuration: 0,
    totalDistance: 0,
    totalCalories: 0,
    totalPoints: 0,
    heartRateSum: 0,
    heartRateCount: 0
  })

  const monthName = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

  const avgHeartRate = stats.heartRateCount > 0 ? Math.round(stats.heartRateSum / stats.heartRateCount) : 0

  const statsData = [
    {
      name: 'Entrenamientos',
      value: stats.totalWorkouts.toString(),
      subtitle: 'Este mes',
      icon: Activity,
      color: 'text-primary-500',
      bgColor: 'bg-primary-500/20'
    },
    {
      name: 'Tiempo Total',
      value: `${Math.round(stats.totalDuration / 60)}h`,
      subtitle: `${stats.totalDuration} minutos`,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      name: 'Distancia',
      value: `${stats.totalDistance.toFixed(1)}km`,
      subtitle: 'Este mes',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20'
    },
    {
      name: 'Calorías',
      value: `${stats.totalCalories}`,
      subtitle: 'Total quemadas',
      icon: Mountain,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20'
    },
    {
      name: 'FC Promedio',
      value: avgHeartRate > 0 ? `${avgHeartRate}` : '-',
      subtitle: 'bpm',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/20'
    },
    {
      name: 'Puntos Ganados',
      value: stats.totalPoints.toString(),
      subtitle: 'Este mes',
      icon: Zap,
      color: 'text-accent-500',
      bgColor: 'bg-accent-500/20'
    }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 animate-pulse">
              <div className="w-10 h-10 bg-slate-700 rounded-lg mb-3"></div>
              <div className="h-6 bg-slate-700 rounded mb-1"></div>
              <div className="h-4 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700"
          >
            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.name}</div>
            <div className="text-slate-500 text-xs">{stat.subtitle}</div>
          </motion.div>
        ))}
      </div>

      {/* Información del período */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Resumen de {monthName}</h3>
            <p className="text-slate-400 text-sm">
              {thisMonthWorkouts.length} entrenamientos de {workouts.length} totales
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-400">{stats.totalWorkouts}</div>
            <div className="text-slate-400 text-sm">Este mes</div>
          </div>
        </div>
      </motion.div>

      {/* Mensaje si no hay entrenamientos este mes */}
      {thisMonthWorkouts.length === 0 && workouts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center"
        >
          <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No hay entrenamientos este mes</h3>
          <p className="text-slate-400">
            Tienes {workouts.length} entrenamientos en total, pero ninguno en {monthName.toLowerCase()}
          </p>
        </motion.div>
      )}

      {/* Mensaje si no hay entrenamientos en absoluto */}
      {workouts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center"
        >
          <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No hay entrenamientos registrados</h3>
          <p className="text-slate-400">
            Los entrenamientos aparecerán aquí cuando sean agregados por el administrador
          </p>
        </motion.div>
      )}
    </div>
  )
}
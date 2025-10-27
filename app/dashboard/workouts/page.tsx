'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Activity, Plus, Calendar, Clock, MapPin, TrendingUp, Zap, Target } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

const mockWorkouts = [
  {
    id: 1,
    type: 'Natación',
    title: 'Entrenamiento de Resistencia',
    date: '2024-01-15',
    duration: '45 min',
    distance: '2.5 km',
    location: 'Club Náutico San Isidro',
    calories: 420,
    points: 75,
    avgPace: '1:48/100m',
    heartRate: 145,
    status: 'completado'
  },
  {
    id: 2,
    type: 'Ciclismo',
    title: 'Ruta por Tigre',
    date: '2024-01-14',
    duration: '1h 35min',
    distance: '45 km',
    location: 'Delta del Tigre',
    calories: 890,
    points: 90,
    avgPace: '28.4 km/h',
    heartRate: 152,
    status: 'completado'
  },
  {
    id: 3,
    type: 'Running',
    title: 'Carrera Matutina',
    date: '2024-01-13',
    duration: '42 min',
    distance: '10 km',
    location: 'Puerto Madero',
    calories: 650,
    points: 50,
    avgPace: '4:12/km',
    heartRate: 158,
    status: 'completado'
  },
  {
    id: 4,
    type: 'Triatlón',
    title: 'Simulacro de Competencia',
    date: '2024-01-12',
    duration: '2h 15min',
    distance: '25.75 km',
    location: 'Club de Triatlón',
    calories: 1250,
    points: 150,
    avgPace: 'Mixto',
    heartRate: 148,
    status: 'completado'
  }
]

export default function WorkoutsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeFilter, setActiveFilter] = useState('todos')
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Natación': return 'text-blue-400 bg-blue-400/20'
      case 'Ciclismo': return 'text-green-400 bg-green-400/20'
      case 'Running': return 'text-orange-400 bg-orange-400/20'
      case 'Triatlón': return 'text-purple-400 bg-purple-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const filters = ['todos', 'natacion', 'ciclismo', 'running', 'triatlon']

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Entrenamientos</h1>
            <p className="text-slate-300">
              Registra y analiza tus sesiones de entrenamiento
            </p>
          </div>
          <button className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nuevo Entrenamiento
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-white">47</span>
            </div>
            <div className="text-slate-400">Entrenamientos</div>
            <div className="text-green-400 text-sm">+12% este mes</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-accent-500" />
              <span className="text-2xl font-bold text-white">89h</span>
            </div>
            <div className="text-slate-400">Tiempo total</div>
            <div className="text-green-400 text-sm">+8% este mes</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-white">425km</span>
            </div>
            <div className="text-slate-400">Distancia total</div>
            <div className="text-green-400 text-sm">+15% este mes</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <Zap className="h-8 w-8 text-accent-500" />
              <span className="text-2xl font-bold text-white">1,250</span>
            </div>
            <div className="text-slate-400">Puntos ganados</div>
            <div className="text-green-400 text-sm">+25% este mes</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700"
        >
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  activeFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Workouts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getTypeColor(workout.type)}`}>
                      {workout.type}
                    </span>
                    <div className="flex items-center gap-1 text-accent-500">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium">+{workout.points}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg">{workout.title}</h3>
                </div>
                <div className="text-slate-400 text-sm">{workout.date}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="h-4 w-4" />
                  <span>{workout.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Target className="h-4 w-4" />
                  <span>{workout.distance}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{workout.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <TrendingUp className="h-4 w-4" />
                  <span>{workout.avgPace}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="text-slate-400 text-sm">
                  {workout.calories} cal • FC avg: {workout.heartRate} bpm
                </div>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  Ver detalles →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
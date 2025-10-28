'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Activity, Plus, Calendar, Clock, MapPin, TrendingUp, Zap, Target, Filter } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import AddWorkoutModal from '@/components/dashboard/AddWorkoutModal'

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
  const [activeFilter, setActiveFilter] = useState<'SWIMMING' | 'CYCLING' | 'RUNNING' | 'TRIATHLON' | 'OTHER' | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Usuario mock para que funcione
  const user: User = {
    id: 1,
    name: 'Juan Pedro Palli',
    email: 'atleta@triclub.ar',
    club: 'Club Triatlón Buenos Aires',
    points: 2850,
    level: 'Elite',
    avatar: '/avatar-placeholder.jpg'
  }

  // tRPC queries
  const { data: workouts, isLoading: workoutsLoading, error: workoutsError } = trpc.workouts.getWorkouts.useQuery({ 
    limit: 20,
    type: activeFilter || undefined
  })
  const { data: stats, isLoading: statsLoading } = trpc.workouts.getStats.useQuery({ period: 'month' })

  // Debug log
  console.log('🏃‍♂️ Workouts data:', { 
    workouts, 
    isArray: Array.isArray(workouts), 
    type: typeof workouts, 
    loading: workoutsLoading,
    error: workoutsError 
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SWIMMING': return 'text-blue-400 bg-blue-400/20'
      case 'CYCLING': return 'text-green-400 bg-green-400/20'
      case 'RUNNING': return 'text-orange-400 bg-orange-400/20'
      case 'TRIATHLON': return 'text-purple-400 bg-purple-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SWIMMING': return '🏊‍♂️'
      case 'CYCLING': return '🚴‍♂️'
      case 'RUNNING': return '🏃‍♂️'
      case 'TRIATHLON': return '🏆'
      default: return '💪'
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'SWIMMING': return 'Natación'
      case 'CYCLING': return 'Ciclismo'
      case 'RUNNING': return 'Running'
      case 'TRIATHLON': return 'Triatlón'
      default: return 'Otro'
    }
  }

  const filters = [
    { key: null, label: 'Todos' },
    { key: 'SWIMMING' as const, label: 'Natación' },
    { key: 'CYCLING' as const, label: 'Ciclismo' },
    { key: 'RUNNING' as const, label: 'Running' },
    { key: 'TRIATHLON' as const, label: 'Triatlón' },
  ]

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
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all flex items-center gap-2"
          >
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
          {statsLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 animate-pulse">
                <div className="h-8 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="h-8 w-8 text-primary-500" />
                  <span className="text-2xl font-bold text-white">{stats?.totalWorkouts || 0}</span>
                </div>
                <div className="text-slate-400">Entrenamientos</div>
                <div className="text-green-400 text-sm">Este mes</div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="h-8 w-8 text-accent-500" />
                  <span className="text-2xl font-bold text-white">{stats?.totalDuration?.toFixed(1) || 0}h</span>
                </div>
                <div className="text-slate-400">Tiempo total</div>
                <div className="text-green-400 text-sm">Este mes</div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-primary-500" />
                  <span className="text-2xl font-bold text-white">{stats?.totalDistance?.toFixed(1) || 0}km</span>
                </div>
                <div className="text-slate-400">Distancia total</div>
                <div className="text-green-400 text-sm">Este mes</div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="h-8 w-8 text-accent-500" />
                  <span className="text-2xl font-bold text-white">{stats?.totalPoints || 0}</span>
                </div>
                <div className="text-slate-400">Puntos ganados</div>
                <div className="text-green-400 text-sm">Este mes</div>
              </div>
            </>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <span className="text-slate-300 font-medium">Filtrar por:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.key || 'all'}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeFilter === filter.key
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Workouts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workoutsLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 animate-pulse">
                <div className="h-6 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="h-4 bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-700 rounded"></div>
                </div>
              </div>
            ))
          ) : !workouts || workouts.length === 0 ? (
            <div className="lg:col-span-2 text-center py-12">
              <Activity className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay entrenamientos</h3>
              <p className="text-slate-400 mb-6">
                {activeFilter 
                  ? `No se encontraron entrenamientos de ${getTypeName(activeFilter)}`
                  : 'Aún no tienes entrenamientos registrados'
                }
              </p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Agregar primer entrenamiento
              </button>
            </div>
          ) : (
            (workouts || []).map((workout, index) => (
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
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 ${getTypeColor(workout.type)}`}>
                        <span>{getTypeIcon(workout.type)}</span>
                        {getTypeName(workout.type)}
                      </span>
                      <div className="flex items-center gap-1 text-accent-500">
                        <Zap className="h-4 w-4" />
                        <span className="font-medium">+{workout.points}</span>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-lg">{workout.title}</h3>
                  </div>
                  <div className="text-slate-400 text-sm">
                    {new Date(workout.createdAt).toLocaleDateString('es-AR')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-4 w-4" />
                    <span>{workout.duration} min</span>
                  </div>
                  {workout.distance && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Target className="h-4 w-4" />
                      <span>{workout.distance.toFixed(1)} km</span>
                    </div>
                  )}
                  {workout.location && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{workout.location}</span>
                    </div>
                  )}
                  {workout.avgPace && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <TrendingUp className="h-4 w-4" />
                      <span>{workout.avgPace}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="text-slate-400 text-sm">
                    {workout.calories ? `${workout.calories} cal` : ''} 
                    {workout.heartRate ? ` • FC avg: ${workout.heartRate} bpm` : ''}
                  </div>
                  <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                    Ver detalles →
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Add Workout Modal */}
        <AddWorkoutModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
      </div>
    </DashboardLayout>
  )
}
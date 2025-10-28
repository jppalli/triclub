'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Activity, 
  Clock, 
  MapPin,
  User,
  Calendar,
  Target,
  Zap
} from 'lucide-react'
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

interface Workout {
  id: string
  userId: string
  userName: string
  userEmail: string
  type: string
  duration: number
  distance?: number
  calories?: number
  avgHeartRate?: number
  maxHeartRate?: number
  pace?: string
  location?: string
  notes?: string
  date: string
  createdAt: string
}

export default function AdminWorkoutsPage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterUser, setFilterUser] = useState('all')
  const router = useRouter()

  const [newWorkout, setNewWorkout] = useState({
    userId: '',
    type: 'RUNNING',
    duration: '',
    distance: '',
    calories: '',
    avgHeartRate: '',
    maxHeartRate: '',
    pace: '',
    location: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  })

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
        name: session.user.name || 'Admin',
        email: session.user.email || '',
        club: `TriClub ${stats.level}`,
        points: stats.totalPoints,
        level: stats.level,
        avatar: session.user.image || '/avatar-placeholder.jpg'
      })
      
      loadData()
    }
  }, [session, status, router])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Cargar usuarios y entrenamientos
      const [usersResponse, workoutsResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/workouts')
      ])
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      }
      
      if (workoutsResponse.ok) {
        const workoutsData = await workoutsResponse.json()
        setWorkouts(workoutsData.workouts || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWorkout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const response = await fetch('/api/admin/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newWorkout,
          duration: parseInt(newWorkout.duration),
          distance: newWorkout.distance ? parseFloat(newWorkout.distance) : null,
          calories: newWorkout.calories ? parseInt(newWorkout.calories) : null,
          avgHeartRate: newWorkout.avgHeartRate ? parseInt(newWorkout.avgHeartRate) : null,
          maxHeartRate: newWorkout.maxHeartRate ? parseInt(newWorkout.maxHeartRate) : null,
        })
      })

      const data = await response.json()

      if (data.success) {
        setWorkouts([data.workout, ...workouts])
        setShowAddForm(false)
        setNewWorkout({
          userId: '',
          type: 'RUNNING',
          duration: '',
          distance: '',
          calories: '',
          avgHeartRate: '',
          maxHeartRate: '',
          pace: '',
          location: '',
          notes: '',
          date: new Date().toISOString().split('T')[0]
        })
        alert('Entrenamiento creado exitosamente')
      } else {
        alert(data.error || 'Error al crear entrenamiento')
      }
    } catch (error) {
      console.error('Error creating workout:', error)
      alert('Error de conexión')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/workouts/${workoutId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setWorkouts(workouts.filter(w => w.id !== workoutId))
        alert('Entrenamiento eliminado exitosamente')
      } else {
        alert(data.error || 'Error al eliminar entrenamiento')
      }
    } catch (error) {
      console.error('Error deleting workout:', error)
      alert('Error de conexión')
    }
  }

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case 'RUNNING':
        return <Activity className="h-5 w-5 text-red-500" />
      case 'CYCLING':
        return <Zap className="h-5 w-5 text-blue-500" />
      case 'SWIMMING':
        return <Target className="h-5 w-5 text-cyan-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
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

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (workout.location && workout.location.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || workout.type === filterType
    const matchesUser = filterUser === 'all' || workout.userId === filterUser
    
    return matchesSearch && matchesType && matchesUser
  })

  if (status === 'loading' || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Administrar Entrenamientos</h1>
              <p className="text-slate-300">
                Gestiona los entrenamientos de todos los usuarios del club
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Agregar Entrenamiento
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Entrenamientos</p>
                <p className="text-2xl font-bold text-white mt-1">{workouts.length}</p>
              </div>
              <Activity className="h-8 w-8 text-primary-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Usuarios Activos</p>
                <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Esta Semana</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {workouts.filter(w => {
                    const workoutDate = new Date(w.date)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return workoutDate >= weekAgo
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-accent-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Tiempo Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatDuration(workouts.reduce((sum, w) => sum + w.duration, 0))}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Buscar por usuario, email o ubicación..."
                />
              </div>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="RUNNING">Running</option>
              <option value="CYCLING">Ciclismo</option>
              <option value="SWIMMING">Natación</option>
              <option value="TRIATHLON">Triatlón</option>
              <option value="STRENGTH">Fuerza</option>
              <option value="OTHER">Otro</option>
            </select>

            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los usuarios</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Add Workout Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Agregar Nuevo Entrenamiento</h3>
            <form onSubmit={handleCreateWorkout} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Usuario *
                  </label>
                  <select
                    value={newWorkout.userId}
                    onChange={(e) => setNewWorkout({ ...newWorkout, userId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar usuario</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo de Entrenamiento *
                  </label>
                  <select
                    value={newWorkout.type}
                    onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="RUNNING">Running</option>
                    <option value="CYCLING">Ciclismo</option>
                    <option value="SWIMMING">Natación</option>
                    <option value="TRIATHLON">Triatlón</option>
                    <option value="STRENGTH">Fuerza</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Duración (minutos) *
                  </label>
                  <input
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={newWorkout.date}
                    onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Distancia (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWorkout.distance}
                    onChange={(e) => setNewWorkout({ ...newWorkout, distance: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="5.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Calorías
                  </label>
                  <input
                    type="number"
                    value={newWorkout.calories}
                    onChange={(e) => setNewWorkout({ ...newWorkout, calories: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    FC Promedio
                  </label>
                  <input
                    type="number"
                    value={newWorkout.avgHeartRate}
                    onChange={(e) => setNewWorkout({ ...newWorkout, avgHeartRate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    FC Máxima
                  </label>
                  <input
                    type="number"
                    value={newWorkout.maxHeartRate}
                    onChange={(e) => setNewWorkout({ ...newWorkout, maxHeartRate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="180"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ritmo (min/km)
                  </label>
                  <input
                    type="text"
                    value={newWorkout.pace}
                    onChange={(e) => setNewWorkout({ ...newWorkout, pace: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="5:30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={newWorkout.location}
                    onChange={(e) => setNewWorkout({ ...newWorkout, location: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Puerto Madero"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notas
                </label>
                <textarea
                  value={newWorkout.notes}
                  onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Notas adicionales sobre el entrenamiento..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isCreating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isCreating ? 'Creando...' : 'Crear Entrenamiento'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="border border-slate-600 text-slate-300 px-6 py-3 rounded-xl font-medium hover:border-slate-500 hover:text-white transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Workouts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">
            Entrenamientos ({filteredWorkouts.length})
          </h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay entrenamientos</h3>
              <p className="text-slate-400 mb-4">
                {workouts.length === 0 
                  ? 'Agrega el primer entrenamiento para comenzar'
                  : 'No se encontraron entrenamientos con los filtros aplicados'
                }
              </p>
              {workouts.length === 0 && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all"
                >
                  Agregar Entrenamiento
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWorkouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getWorkoutIcon(workout.type)}
                        <div>
                          <h4 className="text-white font-semibold">
                            {getWorkoutTypeText(workout.type)}
                          </h4>
                          <p className="text-slate-400 text-sm">
                            {workout.userName} ({workout.userEmail})
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(workout.duration)}</span>
                        </div>
                        {workout.distance && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{workout.distance} km</span>
                          </div>
                        )}
                        {workout.calories && (
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            <span>{workout.calories} cal</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(workout.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {workout.location && (
                        <p className="text-slate-400 text-sm mb-2">
                          📍 {workout.location}
                        </p>
                      )}

                      {workout.notes && (
                        <p className="text-slate-300 text-sm">
                          "{workout.notes}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-colors"
                        title="Eliminar entrenamiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
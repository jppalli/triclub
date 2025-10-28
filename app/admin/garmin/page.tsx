'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Database, Download, Upload, User, RefreshCw, Trophy } from 'lucide-react'
import { type GarminActivity } from '@/lib/garmin-mock-data'

interface DbUser {
  id: string
  name: string
  email: string
  firstName?: string
  lastName?: string
  club?: string
  points: number
  level?: string
}

export default function GarminAdminStandalonePage() {
  const [users, setUsers] = useState<DbUser[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [activities, setActivities] = useState<GarminActivity[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newActivity, setNewActivity] = useState<Partial<GarminActivity>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  // Cargar actividades cuando se selecciona un usuario
  useEffect(() => {
    if (selectedUserId) {
      loadUserActivities(selectedUserId)
    }
  }, [selectedUserId])

  const loadUsers = async () => {
    try {
      // Usar datos mock si la API no está disponible
      const mockUsers: DbUser[] = [
        {
          id: 'user1',
          name: 'Juan Pedro Palli',
          email: 'juan@triclub.ar',
          points: 2850,
          level: 'ELITE'
        },
        {
          id: 'user2', 
          name: 'María González',
          email: 'maria@triclub.ar',
          points: 1200,
          level: 'INTERMEDIATE'
        },
        {
          id: 'user3',
          name: 'Carlos Rodríguez',
          email: 'carlos@triclub.ar',
          points: 800,
          level: 'BEGINNER'
        },
        {
          id: 'user4',
          name: 'Ana López',
          email: 'ana@triclub.ar',
          points: 1500,
          level: 'INTERMEDIATE'
        },
        {
          id: 'user5',
          name: 'Miguel Santos',
          email: 'miguel@triclub.ar',
          points: 3200,
          level: 'ELITE'
        }
      ]

      try {
        const response = await fetch('/api/admin/users')
        const data = await response.json()
        
        if (data.success && data.users.length > 0) {
          setUsers(data.users)
          setSelectedUserId(data.users[0].id)
        } else {
          // Usar datos mock como fallback
          setUsers(mockUsers)
          setSelectedUserId(mockUsers[0].id)
        }
      } catch (error) {
        console.log('API not available, using mock data')
        setUsers(mockUsers)
        setSelectedUserId(mockUsers[0].id)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserActivities = async (userId: string) => {
    try {
      setIsLoading(true)
      // Cargar entrenamientos reales de la base de datos
      const response = await fetch(`/api/admin/workouts?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Los entrenamientos ya están filtrados por userId en el servidor
          const userWorkouts = data.workouts
          
          // Convertir entrenamientos a formato Garmin para visualización
          const garminActivities = userWorkouts.map((workout: any, index: number) => ({
            activityId: parseInt(workout.id.slice(-6)) || index + 1000,
            activityName: workout.type,
            description: workout.notes || null,
            startTimeLocal: new Date(workout.date).toISOString().slice(0, 19),
            startTimeGMT: new Date(workout.date).toISOString(),
            activityType: {
              typeId: getTypeIdFromWorkoutType(workout.type),
              typeKey: workout.type.toLowerCase(),
              parentTypeId: getTypeIdFromWorkoutType(workout.type)
            },
            eventType: { typeId: 9, typeKey: 'training' },
            distance: (workout.distance || 0) * 1000, // convertir km a metros
            duration: workout.duration * 60, // convertir minutos a segundos
            elapsedDuration: workout.duration * 60,
            movingDuration: workout.duration * 60,
            elevationGain: 0,
            elevationLoss: 0,
            averageSpeed: workout.pace ? parseFloat(workout.pace) : 0,
            maxSpeed: 0,
            calories: workout.calories || 0,
            averageHR: workout.avgHeartRate || workout.heartRate || null,
            maxHR: workout.maxHeartRate || null,
            averageRunningCadence: null,
            maxRunningCadence: null,
            averageBikingCadence: null,
            maxBikingCadence: null,
            averageSwimCadence: null,
            maxSwimCadence: null,
            strokes: null,
            avgStrokeDistance: null,
            poolLength: null,
            unitOfPoolLength: null,
            hasPolyline: false,
            ownerId: parseInt(userId) || 12345,
            ownerDisplayName: workout.userName?.replace(/\s+/g, '_') || 'User',
            ownerFullName: workout.userName || 'Usuario',
            ownerProfileImageUrlSmall: null,
            ownerProfileImageUrlMedium: null,
            ownerProfileImageUrlLarge: null,
            locationName: workout.location || null,
            beginTimestamp: new Date(workout.date).getTime(),
            sportTypeId: getTypeIdFromWorkoutType(workout.type),
            avgPower: null,
            maxPower: null,
            aerobicTrainingEffect: null,
            anaerobicTrainingEffect: null,
            moderateIntensityMinutes: null,
            vigorousIntensityMinutes: null
          }))
          
          // Ordenar por fecha más reciente
          garminActivities.sort((a: GarminActivity, b: GarminActivity) => new Date(b.startTimeLocal).getTime() - new Date(a.startTimeLocal).getTime())
          
          setActivities(garminActivities)
          setIsLoading(false)
          return
        }
      }
      
      // Si no hay datos, mostrar array vacío
      setActivities([])
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading workouts:', error)
      setActivities([])
      setIsLoading(false)
    }
  }

  const getTypeIdFromWorkoutType = (type: string) => {
    switch (type) {
      case 'RUNNING': return 1
      case 'CYCLING': return 2
      case 'SWIMMING': return 5
      case 'TRIATHLON': return 18
      case 'STRENGTH': return 13
      default: return 1
    }
  }

  const getSelectedUser = () => {
    return users.find(u => u.id === selectedUserId)
  }

  const activityTypes = [
    { key: 'lap_swimming', name: 'Natación en Piscina', sportId: 5 },
    { key: 'open_water_swimming', name: 'Natación Aguas Abiertas', sportId: 5 },
    { key: 'cycling', name: 'Ciclismo', sportId: 2 },
    { key: 'running', name: 'Running', sportId: 1 },
    { key: 'multi_sport', name: 'Triatlón', sportId: 18 },
    { key: 'strength_training', name: 'Entrenamiento de Fuerza', sportId: 13 }
  ]

  const handleEdit = (activity: GarminActivity) => {
    setEditingId(activity.activityId)
  }

  const handleSave = async (activityId: number, updatedData: Partial<GarminActivity>) => {
    if (!selectedUserId) return
    
    // TODO: Implementar actualización de workout en la API
    alert('La edición de workouts desde el admin aún no está implementada. Por favor, edita desde la base de datos directamente.')
    
    // Recargar actividades
    await loadUserActivities(selectedUserId)
    setEditingId(null)
  }

  const handleDelete = async (activityId: number) => {
    if (!selectedUserId) return
    
    if (!confirm('¿Estás seguro de que quieres eliminar esta actividad?')) return
    
    try {
      // Encontrar el workout correspondiente
      const activity = activities.find(a => a.activityId === activityId)
      if (!activity) return
      
      // Construir el ID del workout (basado en cómo se convierte en loadUserActivities)
      const workoutId = activity.activityId.toString()
      
      // TODO: Implementar DELETE endpoint en /api/admin/workouts/[id]
      // Por ahora, mostrar mensaje
      alert('La eliminación de workouts desde el admin aún no está implementada. Por favor, elimina desde la base de datos directamente.')
      
      // Recargar actividades
      await loadUserActivities(selectedUserId)
    } catch (error) {
      console.error('❌ Error eliminando workout:', error)
      alert('Error al eliminar el entrenamiento')
    }
  }

  const handleAdd = async () => {
    if (!selectedUserId) return
    
    try {
      setIsLoading(true)
      
      // Convertir tipo de actividad a WorkoutType
      const workoutType = getWorkoutTypeFromActivityKey(newActivity.activityType?.typeKey || 'running')
      
      // Generar título del workout
      const workoutTitle = newActivity.activityName || `${workoutType} - ${Math.round((newActivity.duration || 0) / 60)} min`
      
      // Preparar datos del workout
      const workoutData = {
        userId: selectedUserId,
        title: workoutTitle,
        type: workoutType,
        duration: Math.round((newActivity.duration || 0) / 60), // segundos a minutos
        distance: (newActivity.distance || 0) / 1000, // metros a km
        calories: newActivity.calories || 0,
        avgHeartRate: newActivity.averageHR || null,
        maxHeartRate: newActivity.maxHR || null,
        pace: calculatePaceString(newActivity),
        location: newActivity.locationName || null,
        notes: newActivity.description || null,
        date: newActivity.startTimeLocal || new Date().toISOString()
      }
      
      console.log('📤 Sending workout data:', workoutData)
      console.log('📤 newActivity:', newActivity)
      
      // Crear workout en la base de datos
      const response = await fetch('/api/admin/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Workout creado:', data)
        
        // Recargar actividades del usuario
        await loadUserActivities(selectedUserId)
        
        // Limpiar formulario
        setNewActivity({})
        setShowAddForm(false)
        
        alert(`Entrenamiento creado exitosamente. ${data.pointsAwarded || 0} puntos otorgados.`)
      } else {
        const error = await response.json()
        console.error('❌ Error creando workout:', error)
        alert('Error al crear el entrenamiento: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('❌ Error:', error)
      alert('Error al crear el entrenamiento')
    } finally {
      setIsLoading(false)
    }
  }
  
  const getWorkoutTypeFromActivityKey = (key: string): string => {
    switch (key) {
      case 'lap_swimming':
      case 'open_water_swimming':
        return 'SWIMMING'
      case 'cycling':
        return 'CYCLING'
      case 'running':
        return 'RUNNING'
      case 'multi_sport':
        return 'TRIATHLON'
      case 'strength_training':
        return 'OTHER'
      default:
        return 'OTHER'
    }
  }
  
  const calculatePaceString = (activity: Partial<GarminActivity>): string | null => {
    if (!activity.distance || !activity.duration || activity.distance === 0) return null
    
    const distanceKm = activity.distance / 1000
    const durationMin = activity.duration / 60
    const paceMinPerKm = durationMin / distanceKm
    
    const minutes = Math.floor(paceMinPerKm)
    const seconds = Math.round((paceMinPerKm - minutes) * 60)
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`
  }

  const exportData = () => {
    // Exportar datos actuales de la base de datos
    const dataStr = JSON.stringify(activities, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `workouts-${selectedUserId}-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUserId) return
    
    alert('La importación masiva de workouts aún no está implementada. Por favor, agrega los entrenamientos uno por uno.')
    
    // TODO: Implementar importación masiva usando /api/admin/workouts
    // const file = event.target.files?.[0]
    // if (!file) return
    // ... procesar archivo y crear workouts en batch
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-8 w-8 text-accent-500" />
                <h1 className="text-3xl font-bold text-white">Garmin Data Admin</h1>
              </div>
              <p className="text-slate-300">
                Herramienta independiente para gestionar datos mock de Garmin Connect
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportData}
                disabled={!selectedUserId}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Exportar JSON
              </button>
              <label className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer">
                <Upload className="h-4 w-4" />
                Importar JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowAddForm(true)}
                disabled={!selectedUserId}
                className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5" />
                Agregar Actividad
              </button>
            </div>
          </div>

          {/* User Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center gap-4">
              <User className="h-6 w-6 text-primary-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Seleccionar Usuario para Gestionar Datos Garmin
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full max-w-md px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar usuario...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email}) - {user.points} puntos
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => selectedUserId && loadUserActivities(selectedUserId)}
                disabled={!selectedUserId}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="h-4 w-4" />
                Recargar
              </button>
            </div>
            
            {selectedUserId && getSelectedUser() && (
              <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Usuario Seleccionado:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Nombre:</span>
                    <span className="text-white ml-2">{getSelectedUser()?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white ml-2">{getSelectedUser()?.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Puntos:</span>
                    <span className="text-white ml-2">{getSelectedUser()?.points}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          {selectedUserId && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <Database className="h-6 w-6 text-primary-500 mb-2" />
                <div className="text-2xl font-bold text-white">{activities.length}</div>
                <div className="text-slate-400 text-sm">Actividades Total</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-bold text-white">
                  {activities.reduce((sum, a) => sum + (a.distance / 1000), 0).toFixed(1)}km
                </div>
                <div className="text-slate-400 text-sm">Distancia Total</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-bold text-white">
                  {Math.round(activities.reduce((sum, a) => sum + (a.duration / 3600), 0))}h
                </div>
                <div className="text-slate-400 text-sm">Tiempo Total</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-bold text-white">
                  {activities.reduce((sum, a) => sum + a.calories, 0).toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm">Calorías Total</div>
              </div>
            </div>
          )}

          {/* Add Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Agregar Nueva Actividad</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={newActivity.activityName || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, activityName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    placeholder="Nombre del entrenamiento"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
                  <select
                    value={newActivity.activityType?.typeKey || ''}
                    onChange={(e) => {
                      const type = activityTypes.find(t => t.key === e.target.value)
                      setNewActivity(prev => ({ 
                        ...prev, 
                        activityType: {
                          typeId: type?.sportId || 1,
                          typeKey: e.target.value,
                          parentTypeId: type?.sportId || 1
                        },
                        sportTypeId: type?.sportId || 1
                      }))
                    }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  >
                    <option value="">Seleccionar tipo</option>
                    {activityTypes.map(type => (
                      <option key={type.key} value={type.key}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Duración (seg)</label>
                  <input
                    type="number"
                    value={newActivity.duration || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    placeholder="3600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Distancia (m)</label>
                  <input
                    type="number"
                    value={newActivity.distance || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, distance: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    placeholder="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Calorías</label>
                  <input
                    type="number"
                    value={newActivity.calories || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">FC Promedio</label>
                  <input
                    type="number"
                    value={newActivity.averageHR || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, averageHR: parseInt(e.target.value) || null }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}

          {/* Activities Table */}
          {selectedUserId ? (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Duración</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Distancia</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Calorías</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">FC</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {activities.map((activity) => (
                      <tr key={activity.activityId} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3 text-sm text-slate-300">{activity.activityId}</td>
                        <td className="px-4 py-3 text-sm text-white font-medium">{activity.activityName}</td>
                        <td className="px-4 py-3 text-sm text-slate-300">{activity.activityType.typeKey}</td>
                        <td className="px-4 py-3 text-sm text-slate-300">{Math.round(activity.duration / 60)}min</td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {activity.distance > 0 ? `${(activity.distance / 1000).toFixed(1)}km` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">{activity.calories}</td>
                        <td className="px-4 py-3 text-sm text-slate-300">{activity.averageHR || '-'}</td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {new Date(activity.startTimeLocal).toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(activity)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(activity.activityId)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-12 text-center">
              <User className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Selecciona un Usuario</h3>
              <p className="text-slate-400">
                Selecciona un usuario de la lista para gestionar sus datos de Garmin Connect
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-4">
            <p className="text-slate-500 text-sm">
              Garmin Data Admin Tool - Herramienta independiente para gestión de datos mock
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Plus, Edit, Trash2, Save, X, Database, Download, Upload, User, RefreshCw } from 'lucide-react'
import { mockGarminActivities, type GarminActivity } from '@/lib/garmin-mock-data'
import { saveGarminActivities, loadGarminActivities } from '@/lib/garmin-storage'
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

export default function GarminDataAdminPage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<DbUser[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [activities, setActivities] = useState<GarminActivity[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newActivity, setNewActivity] = useState<Partial<GarminActivity>>({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
      
      loadUsers()
    }
  }, [session, status, router])

  // Cargar actividades cuando se selecciona un usuario
  useEffect(() => {
    if (selectedUserId) {
      loadUserActivities(selectedUserId)
    }
  }, [selectedUserId])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users || [])
        // Seleccionar el primer usuario por defecto
        if (data.users.length > 0) {
          setSelectedUserId(data.users[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserActivities = (userId: string) => {
    const storedActivities = loadGarminActivities(userId)
    if (storedActivities) {
      setActivities(storedActivities)
    } else {
      // Usar datos mock por defecto si existen
      setActivities(mockGarminActivities[userId] || [])
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

  const handleSave = (activityId: number, updatedData: Partial<GarminActivity>) => {
    if (!selectedUserId) return
    
    const updatedActivities = activities.map(activity => 
      activity.activityId === activityId 
        ? { ...activity, ...updatedData }
        : activity
    )
    setActivities(updatedActivities)
    saveGarminActivities(selectedUserId, updatedActivities)
    setEditingId(null)
  }

  const handleDelete = (activityId: number) => {
    if (!selectedUserId) return
    
    if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      const updatedActivities = activities.filter(activity => activity.activityId !== activityId)
      setActivities(updatedActivities)
      saveGarminActivities(selectedUserId, updatedActivities)
    }
  }

  const handleAdd = () => {
    if (!selectedUserId) return
    
    const newId = activities.length > 0 ? Math.max(...activities.map(a => a.activityId)) + 1 : 1
    const selectedUser = getSelectedUser()
    const activity: GarminActivity = {
      activityId: newId,
      activityName: newActivity.activityName || 'Nuevo Entrenamiento',
      description: newActivity.description || null,
      startTimeLocal: newActivity.startTimeLocal || new Date().toISOString().slice(0, 19),
      startTimeGMT: newActivity.startTimeGMT || new Date().toISOString(),
      activityType: {
        typeId: newActivity.activityType?.typeId || 1,
        typeKey: newActivity.activityType?.typeKey || 'running',
        parentTypeId: newActivity.activityType?.parentTypeId || 1
      },
      eventType: { typeId: 9, typeKey: 'training' },
      distance: newActivity.distance || 0,
      duration: newActivity.duration || 0,
      elapsedDuration: newActivity.elapsedDuration || newActivity.duration || 0,
      movingDuration: newActivity.movingDuration || newActivity.duration || 0,
      elevationGain: newActivity.elevationGain || 0,
      elevationLoss: newActivity.elevationLoss || 0,
      averageSpeed: newActivity.averageSpeed || 0,
      maxSpeed: newActivity.maxSpeed || 0,
      calories: newActivity.calories || 0,
      averageHR: newActivity.averageHR || null,
      maxHR: newActivity.maxHR || null,
      averageRunningCadence: newActivity.averageRunningCadence || null,
      maxRunningCadence: newActivity.maxRunningCadence || null,
      averageBikingCadence: newActivity.averageBikingCadence || null,
      maxBikingCadence: newActivity.maxBikingCadence || null,
      averageSwimCadence: newActivity.averageSwimCadence || null,
      maxSwimCadence: newActivity.maxSwimCadence || null,
      strokes: newActivity.strokes || null,
      avgStrokeDistance: newActivity.avgStrokeDistance || null,
      poolLength: newActivity.poolLength || null,
      unitOfPoolLength: newActivity.unitOfPoolLength || null,
      hasPolyline: newActivity.hasPolyline || false,
      ownerId: parseInt(selectedUserId) || 12345,
      ownerDisplayName: selectedUser?.name?.replace(/\s+/g, '_') || 'User',
      ownerFullName: selectedUser?.name || 'Usuario',
      ownerProfileImageUrlSmall: null,
      ownerProfileImageUrlMedium: null,
      ownerProfileImageUrlLarge: null,
      locationName: newActivity.locationName || null,
      beginTimestamp: Date.now(),
      sportTypeId: newActivity.sportTypeId || 1,
      avgPower: newActivity.avgPower || null,
      maxPower: newActivity.maxPower || null,
      aerobicTrainingEffect: newActivity.aerobicTrainingEffect || null,
      anaerobicTrainingEffect: newActivity.anaerobicTrainingEffect || null,
      moderateIntensityMinutes: newActivity.moderateIntensityMinutes || null,
      vigorousIntensityMinutes: newActivity.vigorousIntensityMinutes || null
    }

    const updatedActivities = [activity, ...activities]
    setActivities(updatedActivities)
    saveGarminActivities(selectedUserId, updatedActivities)
    setNewActivity({})
    setShowAddForm(false)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(activities, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'garmin-mock-data.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUserId) return
    
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string
        const importedActivities = JSON.parse(jsonData) as GarminActivity[]
        setActivities(importedActivities)
        saveGarminActivities(selectedUserId, importedActivities)
        alert('Datos importados exitosamente!')
      } catch (error) {
        alert('Error al importar el archivo JSON')
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
  }

  if (status === 'loading' || !user || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Administrador de Datos Garmin</h1>
            <p className="text-slate-300">
              Gestiona los datos mock de Garmin Connect para cualquier usuario
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportData}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
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
      </div>
    </DashboardLayout>
  )
}
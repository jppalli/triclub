'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Smartphone, RefreshCw, CheckCircle, AlertCircle, Zap, Clock, Target } from 'lucide-react'
import { getUserGarminActivities } from '@/lib/garmin-mock-data'

export default function GarminSync() {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [syncResult, setSyncResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    if (session?.user?.email) {
      // Mapear emails conocidos a IDs de usuario
      const emailToUserId: Record<string, string> = {
        'atleta@triclub.ar': 'cmhabbtsv0000tmtguvd0b2lx',
        'juan@triclub.ar': 'cmhabbtsv0000tmtguvd0b2lx',
        'admin@triclub.ar': 'cmhabbtsv0000tmtguvd0b2lx'
      }
      
      const mappedUserId = emailToUserId[session.user.email] || 'cmhabbtsv0000tmtguvd0b2lx'
      setUserId(mappedUserId)
      
      // Auto-conectar si el usuario tiene datos Garmin
      const garminActivities = getUserGarminActivities(mappedUserId)
      if (garminActivities.length > 0) {
        setIsConnected(true)
        setLastSync(new Date(Date.now() - 2 * 60 * 60 * 1000)) // 2 horas atrás
      }
    }
  }, [session])

  const handleSync = async () => {
    setIsLoading(true)
    setSyncResult(null)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      // Obtener datos mock de Garmin para el usuario actual
      const garminActivities = getUserGarminActivities(userId)
      
      // Simular que encontramos nuevas actividades
      const newActivities = garminActivities.slice(0, 2) // Simular 2 nuevas
      const totalPoints = newActivities.reduce((sum, activity) => sum + activity.points, 0)
      
      setSyncResult({
        syncedWorkouts: newActivities.length,
        totalPoints,
        activities: newActivities
      })
      
      setLastSync(new Date())
    } catch (error) {
      console.error('Error syncing:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    // TODO: Implementar OAuth con Garmin Connect
    // Por ahora simulamos la conexión
    setIsConnected(true)
    setLastSync(new Date())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Garmin Connect</h3>
        <Smartphone className="h-6 w-6 text-primary-500" />
      </div>

      {!isConnected ? (
        <div className="text-center py-6">
          <div className="bg-slate-700/50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-slate-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Conecta tu Garmin</h4>
          <p className="text-slate-400 text-sm mb-6">
            Sincroniza automáticamente tus entrenamientos y obtén puntos por cada actividad
          </p>
          <button
            onClick={handleConnect}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Conectar Garmin Connect
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-white font-medium">Conectado a Garmin Connect</span>
          </div>

          {lastSync && (
            <p className="text-slate-400 text-sm mb-4">
              Última sincronización: {lastSync.toLocaleString('es-AR')}
            </p>
          )}

          <div className="space-y-3">
            <button
              onClick={handleSync}
              disabled={isLoading}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>
                {isLoading ? 'Sincronizando con Garmin...' : 'Sincronizar Ahora'}
              </span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
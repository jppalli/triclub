'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import WorkoutDetails from '@/components/dashboard/WorkoutDetails'
import GarminStats from '@/components/dashboard/GarminStats'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

export default function WorkoutsPageSimple() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [workouts, setWorkouts] = useState<any[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user) {
      loadUserData()
    }
  }, [session, status, router])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      
      // Cargar datos del usuario
      const statsResponse = await fetch('/api/user/stats')
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        setUser({
          id: 1,
          name: stats.name || 'Usuario',
          email: stats.email || '',
          club: stats.club || 'TriClub',
          points: stats.points || 0,
          level: stats.level || 'Principiante',
          avatar: stats.avatar || '/avatar-placeholder.jpg'
        })
      }

      // Cargar workouts del usuario actual
      const workoutsResponse = await fetch('/api/workouts/recent?limit=50')
      if (workoutsResponse.ok) {
        const data = await workoutsResponse.json()
        if (data.success) {
          setWorkouts(data.workouts || [])
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Entrenamientos</h1>
          <p className="text-slate-300">
            Tus actividades y métricas de rendimiento
          </p>
        </div>

        {/* Estadísticas Avanzadas de Garmin */}
        <GarminStats />
        
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Entrenamientos Recientes</h2>
          {workouts.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 text-center">
              <div className="text-slate-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No hay entrenamientos registrados</h3>
              <p className="text-slate-400">
                Tus entrenamientos aparecerán aquí cuando sean agregados por el administrador
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  onClick={() => setSelectedWorkout(workout)}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                >
                  <h3 className="text-white font-semibold text-lg mb-2">{workout.title}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-slate-300">
                      <span className="text-sm">Duración:</span> {workout.duration} min
                    </div>
                    <div className="text-slate-300">
                      <span className="text-sm">Distancia:</span> {workout.distance ? `${workout.distance.toFixed(1)} km` : '-'}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-sm">Calorías:</span> {workout.calories || '-'}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-sm">Puntos:</span> +{workout.points}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="text-slate-400 text-sm">
                      {workout.location || 'Sin ubicación'} • {new Date(workout.createdAt).toLocaleDateString('es-AR')}
                    </div>
                    <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                      Ver detalles →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Detalles */}
        <WorkoutDetails 
          workout={selectedWorkout}
          isOpen={!!selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      </div>
    </DashboardLayout>
  )
}
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, Zap, Heart, Mountain, Gauge, Activity } from 'lucide-react'

interface WorkoutDetailsProps {
  workout: any
  isOpen: boolean
  onClose: () => void
}

export default function WorkoutDetails({ workout, isOpen, onClose }: WorkoutDetailsProps) {
  if (!isOpen || !workout) return null

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SWIMMING': return '🏊‍♂️'
      case 'CYCLING': return '🚴‍♂️'
      case 'RUNNING': return '🏃‍♂️'
      case 'TRIATHLON': return '🏆'
      default: return '💪'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SWIMMING': return 'text-blue-400 bg-blue-400/20'
      case 'CYCLING': return 'text-green-400 bg-green-400/20'
      case 'RUNNING': return 'text-orange-400 bg-orange-400/20'
      case 'TRIATHLON': return 'text-purple-400 bg-purple-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getTypeIcon(workout.type)}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{workout.title}</h2>
                <p className="text-slate-400">{new Date(workout.createdAt).toLocaleDateString('es-AR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tipo y Puntos */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 ${getTypeColor(workout.type)}`}>
              <span>{getTypeIcon(workout.type)}</span>
              {workout.type}
            </span>
            <div className="flex items-center gap-1 text-accent-500">
              <Zap className="h-4 w-4" />
              <span className="font-medium">+{workout.points} puntos</span>
            </div>
          </div>

          {/* Estadísticas Principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-700/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{workout.duration}</div>
              <div className="text-slate-400 text-sm">Minutos</div>
            </div>
            {workout.distance && (
              <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{workout.distance.toFixed(1)}</div>
                <div className="text-slate-400 text-sm">Kilómetros</div>
              </div>
            )}
            <div className="bg-slate-700/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{workout.calories}</div>
              <div className="text-slate-400 text-sm">Calorías</div>
            </div>
            {workout.heartRate && (
              <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{workout.heartRate}</div>
                <div className="text-slate-400 text-sm">FC Promedio</div>
              </div>
            )}
          </div>

          {/* Datos Adicionales de Garmin */}
          {workout.garminData && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Datos Detallados de Garmin</h3>
              
              {/* Métricas Avanzadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workout.garminData.elevationGain > 0 && (
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mountain className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">Desnivel Positivo</span>
                    </div>
                    <div className="text-xl font-bold text-white">{workout.garminData.elevationGain}m</div>
                  </div>
                )}

                {workout.garminData.maxSpeed > 0 && (
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">Velocidad Máxima</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {(workout.garminData.maxSpeed * 3.6).toFixed(1)} km/h
                    </div>
                  </div>
                )}

                {workout.garminData.maxHR && (
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span className="text-slate-300 text-sm">FC Máxima</span>
                    </div>
                    <div className="text-xl font-bold text-white">{workout.garminData.maxHR} bpm</div>
                  </div>
                )}

                {workout.garminData.cadence && (
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">Cadencia Promedio</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {workout.garminData.cadence} {workout.type === 'SWIMMING' ? 'braz/min' : workout.type === 'RUNNING' ? 'pasos/min' : 'rpm'}
                    </div>
                  </div>
                )}

                {workout.garminData.power && (
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-slate-300 text-sm">Potencia Promedio</span>
                    </div>
                    <div className="text-xl font-bold text-white">{workout.garminData.power}W</div>
                  </div>
                )}
              </div>

              {/* Efectos de Entrenamiento */}
              {workout.garminData.trainingEffect && (
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3">Efectos de Entrenamiento</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-slate-300 text-sm">Aeróbico</div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-blue-400">
                          {workout.garminData.trainingEffect.aerobic?.toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {workout.garminData.trainingEffect.aerobic >= 4 ? 'Alto' : 
                           workout.garminData.trainingEffect.aerobic >= 3 ? 'Moderado' : 'Bajo'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-300 text-sm">Anaeróbico</div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-red-400">
                          {workout.garminData.trainingEffect.anaerobic?.toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {workout.garminData.trainingEffect.anaerobic >= 4 ? 'Alto' : 
                           workout.garminData.trainingEffect.anaerobic >= 3 ? 'Moderado' : 'Bajo'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Minutos de Intensidad */}
              {workout.garminData.intensityMinutes && (
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3">Minutos de Intensidad</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-slate-300 text-sm">Moderada</div>
                      <div className="text-lg font-bold text-yellow-400">
                        {workout.garminData.intensityMinutes.moderate} min
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-300 text-sm">Vigorosa</div>
                      <div className="text-lg font-bold text-red-400">
                        {workout.garminData.intensityMinutes.vigorous} min
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Descripción */}
          {workout.description && (
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2">Descripción</h4>
              <p className="text-slate-300">{workout.description}</p>
            </div>
          )}

          {/* Ubicación */}
          {workout.location && (
            <div className="mt-4">
              <h4 className="text-white font-medium mb-2">Ubicación</h4>
              <p className="text-slate-300">{workout.location}</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
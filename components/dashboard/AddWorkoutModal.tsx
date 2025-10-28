'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, MapPin, Target, Heart, Zap, Activity } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'

interface AddWorkoutModalProps {
  isOpen: boolean
  onClose: () => void
}

const workoutTypes = [
  { value: 'SWIMMING', label: 'Natación', icon: '🏊‍♂️', color: 'text-blue-400' },
  { value: 'CYCLING', label: 'Ciclismo', icon: '🚴‍♂️', color: 'text-green-400' },
  { value: 'RUNNING', label: 'Running', icon: '🏃‍♂️', color: 'text-orange-400' },
  { value: 'TRIATHLON', label: 'Triatlón', icon: '🏆', color: 'text-purple-400' },
  { value: 'OTHER', label: 'Otro', icon: '💪', color: 'text-gray-400' },
]

export default function AddWorkoutModal({ isOpen, onClose }: AddWorkoutModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'RUNNING' as const,
    duration: '',
    distance: '',
    calories: '',
    heartRate: '',
    avgPace: '',
    location: '',
  })

  const utils = trpc.useUtils()
  const createWorkout = trpc.workouts.createWorkout.useMutation({
    onSuccess: () => {
      // Refrescar los datos
      utils.workouts.getWorkouts.invalidate()
      utils.workouts.getStats.invalidate()
      utils.points.getBalance.invalidate()
      
      // Cerrar modal y resetear form
      onClose()
      setFormData({
        title: '',
        description: '',
        type: 'RUNNING',
        duration: '',
        distance: '',
        calories: '',
        heartRate: '',
        avgPace: '',
        location: '',
      })
    },
    onError: (error) => {
      console.error('Error creating workout:', error)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    createWorkout.mutate({
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type,
      duration: parseInt(formData.duration),
      distance: formData.distance ? parseFloat(formData.distance) : undefined,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
      avgPace: formData.avgPace || undefined,
      location: formData.location || undefined,
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

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
          className="relative bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-white">Nuevo Entrenamiento</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Título del entrenamiento *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej: Entrenamiento de resistencia"
                required
              />
            </div>

            {/* Tipo de entrenamiento */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tipo de entrenamiento *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {workoutTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleChange('type', type.value)}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      formData.type === type.value
                        ? 'border-primary-500 bg-primary-500/20 text-white'
                        : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duración y Distancia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Duración (minutos) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="45"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Target className="inline h-4 w-4 mr-1" />
                  Distancia (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => handleChange('distance', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="10.5"
                  min="0"
                />
              </div>
            </div>

            {/* Calorías y Frecuencia Cardíaca */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Zap className="inline h-4 w-4 mr-1" />
                  Calorías
                </label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => handleChange('calories', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="450"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Heart className="inline h-4 w-4 mr-1" />
                  FC Promedio (bpm)
                </label>
                <input
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => handleChange('heartRate', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="155"
                  min="0"
                  max="220"
                />
              </div>
            </div>

            {/* Ritmo y Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ritmo promedio
                </label>
                <input
                  type="text"
                  value={formData.avgPace}
                  onChange={(e) => handleChange('avgPace', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="4:30/km o 30 km/h"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Puerto Madero"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Detalles adicionales del entrenamiento..."
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createWorkout.isPending || !formData.title || !formData.duration}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createWorkout.isPending ? 'Guardando...' : 'Guardar Entrenamiento'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
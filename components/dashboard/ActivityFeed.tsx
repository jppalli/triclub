'use client'

import { motion } from 'framer-motion'
import { Activity, MapPin, Clock, Zap, Trophy, Target } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'workout',
    title: 'Entrenamiento de Natación',
    description: '2.5km en piscina olímpica',
    time: '45 min',
    location: 'Club Náutico San Isidro',
    points: 75,
    timestamp: 'Hace 2 horas',
    icon: Activity,
    color: 'text-primary-500'
  },
  {
    id: 2,
    type: 'challenge',
    title: 'Desafío Semanal Completado',
    description: 'Meta: 150km de ciclismo',
    time: '6 días',
    location: 'Múltiples ubicaciones',
    points: 200,
    timestamp: 'Ayer',
    icon: Target,
    color: 'text-accent-500'
  },
  {
    id: 3,
    type: 'workout',
    title: 'Carrera Matutina',
    description: '10km por la costanera',
    time: '42 min',
    location: 'Puerto Madero',
    points: 50,
    timestamp: 'Hace 2 días',
    icon: Activity,
    color: 'text-primary-500'
  },
  {
    id: 4,
    type: 'achievement',
    title: 'Nuevo Logro Desbloqueado',
    description: 'Nadador Constante - 30 días seguidos',
    time: '',
    location: '',
    points: 500,
    timestamp: 'Hace 3 días',
    icon: Trophy,
    color: 'text-yellow-500'
  },
  {
    id: 5,
    type: 'workout',
    title: 'Entrenamiento de Ciclismo',
    description: '45km ruta por Tigre',
    time: '1h 35min',
    location: 'Delta del Tigre',
    points: 90,
    timestamp: 'Hace 4 días',
    icon: Activity,
    color: 'text-primary-500'
  }
]

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Actividad Reciente</h2>
        <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
          Ver todo
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
          >
            <div className={`p-2 rounded-lg bg-slate-700 ${activity.color}`}>
              <activity.icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{activity.title}</h3>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-accent-500" />
                  <span className="text-accent-500 font-medium">+{activity.points}</span>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm mt-1">{activity.description}</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>{activity.timestamp}</span>
                {activity.time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{activity.time}</span>
                  </div>
                )}
                {activity.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{activity.location}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-slate-400 hover:text-white text-sm transition-colors">
          Cargar más actividades
        </button>
      </div>
    </motion.div>
  )
}
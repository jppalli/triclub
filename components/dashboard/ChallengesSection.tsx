'use client'

import { motion } from 'framer-motion'
import { Target, Clock, Trophy, ArrowRight } from 'lucide-react'
import { calculateUserStats } from '@/lib/stats-calculator'

// Función para generar desafíos dinámicos basados en el historial del usuario
const generateDynamicChallenges = (userStats?: any) => {
  const weeklyProgress = userStats?.weeklyProgress || {
    swimming: 0,
    cycling: 0,
    running: 0,
    totalDistance: 0,
    workoutCount: 0
  }
  
  // Extraer datos de la semana actual
  const thisWeekSwimming = weeklyProgress.swimming || 0
  const thisWeekCycling = weeklyProgress.cycling || 0
  const thisWeekRunning = weeklyProgress.running || 0
  const thisWeekDistance = weeklyProgress.totalDistance || 0
  const thisWeekWorkoutCount = weeklyProgress.workoutCount || 0
  
  // Calcular días restantes de la semana
  const daysLeft = 7 - new Date().getDay()
  const currentDay = new Date().getDay() // 0 = domingo, 1 = lunes, etc.
  
  // Generar desafíos dinámicos basados en el día de la semana y progreso
  const allChallenges = [
    // Desafíos de Natación
    {
      id: 1,
      title: 'Nadador Semanal',
      description: 'Nada 5km esta semana',
      progress: Math.min((thisWeekSwimming / 5) * 100, 100),
      current: `${thisWeekSwimming.toFixed(1)}km`,
      target: '5km',
      timeLeft: `${daysLeft} días`,
      points: 150,
      difficulty: 'Fácil',
      color: 'from-blue-500 to-cyan-500',
      category: 'swimming'
    },
    {
      id: 2,
      title: 'Maratón Acuático',
      description: 'Nada 10km esta semana',
      progress: Math.min((thisWeekSwimming / 10) * 100, 100),
      current: `${thisWeekSwimming.toFixed(1)}km`,
      target: '10km',
      timeLeft: `${daysLeft} días`,
      points: 400,
      difficulty: 'Difícil',
      color: 'from-blue-600 to-indigo-600',
      category: 'swimming'
    },
    
    // Desafíos de Ciclismo
    {
      id: 3,
      title: 'Ciclista Urbano',
      description: 'Pedalea 100km esta semana',
      progress: Math.min((thisWeekCycling / 100) * 100, 100),
      current: `${thisWeekCycling.toFixed(1)}km`,
      target: '100km',
      timeLeft: `${daysLeft} días`,
      points: 250,
      difficulty: 'Medio',
      color: 'from-green-500 to-emerald-500',
      category: 'cycling'
    },
    {
      id: 4,
      title: 'Ruta Épica',
      description: 'Completa 200km en bicicleta',
      progress: Math.min((thisWeekCycling / 200) * 100, 100),
      current: `${thisWeekCycling.toFixed(1)}km`,
      target: '200km',
      timeLeft: `${daysLeft} días`,
      points: 500,
      difficulty: 'Épico',
      color: 'from-green-600 to-teal-600',
      category: 'cycling'
    },
    
    // Desafíos de Running
    {
      id: 5,
      title: 'Corredor Constante',
      description: 'Corre 25km esta semana',
      progress: Math.min((thisWeekRunning / 25) * 100, 100),
      current: `${thisWeekRunning.toFixed(1)}km`,
      target: '25km',
      timeLeft: `${daysLeft} días`,
      points: 200,
      difficulty: 'Medio',
      color: 'from-orange-500 to-red-500',
      category: 'running'
    },
    {
      id: 6,
      title: 'Maratonista',
      description: 'Corre 50km esta semana',
      progress: Math.min((thisWeekRunning / 50) * 100, 100),
      current: `${thisWeekRunning.toFixed(1)}km`,
      target: '50km',
      timeLeft: `${daysLeft} días`,
      points: 450,
      difficulty: 'Difícil',
      color: 'from-red-500 to-pink-500',
      category: 'running'
    },
    
    // Desafíos Generales
    {
      id: 7,
      title: 'Distancia Total',
      description: 'Completa 75km esta semana',
      progress: Math.min((thisWeekDistance / 75) * 100, 100),
      current: `${thisWeekDistance.toFixed(1)}km`,
      target: '75km',
      timeLeft: `${daysLeft} días`,
      points: 350,
      difficulty: 'Medio',
      color: 'from-purple-500 to-indigo-500',
      category: 'general'
    },
    {
      id: 8,
      title: 'Atleta Completo',
      description: 'Completa 150km esta semana',
      progress: Math.min((thisWeekDistance / 150) * 100, 100),
      current: `${thisWeekDistance.toFixed(1)}km`,
      target: '150km',
      timeLeft: `${daysLeft} días`,
      points: 600,
      difficulty: 'Épico',
      color: 'from-purple-600 to-pink-600',
      category: 'general'
    },
    
    // Desafíos de Constancia
    {
      id: 9,
      title: 'Constancia Básica',
      description: 'Entrena 3 veces esta semana',
      progress: Math.min((thisWeekWorkoutCount / 3) * 100, 100),
      current: `${thisWeekWorkoutCount}/3`,
      target: '3/3',
      timeLeft: `${daysLeft} días`,
      points: 150,
      difficulty: 'Fácil',
      color: 'from-yellow-500 to-orange-500',
      category: 'consistency'
    },
    {
      id: 10,
      title: 'Constancia Avanzada',
      description: 'Entrena 5 veces esta semana',
      progress: Math.min((thisWeekWorkoutCount / 5) * 100, 100),
      current: `${thisWeekWorkoutCount}/5`,
      target: '5/5',
      timeLeft: `${daysLeft} días`,
      points: 250,
      difficulty: 'Medio',
      color: 'from-yellow-600 to-red-600',
      category: 'consistency'
    },
    {
      id: 11,
      title: 'Máquina de Entrenar',
      description: 'Entrena todos los días (7/7)',
      progress: Math.min((thisWeekWorkoutCount / 7) * 100, 100),
      current: `${thisWeekWorkoutCount}/7`,
      target: '7/7',
      timeLeft: `${daysLeft} días`,
      points: 400,
      difficulty: 'Épico',
      color: 'from-red-600 to-pink-600',
      category: 'consistency'
    },
    
    // Desafíos Especiales (basados en día de la semana)
    {
      id: 12,
      title: 'Lunes Motivador',
      description: 'Completa un entrenamiento hoy',
      progress: currentDay === 1 && thisWeekWorkoutCount > 0 ? 100 : 0,
      current: currentDay === 1 && thisWeekWorkoutCount > 0 ? '1/1' : '0/1',
      target: '1/1',
      timeLeft: currentDay === 1 ? 'Hoy' : 'Próximo lunes',
      points: 50,
      difficulty: 'Fácil',
      color: 'from-blue-400 to-purple-400',
      category: 'daily',
      showOnlyOn: [1] // Solo mostrar los lunes
    },
    {
      id: 13,
      title: 'Miércoles de Fuerza',
      description: 'Entrena más de 60 minutos',
      progress: currentDay === 3 ? Math.min((thisWeekWorkoutCount * 45 / 60) * 100, 100) : 0,
      current: currentDay === 3 ? `${Math.min(thisWeekWorkoutCount * 45, 60)}min` : '0min',
      target: '60min',
      timeLeft: currentDay === 3 ? 'Hoy' : 'Próximo miércoles',
      points: 75,
      difficulty: 'Medio',
      color: 'from-green-400 to-blue-400',
      category: 'daily',
      showOnlyOn: [3] // Solo mostrar los miércoles
    },
    {
      id: 14,
      title: 'Viernes de Velocidad',
      description: 'Completa un entrenamiento intenso',
      progress: currentDay === 5 && thisWeekWorkoutCount > 0 ? 100 : 0,
      current: currentDay === 5 && thisWeekWorkoutCount > 0 ? '1/1' : '0/1',
      target: '1/1',
      timeLeft: currentDay === 5 ? 'Hoy' : 'Próximo viernes',
      points: 100,
      difficulty: 'Medio',
      color: 'from-orange-400 to-red-400',
      category: 'daily',
      showOnlyOn: [5] // Solo mostrar los viernes
    }
  ]
  
  // Filtrar desafíos basados en el día actual y progreso del usuario
  const availableChallenges = allChallenges.filter(challenge => {
    // Si es un desafío diario, solo mostrarlo en el día correcto
    if (challenge.showOnlyOn && !challenge.showOnlyOn.includes(currentDay)) {
      return false
    }
    
    // No mostrar desafíos ya completados (100%)
    if (challenge.progress >= 100) {
      return false
    }
    
    return true
  })
  
  // Seleccionar los 4 desafíos más relevantes
  const selectedChallenges = availableChallenges
    .sort((a, b) => {
      // Priorizar desafíos con progreso parcial
      if (a.progress > 0 && b.progress === 0) return -1
      if (b.progress > 0 && a.progress === 0) return 1
      
      // Luego por dificultad (fácil primero para usuarios nuevos)
      const difficultyOrder = { 'Fácil': 1, 'Medio': 2, 'Difícil': 3, 'Épico': 4 }
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
    })
    .slice(0, 4)
  
  return selectedChallenges
}

interface ChallengesSectionProps {
  userStats?: any
}

export default function ChallengesSection({ userStats }: ChallengesSectionProps) {
  const challenges = generateDynamicChallenges(userStats)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Desafíos Activos</h2>
        <Target className="h-6 w-6 text-primary-500" />
      </div>

      <div className="space-y-4">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-medium">{challenge.title}</h3>
                <p className="text-slate-400 text-sm">{challenge.description}</p>
              </div>
              <div className="text-right">
                <div className="text-accent-500 font-bold">+{challenge.points}</div>
                <div className="text-xs text-slate-400">{challenge.difficulty}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-300">{challenge.current}</span>
                <span className="text-slate-400">{challenge.target}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${challenge.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
            </div>

            {/* Time Left */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-slate-400 text-sm">
                <Clock className="h-3 w-3" />
                <span>{challenge.timeLeft} restantes</span>
              </div>
              <div className="text-slate-300 text-sm font-medium">
                {challenge.progress}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <button className="w-full border border-slate-600 text-slate-300 py-3 rounded-xl font-medium hover:border-slate-500 hover:text-white transition-all flex items-center justify-center gap-2">
          Ver Todos los Desafíos
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
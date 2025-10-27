'use client'

import { motion } from 'framer-motion'
import { Target, Clock, Trophy, ArrowRight } from 'lucide-react'

const challenges = [
  {
    id: 1,
    title: 'Nadador Semanal',
    description: 'Nada 5km esta semana',
    progress: 75,
    current: '3.75km',
    target: '5km',
    timeLeft: '2 días',
    points: 150,
    difficulty: 'Fácil',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Ciclista de Ruta',
    description: 'Completa 100km en bicicleta',
    progress: 45,
    current: '45km',
    target: '100km',
    timeLeft: '5 días',
    points: 300,
    difficulty: 'Medio',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 3,
    title: 'Triatleta Elite',
    description: 'Completa un triatlón simulado',
    progress: 20,
    current: '1/3',
    target: '3/3',
    timeLeft: '10 días',
    points: 500,
    difficulty: 'Difícil',
    color: 'from-purple-500 to-pink-500'
  }
]

export default function ChallengesSection() {
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
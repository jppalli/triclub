'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Target, Trophy, Clock, Users, Star, Zap, Calendar, Award } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

const activeChallenges = [
  {
    id: 1,
    title: 'Nadador Semanal',
    description: 'Nada 5km esta semana',
    type: 'individual',
    difficulty: 'Fácil',
    progress: 75,
    current: '3.75km',
    target: '5km',
    timeLeft: '2 días',
    points: 150,
    participants: 1,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Ciclista de Ruta',
    description: 'Completa 100km en bicicleta',
    type: 'individual',
    difficulty: 'Medio',
    progress: 45,
    current: '45km',
    target: '100km',
    timeLeft: '5 días',
    points: 300,
    participants: 1,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 3,
    title: 'Desafío del Club',
    description: 'Entrenar 3 veces esta semana',
    type: 'club',
    difficulty: 'Fácil',
    progress: 66,
    current: '2/3',
    target: '3/3',
    timeLeft: '3 días',
    points: 200,
    participants: 45,
    color: 'from-purple-500 to-pink-500'
  }
]

const availableChallenges = [
  {
    id: 4,
    title: 'Triatleta Elite',
    description: 'Completa un triatlón simulado completo',
    type: 'individual',
    difficulty: 'Difícil',
    duration: '2 semanas',
    points: 500,
    participants: 12,
    requirements: ['Natación: 1.5km', 'Ciclismo: 40km', 'Running: 10km']
  },
  {
    id: 5,
    title: 'Maratón de Enero',
    description: 'Corre un total de 42km durante el mes',
    type: 'individual',
    difficulty: 'Medio',
    duration: '1 mes',
    points: 400,
    participants: 28,
    requirements: ['42km de running total', 'Máximo 3 sesiones por semana']
  },
  {
    id: 6,
    title: 'Competencia de Clubes',
    description: 'Desafío entre todos los clubes de Argentina',
    type: 'club',
    difficulty: 'Épico',
    duration: '1 mes',
    points: 1000,
    participants: 156,
    requirements: ['Participación de todo el club', 'Entrenamientos grupales']
  }
]

const completedChallenges = [
  {
    id: 7,
    title: 'Nadador Constante',
    description: 'Nada 30 días seguidos',
    completedDate: '2024-01-10',
    points: 500,
    rank: 3,
    participants: 25
  },
  {
    id: 8,
    title: 'Velocista',
    description: 'Mejora tu tiempo en 5km',
    completedDate: '2024-01-05',
    points: 250,
    rank: 1,
    participants: 18
  }
]

export default function ChallengesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('activos')
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('triclub_user')
    if (!userData) {
      router.push('/triclub/login/')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-400 bg-green-400/20'
      case 'Medio': return 'text-yellow-400 bg-yellow-400/20'
      case 'Difícil': return 'text-red-400 bg-red-400/20'
      case 'Épico': return 'text-purple-400 bg-purple-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const tabs = [
    { id: 'activos', name: 'Activos', count: activeChallenges.length },
    { id: 'disponibles', name: 'Disponibles', count: availableChallenges.length },
    { id: 'completados', name: 'Completados', count: completedChallenges.length }
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Desafíos</h1>
          <p className="text-slate-300">
            Completa desafíos, gana puntos y compite con otros atletas
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <Trophy className="h-8 w-8 text-accent-500 mb-4" />
            <div className="text-2xl font-bold text-white mb-1">8</div>
            <div className="text-slate-400">Completados</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <Target className="h-8 w-8 text-primary-500 mb-4" />
            <div className="text-2xl font-bold text-white mb-1">3</div>
            <div className="text-slate-400">En progreso</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <Star className="h-8 w-8 text-yellow-500 mb-4" />
            <div className="text-2xl font-bold text-white mb-1">#3</div>
            <div className="text-slate-400">Ranking del club</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <Zap className="h-8 w-8 text-accent-500 mb-4" />
            <div className="text-2xl font-bold text-white mb-1">2,150</div>
            <div className="text-slate-400">Puntos ganados</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-700"
        >
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.name}
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-lg text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'activos' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-accent-500">
                          <Zap className="h-4 w-4" />
                          <span className="font-medium">+{challenge.points}</span>
                        </div>
                      </div>
                      <h3 className="text-white font-semibold text-lg">{challenge.title}</h3>
                      <p className="text-slate-400">{challenge.description}</p>
                    </div>
                    {challenge.type === 'club' && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{challenge.participants}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-300">{challenge.current}</span>
                      <span className="text-slate-400">{challenge.target}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className={`bg-gradient-to-r ${challenge.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-slate-300 text-sm font-medium">{challenge.progress}%</span>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{challenge.timeLeft}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 rounded-xl font-medium hover:from-primary-700 hover:to-accent-700 transition-all">
                    Continuar Desafío
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'disponibles' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {availableChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      {challenge.type === 'club' && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{challenge.participants}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-accent-500">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium">+{challenge.points}</span>
                    </div>
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-2">{challenge.title}</h3>
                  <p className="text-slate-400 mb-4">{challenge.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Duración: {challenge.duration}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-300 text-sm font-medium">Requisitos:</div>
                      {challenge.requirements.map((req, i) => (
                        <div key={i} className="text-slate-400 text-sm">• {req}</div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full border-2 border-primary-600 text-primary-400 py-3 rounded-xl font-medium hover:bg-primary-600 hover:text-white transition-all">
                    Unirse al Desafío
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'completados' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{challenge.title}</h3>
                      <p className="text-slate-400">{challenge.description}</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-500" />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">#{challenge.rank}</div>
                        <div className="text-slate-400 text-sm">Posición</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-500">+{challenge.points}</div>
                        <div className="text-slate-400 text-sm">Puntos</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-300">{challenge.completedDate}</div>
                      <div className="text-slate-400 text-sm">{challenge.participants} participantes</div>
                    </div>
                  </div>

                  <button className="w-full bg-slate-700 text-slate-300 py-3 rounded-xl font-medium hover:bg-slate-600 hover:text-white transition-all">
                    Ver Certificado
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
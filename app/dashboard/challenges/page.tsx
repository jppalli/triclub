'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Target, Trophy, Clock, Users, Star, Zap, Calendar, Award, Plus } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

export default function ChallengesPageSimple() {
  const [activeTab, setActiveTab] = useState('activos')

  // Usuario mock
  const user: User = {
    id: 1,
    name: 'Juan Pedro Palli',
    email: 'atleta@triclub.ar',
    club: 'Club Triatlón Buenos Aires',
    points: 2850,
    level: 'Elite',
    avatar: '/avatar-placeholder.jpg'
  }

  // Mock data para desafíos
  const activeChallenges = [
    {
      id: '1',
      title: 'Desafío Semanal: 50km',
      description: 'Completa 50km en cualquier combinación de deportes durante esta semana',
      difficulty: 'MEDIUM',
      points: 200,
      progress: 65,
      current: '32.5km',
      target: '50km',
      timeLeft: '2 días',
      type: 'INDIVIDUAL'
    },
    {
      id: '2',
      title: 'Constancia Semanal',
      description: 'Entrena al menos 4 días esta semana',
      difficulty: 'EASY',
      points: 100,
      progress: 75,
      current: '3/4',
      target: '4/4',
      timeLeft: '3 días',
      type: 'INDIVIDUAL'
    }
  ]

  const availableChallenges = [
    {
      id: '3',
      title: 'Maratón de Natación',
      description: 'Nada un total de 5km durante el mes',
      difficulty: 'HARD',
      points: 350,
      duration: 30,
      type: 'INDIVIDUAL'
    },
    {
      id: '4',
      title: 'Desafío del Club: 1000km',
      description: 'Entre todos los miembros del club, completemos 1000km este mes',
      difficulty: 'EPIC',
      points: 500,
      duration: 30,
      type: 'CLUB'
    }
  ]

  const completedChallenges = [
    {
      id: '5',
      title: 'Nadador Constante',
      description: 'Nada 30 días seguidos',
      completedDate: '2024-01-10',
      points: 500,
      difficulty: 'HARD'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-400 bg-green-400/20'
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/20'
      case 'HARD': return 'text-red-400 bg-red-400/20'
      case 'EPIC': return 'text-purple-400 bg-purple-400/20'
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
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Desafíos</h1>
          <p className="text-slate-300">
            Completa desafíos, gana puntos y compite con otros atletas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <Trophy className="h-8 w-8 text-accent-500 mb-4" />
            <div className="text-2xl font-bold text-white mb-1">{completedChallenges.length}</div>
            <div className="text-slate-400">Completados</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <Target className="h-8 w-8 text-primary-500 mb-4" />
            <div className="text-2xl font-bold text-white mb-1">{activeChallenges.length}</div>
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
        </div>

        {/* Tabs */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-700">
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
        </div>

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
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-300">{challenge.current}</span>
                      <span className="text-slate-400">{challenge.target}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500"
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
                      {challenge.type === 'CLUB' && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Club</span>
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
                      <span>Duración: {challenge.duration} días</span>
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
                        <div className="text-2xl font-bold text-white">✓</div>
                        <div className="text-slate-400 text-sm">Completado</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-500">+{challenge.points}</div>
                        <div className="text-slate-400 text-sm">Puntos</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-300">{challenge.completedDate}</div>
                      <div className="text-slate-400 text-sm">{challenge.difficulty}</div>
                    </div>
                  </div>

                  <button className="w-full bg-slate-700 text-slate-300 py-3 rounded-xl font-medium hover:bg-slate-600 hover:text-white transition-all">
                    Ver Detalles
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
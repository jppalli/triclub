'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Users, MessageCircle, Heart, Share2, Trophy, Star, MapPin, Calendar, Plus } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

const communityPosts = [
  {
    id: 1,
    author: 'María González',
    club: 'Club Náutico San Isidro',
    avatar: 'MG',
    time: '2 horas',
    content: '¡Acabo de completar mi primer triatlón olímpico! 🏊‍♀️🚴‍♀️🏃‍♀️ Tiempo: 2:45:30. Gracias a todos por el apoyo durante el entrenamiento.',
    image: true,
    likes: 24,
    comments: 8,
    shares: 3,
    achievement: 'Primer Triatlón Olímpico'
  },
  {
    id: 2,
    author: 'Carlos Mendoza',
    club: 'Club Triatlón Buenos Aires',
    avatar: 'CM',
    time: '4 horas',
    content: 'Entrenamiento matutino en Puerto Madero. Las condiciones estaban perfectas para correr. ¿Alguien se suma mañana a las 6 AM?',
    image: false,
    likes: 12,
    comments: 5,
    shares: 1,
    location: 'Puerto Madero, Buenos Aires'
  },
  {
    id: 3,
    author: 'Ana Rodríguez',
    club: 'Triatlón Rosario',
    avatar: 'AR',
    time: '1 día',
    content: 'Nuevo récord personal en natación: 1500m en 28:45! 💪 El entrenamiento de técnica está dando resultados.',
    image: false,
    likes: 18,
    comments: 12,
    shares: 2,
    achievement: 'Nuevo Récord Personal'
  }
]

const leaderboard = [
  { rank: 1, name: 'Diego Martín', club: 'Club Mendoza', points: 3250, level: 'Elite' },
  { rank: 2, name: 'Laura Fernández', club: 'La Plata Tri', points: 3180, level: 'Elite' },
  { rank: 3, name: 'Carlos Mendoza', club: 'Buenos Aires Tri', points: 2850, level: 'Elite' },
  { rank: 4, name: 'María González', club: 'San Isidro', points: 2720, level: 'Avanzado' },
  { rank: 5, name: 'Roberto Silva', club: 'Tucumán Tri', points: 2650, level: 'Avanzado' }
]

const upcomingEvents = [
  {
    id: 1,
    title: 'Triatlón de Tigre',
    date: '2024-02-15',
    location: 'Delta del Tigre',
    participants: 45,
    type: 'Competencia'
  },
  {
    id: 2,
    title: 'Entrenamiento Grupal',
    date: '2024-01-20',
    location: 'Club Náutico',
    participants: 12,
    type: 'Entrenamiento'
  },
  {
    id: 3,
    title: 'Charla: Nutrición Deportiva',
    date: '2024-01-25',
    location: 'Virtual',
    participants: 28,
    type: 'Educativo'
  }
]

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('feed')
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

  const tabs = [
    { id: 'feed', name: 'Feed', icon: MessageCircle },
    { id: 'ranking', name: 'Ranking', icon: Trophy },
    { id: 'eventos', name: 'Eventos', icon: Calendar }
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Comunidad</h1>
            <p className="text-slate-300">
              Conecta con otros triatletas y comparte tu progreso
            </p>
          </div>
          <button className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nueva Publicación
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <Users className="h-8 w-8 text-primary-500 mb-4" />
            <div className="text-2xl font-bold text-white mb-1">156</div>
            <div className="text-slate-400">Miembros activos</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <MessageCircle className="h-8 w-8 text-accent-500 mb-4" />
            <div className="text-2xl font-bold text-white mb-1">89</div>
            <div className="text-slate-400">Publicaciones hoy</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <Calendar className="h-8 w-8 text-primary-500 mb-4" />
            <div className="text-2xl font-bold text-white mb-1">12</div>
            <div className="text-slate-400">Eventos este mes</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <Trophy className="h-8 w-8 text-yellow-500 mb-4" />
            <div className="text-2xl font-bold text-white mb-1">#3</div>
            <div className="text-slate-400">Tu posición</div>
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
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'feed' && (
              <>
                {communityPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{post.avatar}</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold">{post.author}</div>
                          <div className="text-slate-400 text-sm">{post.club}</div>
                        </div>
                      </div>
                      <div className="text-slate-400 text-sm">{post.time}</div>
                    </div>

                    {/* Achievement Badge */}
                    {post.achievement && (
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-lg text-sm">
                          <Trophy className="h-4 w-4" />
                          {post.achievement}
                        </div>
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-slate-300">{post.content}</p>
                      {post.location && (
                        <div className="flex items-center gap-1 text-slate-400 text-sm mt-2">
                          <MapPin className="h-4 w-4" />
                          {post.location}
                        </div>
                      )}
                    </div>

                    {/* Post Image */}
                    {post.image && (
                      <div className="mb-4">
                        <div className="h-48 bg-slate-700 rounded-xl flex items-center justify-center">
                          <span className="text-slate-400">Imagen del entrenamiento</span>
                        </div>
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
                          <Heart className="h-5 w-5" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors">
                          <MessageCircle className="h-5 w-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-400 hover:text-accent-400 transition-colors">
                          <Share2 className="h-5 w-5" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}

            {activeTab === 'ranking' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
              >
                <h2 className="text-xl font-bold text-white mb-6">Ranking General</h2>
                <div className="space-y-4">
                  {leaderboard.map((athlete, index) => (
                    <div
                      key={athlete.rank}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        athlete.name === user.name ? 'bg-primary-600/20 border border-primary-500/30' : 'bg-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          athlete.rank === 1 ? 'bg-yellow-500 text-black' :
                          athlete.rank === 2 ? 'bg-slate-400 text-black' :
                          athlete.rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-slate-600 text-white'
                        }`}>
                          {athlete.rank}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{athlete.name}</div>
                          <div className="text-slate-400 text-sm">{athlete.club}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{athlete.points.toLocaleString()}</div>
                        <div className="text-slate-400 text-sm">{athlete.level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'eventos' && (
              <div className="space-y-6">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.participants} participantes
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        event.type === 'Competencia' ? 'bg-red-400/20 text-red-400' :
                        event.type === 'Entrenamiento' ? 'bg-blue-400/20 text-blue-400' :
                        'bg-green-400/20 text-green-400'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                      Unirse al Evento
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
            >
              <h3 className="text-white font-semibold mb-4">Tu Actividad</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Publicaciones</span>
                  <span className="text-white font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Likes recibidos</span>
                  <span className="text-white font-medium">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Comentarios</span>
                  <span className="text-white font-medium">34</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Seguidores</span>
                  <span className="text-white font-medium">45</span>
                </div>
              </div>
            </motion.div>

            {/* Top Athletes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
            >
              <h3 className="text-white font-semibold mb-4">Atletas Destacados</h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 3).map((athlete) => (
                  <div key={athlete.rank} className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {athlete.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{athlete.name}</div>
                      <div className="text-slate-400 text-xs">{athlete.points.toLocaleString()} pts</div>
                    </div>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
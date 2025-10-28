'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { 
  UserPlus, 
  Copy, 
  Share2, 
  Calendar, 
  Users, 
  Trophy, 
  Gift,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react'
import { calculateUserStats } from '@/lib/stats-calculator'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

export default function InvitationsPage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [invitations, setInvitations] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newInvite, setNewInvite] = useState({
    message: '',
    expiresInDays: 7,
    maxUses: 1
  })
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user) {
      const userStats = calculateUserStats('cmhabbtsv0000tmtguvd0b2lx')
      setUser({
        id: 1,
        name: session.user.name || 'Usuario',
        email: session.user.email || '',
        club: `TriClub ${userStats.level}`,
        points: userStats.totalPoints,
        level: userStats.level,
        avatar: session.user.image || '/avatar-placeholder.jpg'
      })
      
      loadInvitations()
    }
  }, [session, status, router])

  const loadInvitations = async () => {
    setIsLoading(true)
    try {
      // Por ahora usar datos mock hasta que tRPC esté funcionando
      const mockInvitations = [
        {
          id: '1',
          code: 'TRICLUB2024',
          message: 'Te invito a unirte a nuestro club de triatlón',
          status: 'PENDING',
          currentUses: 15,
          maxUses: 999,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          receiver: null
        },
        {
          id: '2',
          code: 'ELITE123',
          message: 'Código especial para atletas elite',
          status: 'PENDING',
          currentUses: 8,
          maxUses: 999,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          receiver: null
        },
        {
          id: '3',
          code: 'DEMO2024',
          message: 'Código de demostración - úsalo todas las veces que quieras',
          status: 'PENDING',
          currentUses: 25,
          maxUses: 999,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          receiver: null
        }
      ]

      const mockStats = {
        totalSent: 5,
        totalUsed: 48, // Total de usos (no códigos únicos)
        totalPending: 5, // Todos siguen activos
        totalExpired: 0,
        successRate: 95
      }

      setInvitations(mockInvitations)
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading invitations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateInvitation = async () => {
    setIsCreating(true)
    try {
      // Simular creación de invitación
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newCode = `TRI${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      const newInvitation = {
        id: Date.now().toString(),
        code: newCode,
        message: newInvite.message || 'Te invito a unirte a nuestro club',
        status: 'PENDING',
        currentUses: 0,
        maxUses: newInvite.maxUses,
        expiresAt: new Date(Date.now() + newInvite.expiresInDays * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        receiver: null
      }

      setInvitations([newInvitation, ...invitations])
      setShowCreateForm(false)
      setNewInvite({ message: '', expiresInDays: 7, maxUses: 1 })
      
      // Copiar código al portapapeles
      navigator.clipboard.writeText(newCode)
      alert(`¡Invitación creada! Código ${newCode} copiado al portapapeles.`)
    } catch (error) {
      console.error('Error creating invitation:', error)
      alert('Error al crear la invitación')
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    alert(`Código ${code} copiado al portapapeles`)
  }

  const shareInvitation = (code: string) => {
    const url = `${window.location.origin}/registro?code=${code}`
    navigator.clipboard.writeText(url)
    alert('Link de invitación copiado al portapapeles')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'USED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'EXPIRED':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string, maxUses: number) => {
    switch (status) {
      case 'PENDING':
        return maxUses >= 999 ? 'Reutilizable' : 'Activo'
      case 'USED':
        return 'Completado'
      case 'EXPIRED':
        return 'Expirado'
      default:
        return 'Desconocido'
    }
  }

  if (status === 'loading' || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Invitaciones</h1>
              <p className="text-slate-300">
                Invita a otros atletas a unirse a tu club y gana puntos por cada registro exitoso
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nueva Invitación
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Enviadas</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalSent || 0}</p>
              </div>
              <UserPlus className="h-8 w-8 text-primary-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Registros Exitosos</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalUsed || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.successRate || 0}%</p>
              </div>
              <Trophy className="h-8 w-8 text-accent-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Puntos Ganados</p>
                <p className="text-2xl font-bold text-white mt-1">{(stats.totalUsed || 0) * 200}</p>
              </div>
              <Gift className="h-8 w-8 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Create Invitation Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Crear Nueva Invitación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mensaje personalizado (opcional)
                </label>
                <textarea
                  value={newInvite.message}
                  onChange={(e) => setNewInvite({ ...newInvite, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Te invito a unirte a nuestro club de triatlón..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Expira en (días)
                  </label>
                  <select
                    value={newInvite.expiresInDays}
                    onChange={(e) => setNewInvite({ ...newInvite, expiresInDays: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={7}>7 días</option>
                    <option value={15}>15 días</option>
                    <option value={30}>30 días</option>
                    <option value={60}>60 días</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Máximo de usos
                  </label>
                  <select
                    value={newInvite.maxUses}
                    onChange={(e) => setNewInvite({ ...newInvite, maxUses: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={1}>1 uso</option>
                    <option value={3}>3 usos</option>
                    <option value={5}>5 usos</option>
                    <option value={10}>10 usos</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCreateInvitation}
                  disabled={isCreating}
                  className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isCreating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isCreating ? 'Creando...' : 'Crear Invitación'}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="border border-slate-600 text-slate-300 px-6 py-3 rounded-xl font-medium hover:border-slate-500 hover:text-white transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Invitations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Mis Invitaciones</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay invitaciones</h3>
              <p className="text-slate-400 mb-4">
                Crea tu primera invitación para empezar a invitar atletas
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all"
              >
                Crear Invitación
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation, index) => (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="bg-slate-600 text-white px-3 py-1 rounded-lg font-mono text-lg font-bold">
                          {invitation.code}
                        </code>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(invitation.status)}
                          <span className="text-sm text-slate-300">{getStatusText(invitation.status, invitation.maxUses)}</span>
                        </div>
                      </div>
                      
                      {invitation.message && (
                        <p className="text-slate-300 text-sm mb-2">"{invitation.message}"</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {invitation.currentUses} {invitation.maxUses >= 999 ? 'usos (ilimitado)' : `/${invitation.maxUses} usos`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Expira: {new Date(invitation.expiresAt).toLocaleDateString()}</span>
                        </div>
                        <span>Creado: {new Date(invitation.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(invitation.code)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                        title="Copiar código"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => shareInvitation(invitation.code)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                        title="Compartir link"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Benefits Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Beneficios de Invitar</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Gift className="h-12 w-12 text-accent-500 mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">200 Puntos</h4>
              <p className="text-primary-200 text-sm">Por cada registro exitoso</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-primary-500 mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Códigos Reutilizables</h4>
              <p className="text-primary-200 text-sm">Usa el mismo código múltiples veces</p>
            </div>
            <div className="text-center">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Sin Límites</h4>
              <p className="text-primary-200 text-sm">Invita a todos los que quieras</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Reconocimiento</h4>
              <p className="text-primary-200 text-sm">Badges especiales por invitar</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
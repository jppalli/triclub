'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Settings, User, Bell, Shield, Link, Smartphone, Mail, Eye, EyeOff } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('perfil')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    ciudad: '',
    club: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [notifications, setNotifications] = useState({
    entrenamientos: true,
    desafios: true,
    comunidad: false,
    marketplace: true,
    email: true,
    push: false
  })
  const [privacy, setPrivacy] = useState({
    perfilPublico: true,
    mostrarEstadisticas: true,
    mostrarUbicacion: false,
    permitirMensajes: true
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('triclub_user')
    if (!userData) {
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setFormData({
      nombre: parsedUser.name.split(' ')[0] || '',
      apellido: parsedUser.name.split(' ')[1] || '',
      email: parsedUser.email || '',
      telefono: '+54 11 1234-5678',
      ciudad: 'Buenos Aires',
      club: parsedUser.club || '',
      bio: 'Triatleta apasionado por los desafíos y la superación personal.',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'perfil', name: 'Perfil', icon: User },
    { id: 'notificaciones', name: 'Notificaciones', icon: Bell },
    { id: 'privacidad', name: 'Privacidad', icon: Shield },
    { id: 'conexiones', name: 'Conexiones', icon: Link }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNotificationChange = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications]
    })
  }

  const handlePrivacyChange = (key: string) => {
    setPrivacy({
      ...privacy,
      [key]: !privacy[key as keyof typeof privacy]
    })
  }

  const handleSave = () => {
    // Simular guardado
    alert('Configuración guardada exitosamente')
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
          <p className="text-slate-300">
            Personaliza tu experiencia en TriClub Argentina
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 h-fit"
          >
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'perfil' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Información Personal</h2>
                
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                        Cambiar Foto
                      </button>
                      <p className="text-slate-400 text-sm mt-2">JPG, PNG o GIF. Máximo 2MB.</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Club
                      </label>
                      <input
                        type="text"
                        name="club"
                        value={formData.club}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Biografía
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </div>

                  {/* Password Change */}
                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Cambiar Contraseña</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Contraseña Actual
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Nueva Contraseña
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Confirmar Contraseña
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notificaciones' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Notificaciones</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Actividades</h3>
                    <div className="space-y-4">
                      {Object.entries({
                        entrenamientos: 'Nuevos entrenamientos y logros',
                        desafios: 'Desafíos y competencias',
                        comunidad: 'Actividad de la comunidad',
                        marketplace: 'Nuevos productos y ofertas'
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-slate-300">{label}</span>
                          <button
                            onClick={() => handleNotificationChange(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Canales</h3>
                    <div className="space-y-4">
                      {Object.entries({
                        email: 'Notificaciones por email',
                        push: 'Notificaciones push'
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {key === 'email' ? <Mail className="h-5 w-5 text-slate-400" /> : <Smartphone className="h-5 w-5 text-slate-400" />}
                            <span className="text-slate-300">{label}</span>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'privacidad' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Privacidad y Seguridad</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Visibilidad del Perfil</h3>
                    <div className="space-y-4">
                      {Object.entries({
                        perfilPublico: 'Perfil público visible para otros usuarios',
                        mostrarEstadisticas: 'Mostrar estadísticas de entrenamiento',
                        mostrarUbicacion: 'Mostrar ubicación en entrenamientos',
                        permitirMensajes: 'Permitir mensajes de otros usuarios'
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-slate-300">{label}</span>
                          <button
                            onClick={() => handlePrivacyChange(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              privacy[key as keyof typeof privacy] ? 'bg-primary-600' : 'bg-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                privacy[key as keyof typeof privacy] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Datos y Privacidad</h3>
                    <div className="space-y-4">
                      <button className="w-full text-left p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                        <div className="text-white font-medium">Descargar mis datos</div>
                        <div className="text-slate-400 text-sm">Obtén una copia de toda tu información</div>
                      </button>
                      <button className="w-full text-left p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                        <div className="text-white font-medium">Eliminar cuenta</div>
                        <div className="text-slate-400 text-sm">Eliminar permanentemente tu cuenta y datos</div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'conexiones' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Conexiones y Dispositivos</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Dispositivos Conectados</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-700/30 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">G</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">Garmin Connect</div>
                              <div className="text-slate-400 text-sm">Conectado - Sincronizando datos</div>
                            </div>
                          </div>
                          <button className="text-red-400 hover:text-red-300 text-sm">
                            Desconectar
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-slate-700/30 rounded-xl border-2 border-dashed border-slate-600">
                        <div className="text-center">
                          <div className="text-slate-400 mb-2">Conectar nuevo dispositivo</div>
                          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                            + Agregar Dispositivo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Aplicaciones Conectadas</h3>
                    <div className="text-slate-400">
                      No hay aplicaciones de terceros conectadas a tu cuenta.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
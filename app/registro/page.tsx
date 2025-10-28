'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Key, User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function RegistroPage() {
  const [step, setStep] = useState(1) // 1: código, 2: registro, 3: éxito
  const [inviteCode, setInviteCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [inviteData, setInviteData] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: ''
  })

  // Códigos válidos de demo (para testing)
  const validCodes = ['TRICLUB2024', 'ELITE123', 'GARMIN456', 'BUENOS789']

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    setCodeError('')

    try {
      const response = await fetch('/api/validate-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: inviteCode }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setInviteData(data.invitation)
        setStep(2)
      } else {
        // Si falla la API, probar con códigos de demo
        if (validCodes.includes(inviteCode.toUpperCase())) {
          setInviteData({
            code: inviteCode,
            senderName: 'Demo Club',
            message: 'Bienvenido al club de demo',
            sender: { name: 'Demo Club', club: 'TriClub Demo' }
          })
          setStep(2)
        } else {
          setCodeError(data.error || 'Código de invitación inválido. Verifica con tu líder de club.')
        }
      }
    } catch (error) {
      console.error('Error validating code:', error)
      // Fallback a códigos de demo
      if (validCodes.includes(inviteCode.toUpperCase())) {
        setInviteData({
          code: inviteCode,
          senderName: 'Demo Club',
          message: 'Bienvenido al club de demo',
          sender: { name: 'Demo Club', club: 'TriClub Demo' }
        })
        setStep(2)
      } else {
        setCodeError('Error de conexión. Intenta nuevamente.')
      }
    } finally {
      setIsValidating(false)
    }
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsValidating(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteCode,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          city: formData.city
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStep(3)
      } else {
        alert(data.error || 'Error al crear la cuenta. Intenta nuevamente.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Error de conexión. Intenta nuevamente.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Paso 1: Validación de código
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Trophy className="h-10 w-10 text-accent-500" />
              <span className="text-2xl font-bold text-white">TriClub</span>
              <span className="text-lg text-slate-400">Argentina</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Código de Invitación</h1>
            <p className="text-slate-300">Ingresa el código que recibiste de tu líder de club</p>
          </motion.div>

          {/* Code Form */}
          <motion.div
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Código de Invitación
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase tracking-wider"
                    placeholder="TRICLUB2024"
                    required
                  />
                </div>
                {codeError && (
                  <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {codeError}
                  </div>
                )}
              </div>

              {/* Demo Codes */}
              <div className="bg-primary-600/20 border border-primary-500/30 rounded-xl p-4">
                <h3 className="text-primary-300 font-medium mb-2">Códigos de Demo:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {validCodes.map(code => (
                    <div key={code} className="text-primary-400 font-mono">{code}</div>
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isValidating || !inviteCode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Validar Código
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                ¿No tienes código? 
                <a href="/unirse" className="text-primary-400 hover:text-primary-300 ml-1">
                  Solicita unirte al club
                </a>
              </p>
              <a href="/" className="text-slate-500 hover:text-slate-400 text-sm mt-2 inline-block">
                ← Volver al inicio
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Paso 2: Formulario de registro
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Trophy className="h-10 w-10 text-accent-500" />
              <span className="text-2xl font-bold text-white">TriClub</span>
              <span className="text-lg text-slate-400">Argentina</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-400 text-sm">Código válido: {inviteCode}</span>
            </div>
            {inviteData?.senderName && (
              <div className="bg-primary-600/20 border border-primary-500/30 rounded-xl p-4 mb-4">
                <p className="text-primary-300 text-sm">
                  Invitado por: <span className="font-semibold">{inviteData.senderName}</span>
                </p>
                {inviteData.message && (
                  <p className="text-primary-400 text-sm mt-1">"{inviteData.message}"</p>
                )}
              </div>
            )}
            <h1 className="text-3xl font-bold text-white mb-2">Crear tu Cuenta</h1>
            <p className="text-slate-300">Completa tus datos para finalizar el registro</p>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleRegistration} className="space-y-6">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isValidating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Crear Cuenta
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    )
  }

  // Paso 3: Éxito
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">¡Bienvenido a TriClub!</h1>
          <p className="text-slate-300 mb-6">
            Tu cuenta ha sido creada exitosamente. Ya puedes acceder a todas las funcionalidades 
            de la plataforma y comenzar tu journey en TriClub Argentina.
          </p>
          <div className="space-y-3">
            <a
              href="/login"
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all inline-flex items-center justify-center gap-2"
            >
              Iniciar Sesión
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/"
              className="w-full border border-slate-600 text-slate-300 py-3 rounded-xl font-medium hover:border-slate-500 hover:text-white transition-all inline-block"
            >
              Volver al Inicio
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
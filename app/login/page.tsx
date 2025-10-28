'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        alert('Credenciales incorrectas. Usa: atleta@triclub.ar / triclub123')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error durante el login:', error)
      alert('Error durante el login. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
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
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
          <p className="text-slate-300">Ingresa a tu cuenta para continuar</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Demo Credentials */}
            <div className="bg-primary-600/20 border border-primary-500/30 rounded-xl p-4">
              <h3 className="text-primary-300 font-medium mb-2">Credenciales de Demo:</h3>
              <p className="text-sm text-slate-300">Email: <span className="text-primary-400">atleta@triclub.ar</span></p>
              <p className="text-sm text-slate-300">Contraseña: <span className="text-primary-400">triclub123</span></p>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Ingresar
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
            <div className="text-slate-500 text-sm">
              ¿No tienes cuenta? 
              <a href="/" className="text-primary-400 hover:text-primary-300 ml-1">
                Solicitar invitación
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
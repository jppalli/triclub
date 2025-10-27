'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Trophy } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.a
            href="/triclub/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Trophy className="h-8 w-8 text-accent-500" />
            <span className="text-xl font-bold text-white">TriClub</span>
            <span className="text-sm text-slate-400">Argentina</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-8">
            <nav className="flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                Características
              </a>
              <a href="#points" className="text-slate-300 hover:text-white transition-colors">
                Sistema de Puntos
              </a>
              <a href="#marketplace" className="text-slate-300 hover:text-white transition-colors">
                Marketplace
              </a>
            </nav>
            
            {/* Login Section - Right Side */}
            <div className="flex items-center space-x-4">
              <a href="/triclub/registro/" className="text-slate-300 hover:text-primary-400 transition-colors text-sm">
                Ya tengo Invitación
              </a>
              <motion.a
                href="/triclub/login/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block"
              >
                Iniciar Sesión
              </motion.a>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-slate-700"
          >
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                Características
              </a>
              <a href="#points" className="text-slate-300 hover:text-white transition-colors">
                Sistema de Puntos
              </a>
              <a href="#marketplace" className="text-slate-300 hover:text-white transition-colors">
                Marketplace
              </a>
              
              {/* Mobile Login Section */}
              <div className="border-t border-slate-600 pt-4 space-y-3">
                <a href="/triclub/registro/" className="text-slate-300 hover:text-primary-400 transition-colors text-sm block text-center">
                  Ya tengo Invitación
                </a>
                <a href="/triclub/login/" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block w-full text-center">
                  Iniciar Sesión
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}
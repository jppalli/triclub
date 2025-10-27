'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Plus, Star, TrendingUp } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

interface MarketplaceHeaderProps {
  user: User
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function MarketplaceHeader({ user, activeTab, setActiveTab }: MarketplaceHeaderProps) {
  const tabs = [
    { id: 'comprar', name: 'Comprar', icon: ShoppingBag },
    { id: 'vender', name: 'Vender', icon: Plus },
    { id: 'mis-productos', name: 'Mis Productos', icon: TrendingUp }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
            <p className="text-slate-300">
              Compra y vende equipamiento deportivo con la comunidad
            </p>
          </div>
          
          {/* Points Balance */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-accent-500" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {user.points.toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm">Puntos disponibles</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
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

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-white">156</div>
          <div className="text-slate-400 text-sm">Productos disponibles</div>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-white">23</div>
          <div className="text-slate-400 text-sm">Vendidos esta semana</div>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-white">89%</div>
          <div className="text-slate-400 text-sm">Satisfacción promedio</div>
        </div>
      </motion.div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Trophy, 
  Home, 
  Activity, 
  Target, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Star
} from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
}

const navigation = [
  { name: 'Dashboard', href: '/triclub/dashboard/', icon: Home, current: true },
  { name: 'Entrenamientos', href: '/triclub/dashboard/workouts/', icon: Activity, current: false },
  { name: 'Desafíos', href: '/triclub/dashboard/challenges/', icon: Target, current: false },
  { name: 'Marketplace', href: '/triclub/dashboard/marketplace/', icon: ShoppingBag, current: false },
  { name: 'Comunidad', href: '/triclub/dashboard/community/', icon: Users, current: false },
  { name: 'Configuración', href: '/triclub/dashboard/settings/', icon: Settings, current: false },
]

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('triclub_user')
    router.push('/triclub/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700"
          >
            <SidebarContent 
              navigation={navigation} 
              user={user} 
              onLogout={handleLogout}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-slate-800 border-r border-slate-700">
          <SidebarContent 
            navigation={navigation} 
            user={user} 
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative text-slate-400 hover:text-white">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent-500 rounded-full"></span>
              </button>

              {/* Points Display */}
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-lg">
                <Star className="h-4 w-4 text-accent-500" />
                <span className="text-white font-medium">{user.points.toLocaleString()}</span>
                <span className="text-slate-400 text-sm">pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ 
  navigation, 
  user, 
  onLogout, 
  onClose 
}: { 
  navigation: any[]
  user: User
  onLogout: () => void
  onClose?: () => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Trophy className="h-8 w-8 text-accent-500" />
          <span className="text-xl font-bold text-white">TriClub</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* User Profile */}
      <div className="px-6 pb-6">
        <div className="bg-slate-700/50 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user.name}</p>
              <p className="text-slate-400 text-sm truncate">{user.club}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-slate-300 text-sm">Nivel {user.level}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-accent-500" />
              <span className="text-white font-medium">{user.points}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 pb-6">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </>
  )
}
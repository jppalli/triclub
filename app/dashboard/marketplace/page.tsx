'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid'
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters'
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

export default function MarketplacePage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('comprar')
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    condition: 'all',
    sortBy: 'newest'
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('triclub_user')
    if (!userData) {
      router.push('/login/')
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

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <MarketplaceHeader 
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MarketplaceFilters 
              filters={filters}
              setFilters={setFilters}
            />
          </div>
          
          <div className="lg:col-span-3">
            <MarketplaceGrid 
              activeTab={activeTab}
              filters={filters}
              user={user}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
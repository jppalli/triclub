'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Users, 
  Target, 
  Zap, 
  ShoppingBag, 
  Activity,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import PointsSystem from '@/components/PointsSystem'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <Hero />
      <Features />
      <PointsSystem />
      <Footer />
    </main>
  )
}
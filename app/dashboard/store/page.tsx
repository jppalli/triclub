'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Store, Star, Zap, ShoppingCart, Filter, Search, Award, Crown } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

const officialProducts = [
  {
    id: 1,
    name: 'Garmin Forerunner 965',
    brand: 'Garmin',
    category: 'Relojes GPS',
    originalPrice: 320000,
    pointsDiscount: 5000,
    finalPrice: 270000,
    pointsRequired: 5000,
    image: '/api/placeholder/300/200',
    rating: 4.9,
    reviews: 156,
    features: ['GPS multibanda', 'Mapas a color', 'Música', 'Pagos sin contacto'],
    official: true,
    exclusive: true
  },
  {
    id: 2,
    name: 'Wetsuit Orca Openwater Core',
    brand: 'Orca',
    category: 'Natación',
    originalPrice: 180000,
    pointsDiscount: 3000,
    finalPrice: 150000,
    pointsRequired: 3000,
    image: '/api/placeholder/300/200',
    rating: 4.8,
    reviews: 89,
    features: ['Neopreno Yamamoto', 'Flexibilidad total', 'Flotabilidad optimizada'],
    official: true,
    exclusive: false
  },
  {
    id: 3,
    name: 'Bicicleta Trek Madone SL 6',
    brand: 'Trek',
    category: 'Ciclismo',
    originalPrice: 850000,
    pointsDiscount: 10000,
    finalPrice: 750000,
    pointsRequired: 10000,
    image: '/api/placeholder/300/200',
    rating: 4.9,
    reviews: 234,
    features: ['Carbono OCLV 500', 'Aerodinámica avanzada', 'Shimano 105'],
    official: true,
    exclusive: true
  },
  {
    id: 4,
    name: 'Zapatillas Asics Gel-Nimbus 25',
    brand: 'Asics',
    category: 'Running',
    originalPrice: 95000,
    pointsDiscount: 1500,
    finalPrice: 80000,
    pointsRequired: 1500,
    image: '/api/placeholder/300/200',
    rating: 4.7,
    reviews: 312,
    features: ['Gel en talón y antepié', 'FlyteFoam Blast+', 'Engineered mesh'],
    official: true,
    exclusive: false
  },
  {
    id: 5,
    name: 'Kit Nutrición Deportiva Pro',
    brand: 'TriClub',
    category: 'Nutrición',
    originalPrice: 45000,
    pointsDiscount: 800,
    finalPrice: 37000,
    pointsRequired: 800,
    image: '/api/placeholder/300/200',
    rating: 4.6,
    reviews: 78,
    features: ['Geles energéticos', 'Sales minerales', 'Bebida isotónica'],
    official: true,
    exclusive: true
  },
  {
    id: 6,
    name: 'Casco Giro Aether MIPS',
    brand: 'Giro',
    category: 'Ciclismo',
    originalPrice: 120000,
    pointsDiscount: 2000,
    finalPrice: 100000,
    pointsRequired: 2000,
    image: '/api/placeholder/300/200',
    rating: 4.8,
    reviews: 145,
    features: ['Tecnología MIPS', 'Ventilación superior', 'Ajuste Roc Loc 5+'],
    official: true,
    exclusive: false
  }
]

export default function StorePage() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [sortBy, setSortBy] = useState('featured')
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

  const categories = [
    'todos',
    'relojes-gps',
    'natacion',
    'ciclismo',
    'running',
    'nutricion',
    'accesorios'
  ]

  const canAfford = (pointsRequired: number) => {
    return user.points >= pointsRequired
  }

  const getDiscountPercentage = (original: number, final: number) => {
    return Math.round(((original - final) / original) * 100)
  }

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
            <div className="flex items-center gap-3 mb-2">
              <Store className="h-8 w-8 text-accent-500" />
              <h1 className="text-3xl font-bold text-white">Tienda Oficial</h1>
              <Award className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-slate-300">
              Productos oficiales con descuentos exclusivos usando tus puntos
            </p>
          </div>
          
          {/* Points Balance */}
          <div className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-accent-500" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {user.points.toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm">Puntos disponibles</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Beneficios Exclusivos</h2>
              <p className="text-blue-100">
                Usa tus puntos para obtener descuentos únicos en productos oficiales de las mejores marcas
              </p>
            </div>
            <Crown className="h-16 w-16 text-yellow-300" />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {category.replace('-', ' ')}
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="featured">Destacados</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
                <option value="points-low">Puntos: menor a mayor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {officialProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all group"
            >
              {/* Product Image */}
              <div className="relative">
                <div className="h-48 bg-slate-700 flex items-center justify-center">
                  <span className="text-slate-400">Imagen del producto</span>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <div className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    Oficial
                  </div>
                  {product.exclusive && (
                    <div className="bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Exclusivo
                    </div>
                  )}
                </div>

                {/* Discount Badge */}
                <div className="absolute top-3 right-3 bg-accent-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  -{getDiscountPercentage(product.originalPrice, product.finalPrice)}%
                </div>
              </div>

              <div className="p-6">
                {/* Brand & Category */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary-400 text-sm font-medium">{product.brand}</span>
                  <span className="text-slate-400 text-xs">{product.category}</span>
                </div>

                {/* Product Name */}
                <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-primary-400 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-slate-400 text-sm">({product.reviews} reseñas)</span>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="text-slate-400 text-sm mb-2">Características:</div>
                  <div className="space-y-1">
                    {product.features.slice(0, 2).map((feature, i) => (
                      <div key={i} className="text-slate-300 text-xs">• {feature}</div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-slate-400 text-sm line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1 text-accent-500">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm font-medium">-{product.pointsRequired}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${product.finalPrice.toLocaleString()}
                  </div>
                  <div className="text-slate-400 text-sm">
                    Requiere {product.pointsRequired.toLocaleString()} puntos
                  </div>
                </div>

                {/* Action Button */}
                <button
                  disabled={!canAfford(product.pointsRequired)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    canAfford(product.pointsRequired)
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-700 hover:to-accent-700'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {canAfford(product.pointsRequired) ? 'Comprar Ahora' : 'Puntos Insuficientes'}
                </button>

                {!canAfford(product.pointsRequired) && (
                  <div className="text-center mt-2">
                    <span className="text-slate-400 text-xs">
                      Te faltan {(product.pointsRequired - user.points).toLocaleString()} puntos
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">¿Cómo Funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">1. Gana Puntos</h3>
              <p className="text-slate-400 text-sm">
                Completa entrenamientos, desafíos y participa en la comunidad para ganar puntos
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">2. Elige Productos</h3>
              <p className="text-slate-400 text-sm">
                Selecciona productos oficiales de las mejores marcas deportivas
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">3. Compra con Descuento</h3>
              <p className="text-slate-400 text-sm">
                Usa tus puntos para obtener descuentos exclusivos y paga el resto en efectivo
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
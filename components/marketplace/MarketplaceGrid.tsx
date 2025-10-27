'use client'

import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Eye, MapPin, Clock, Zap } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

interface Filters {
  category: string
  priceRange: string
  condition: string
  sortBy: string
}

interface MarketplaceGridProps {
  activeTab: string
  filters: Filters
  user: User
}

// Mock data for products
const mockProducts = [
  {
    id: 1,
    title: 'Garmin Forerunner 945',
    price: 180000,
    pointsDiscount: 1500,
    finalPrice: 165000,
    condition: 'como-nuevo',
    category: 'relojes',
    image: '/api/placeholder/300/200',
    seller: 'María González',
    location: 'Buenos Aires',
    rating: 4.8,
    reviews: 23,
    timePosted: '2 horas',
    description: 'Reloj GPS premium para triatlón, usado solo 3 meses'
  },
  {
    id: 2,
    title: 'Bicicleta Trek Domane SL5',
    price: 450000,
    pointsDiscount: 3000,
    finalPrice: 420000,
    condition: 'usado-bueno',
    category: 'ciclismo',
    image: '/api/placeholder/300/200',
    seller: 'Carlos Mendoza',
    location: 'Córdoba',
    rating: 4.9,
    reviews: 15,
    timePosted: '1 día',
    description: 'Bicicleta de ruta carbono, excelente estado'
  },
  {
    id: 3,
    title: 'Wetsuit Orca Openwater',
    price: 85000,
    pointsDiscount: 800,
    finalPrice: 77000,
    condition: 'nuevo',
    category: 'natacion',
    image: '/api/placeholder/300/200',
    seller: 'Ana Rodríguez',
    location: 'Rosario',
    rating: 5.0,
    reviews: 8,
    timePosted: '3 días',
    description: 'Traje de neopreno nuevo, talla M'
  },
  {
    id: 4,
    title: 'Zapatillas Asics Gel-Kayano 29',
    price: 45000,
    pointsDiscount: 400,
    finalPrice: 41000,
    condition: 'usado-bueno',
    category: 'running',
    image: '/api/placeholder/300/200',
    seller: 'Diego Martín',
    location: 'Mendoza',
    rating: 4.7,
    reviews: 12,
    timePosted: '5 días',
    description: 'Zapatillas de running, 200km de uso'
  },
  {
    id: 5,
    title: 'Casco Giro Aether MIPS',
    price: 95000,
    pointsDiscount: 900,
    finalPrice: 86000,
    condition: 'como-nuevo',
    category: 'ciclismo',
    image: '/api/placeholder/300/200',
    seller: 'Laura Fernández',
    location: 'La Plata',
    rating: 4.9,
    reviews: 6,
    timePosted: '1 semana',
    description: 'Casco premium con tecnología MIPS'
  },
  {
    id: 6,
    title: 'Gafas Oakley Radar EV',
    price: 35000,
    pointsDiscount: 300,
    finalPrice: 32000,
    condition: 'nuevo',
    category: 'accesorios',
    image: '/api/placeholder/300/200',
    seller: 'Roberto Silva',
    location: 'Tucumán',
    rating: 4.8,
    reviews: 19,
    timePosted: '2 semanas',
    description: 'Gafas deportivas con lentes intercambiables'
  }
]

const myProducts = [
  {
    id: 101,
    title: 'Rodillo Elite Direto XR',
    price: 120000,
    condition: 'usado-bueno',
    category: 'ciclismo',
    image: '/api/placeholder/300/200',
    views: 45,
    likes: 8,
    status: 'activo',
    timePosted: '3 días'
  },
  {
    id: 102,
    title: 'Combo Natación Speedo',
    price: 25000,
    condition: 'como-nuevo',
    category: 'natacion',
    image: '/api/placeholder/300/200',
    views: 23,
    likes: 5,
    status: 'vendido',
    timePosted: '1 semana'
  }
]

export default function MarketplaceGrid({ activeTab, filters, user }: MarketplaceGridProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'nuevo': return 'text-green-400'
      case 'como-nuevo': return 'text-blue-400'
      case 'usado-bueno': return 'text-yellow-400'
      case 'usado-regular': return 'text-orange-400'
      default: return 'text-slate-400'
    }
  }

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'nuevo': return 'Nuevo'
      case 'como-nuevo': return 'Como nuevo'
      case 'usado-bueno': return 'Usado - Buen estado'
      case 'usado-regular': return 'Usado - Estado regular'
      default: return condition
    }
  }

  if (activeTab === 'vender') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 text-center"
      >
        <ShoppingCart className="h-16 w-16 text-primary-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Vender Producto</h2>
        <p className="text-slate-300 mb-8 max-w-md mx-auto">
          Publica tu equipamiento deportivo y gana puntos por cada venta exitosa
        </p>
        <button className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all">
          Publicar Producto
        </button>
      </motion.div>
    )
  }

  if (activeTab === 'mis-productos') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Mis Productos</h2>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
            Nuevo Producto
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all"
            >
              <div className="relative">
                <div className="h-48 bg-slate-700 flex items-center justify-center">
                  <span className="text-slate-400">Imagen del producto</span>
                </div>
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium ${
                  product.status === 'activo' ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'
                }`}>
                  {product.status === 'activo' ? 'Activo' : 'Vendido'}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.title}</h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl font-bold text-white">
                    ${product.price.toLocaleString()}
                  </div>
                  <div className={`text-sm font-medium ${getConditionColor(product.condition)}`}>
                    {getConditionText(product.condition)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{product.views} vistas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{product.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{product.timePosted}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-700 text-white py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors">
                    Editar
                  </button>
                  <button className="flex-1 border border-slate-600 text-slate-300 py-2 rounded-lg font-medium hover:border-slate-500 hover:text-white transition-colors">
                    Ver Stats
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Default: Comprar tab
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all group cursor-pointer"
        >
          <div className="relative">
            <div className="h-48 bg-slate-700 flex items-center justify-center">
              <span className="text-slate-400">Imagen del producto</span>
            </div>
            <button className="absolute top-3 right-3 p-2 bg-slate-800/80 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
              <Heart className="h-4 w-4" />
            </button>
            {product.pointsDiscount > 0 && (
              <div className="absolute top-3 left-3 bg-accent-600 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                <Zap className="h-3 w-3" />
                -{product.pointsDiscount} pts
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
              {product.title}
            </h3>
            
            <p className="text-slate-400 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-3">
              <div>
                {product.pointsDiscount > 0 ? (
                  <div>
                    <div className="text-slate-400 text-sm line-through">
                      ${product.price.toLocaleString()}
                    </div>
                    <div className="text-xl font-bold text-white">
                      ${product.finalPrice.toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-xl font-bold text-white">
                    ${product.price.toLocaleString()}
                  </div>
                )}
              </div>
              <div className={`text-sm font-medium ${getConditionColor(product.condition)}`}>
                {getConditionText(product.condition)}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{product.rating}</span>
                <span>({product.reviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
              </div>
            </div>

            <div className="text-slate-400 text-sm mb-4">
              Por {product.seller} • {product.timePosted}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white py-2 rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 transition-all">
                Comprar
              </button>
              <button className="px-4 border border-slate-600 text-slate-300 py-2 rounded-lg hover:border-slate-500 hover:text-white transition-colors">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
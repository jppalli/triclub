'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Store, Star, Zap, ShoppingCart, Search, Award, Crown, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { calculateUserStats } from '@/lib/stats-calculator'
import CartSidebar from '@/components/store/CartSidebar'

interface User {
  id: number
  name: string
  email: string
  club: string
  points: number
  level: string
  avatar: string
}

export default function StorePage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const router = useRouter()

  // Estado para productos
  const [productsData, setProductsData] = useState<any>(null)
  const [productsLoading, setProductsLoading] = useState(true)

  // Función para cargar productos
  const loadProducts = async () => {
    setProductsLoading(true)
    try {
      const params = new URLSearchParams({
        sortBy,
        limit: '20',
        offset: '0'
      })
      
      if (selectedCategory !== 'todos') {
        params.append('category', selectedCategory)
      }
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      console.log('📦 Products loaded:', data)
      setProductsData(data)
    } catch (error) {
      console.error('❌ Error loading products:', error)
    } finally {
      setProductsLoading(false)
    }
  }

  // Cargar productos cuando cambien los filtros
  useEffect(() => {
    loadProducts()
  }, [selectedCategory, sortBy, searchTerm])

  // Estado temporal del carrito (por ahora sin tRPC)
  const [cartData, setCartData] = useState<any>({ summary: { itemCount: 0 } })
  const [addToCartLoading, setAddToCartLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user) {
      const stats = calculateUserStats('cmhabbtsv0000tmtguvd0b2lx')
      setUser({
        id: 1,
        name: session.user.name || 'Usuario',
        email: session.user.email || '',
        club: `TriClub ${stats.level}`,
        points: stats.totalPoints,
        level: stats.level,
        avatar: session.user.image || '/avatar-placeholder.jpg'
      })
    }
  }, [session, status, router])

  if (status === 'loading' || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const categories = [
    { key: 'todos', label: 'Todos' },
    { key: 'watches-gps', label: 'Relojes GPS' },
    { key: 'swimming', label: 'Natación' },
    { key: 'cycling', label: 'Ciclismo' },
    { key: 'running', label: 'Running' },
    { key: 'nutrition', label: 'Nutrición' },
    { key: 'accessories', label: 'Accesorios' }
  ]

  const canAfford = (pointsRequired: number) => {
    return user.points >= pointsRequired
  }

  const getDiscountPercentage = (original: number, final: number) => {
    return Math.round(((original - final) / original) * 100)
  }

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS'
    })
  }

  const handleAddToCart = async (productId: string) => {
    setAddToCartLoading(true)
    try {
      // Por ahora solo mostrar el carrito
      console.log('Adding to cart:', productId)
      setIsCartOpen(true)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddToCartLoading(false)
    }
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

          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-4 hover:border-slate-600 transition-all"
            >
              <ShoppingCart className="h-6 w-6 text-white" />
              {cartData?.summary.itemCount ? (
                <div className="absolute -top-2 -right-2 bg-accent-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartData.summary.itemCount}
                </div>
              ) : null}
            </button>

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
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category.key
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-700"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-6 bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData?.products.map((product, index) => (
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
                    {product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling!.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      Imagen del producto
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      Oficial
                    </div>
                    {product.isExclusive && (
                      <div className="bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Exclusivo
                      </div>
                    )}
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3 bg-accent-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    -{getDiscountPercentage(product.originalPrice, product.currentPrice)}%
                  </div>

                  {/* Stock Badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute bottom-3 left-3 bg-orange-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      ¡Últimas {product.stock} unidades!
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute bottom-3 left-3 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      Sin stock
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Brand & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-primary-400 text-sm font-medium">{product.brand}</span>
                    <span className="text-slate-400 text-xs capitalize">{product.category.toLowerCase().replace('_', ' ')}</span>
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
                    <span className="text-slate-400 text-sm">({product.reviewCount} reseñas)</span>
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
                        {formatPrice(product.originalPrice)}
                      </span>
                      <div className="flex items-center gap-1 text-accent-500">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm font-medium">-{product.pointsDiscount}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(product.currentPrice)}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Requiere {product.pointsRequired.toLocaleString()} puntos
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!canAfford(product.pointsRequired) || product.stock === 0 || addToCartLoading}
                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      canAfford(product.pointsRequired) && product.stock > 0
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-700 hover:to-accent-700'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {addToCartLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {product.stock === 0 ? (
                          'Sin Stock'
                        ) : canAfford(product.pointsRequired) ? (
                          <>
                            <Plus className="h-4 w-4" />
                            Agregar al Carrito
                          </>
                        ) : (
                          'Puntos Insuficientes'
                        )}
                      </>
                    )}
                  </button>

                  {!canAfford(product.pointsRequired) && product.stock > 0 && (
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
        )}

        {/* No products found */}
        {!productsLoading && productsData?.products.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron productos</h3>
            <p className="text-slate-400">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay productos disponibles en esta categoría'}
            </p>
          </div>
        )}

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

        {/* Cart Sidebar */}
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </DashboardLayout>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Filter, Search } from 'lucide-react'

interface Filters {
  category: string
  priceRange: string
  condition: string
  sortBy: string
}

interface MarketplaceFiltersProps {
  filters: Filters
  setFilters: (filters: Filters) => void
}

export default function MarketplaceFilters({ filters, setFilters }: MarketplaceFiltersProps) {
  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'natacion', label: 'Natación' },
    { value: 'ciclismo', label: 'Ciclismo' },
    { value: 'running', label: 'Running' },
    { value: 'accesorios', label: 'Accesorios' },
    { value: 'ropa', label: 'Ropa deportiva' },
    { value: 'relojes', label: 'Relojes y GPS' }
  ]

  const priceRanges = [
    { value: 'all', label: 'Todos los precios' },
    { value: '0-50', label: 'Hasta $50.000' },
    { value: '50-100', label: '$50.000 - $100.000' },
    { value: '100-200', label: '$100.000 - $200.000' },
    { value: '200+', label: 'Más de $200.000' }
  ]

  const conditions = [
    { value: 'all', label: 'Todas las condiciones' },
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'como-nuevo', label: 'Como nuevo' },
    { value: 'usado-bueno', label: 'Usado - Buen estado' },
    { value: 'usado-regular', label: 'Usado - Estado regular' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'price-low', label: 'Precio: menor a mayor' },
    { value: 'price-high', label: 'Precio: mayor a menor' },
    { value: 'popular', label: 'Más populares' }
  ]

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters({
      ...filters,
      [key]: value
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 h-fit"
    >
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary-500" />
        <h2 className="text-lg font-semibold text-white">Filtros</h2>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Rango de precio
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Estado
          </label>
          <select
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            {conditions.map((condition) => (
              <option key={condition.value} value={condition.value}>
                {condition.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Ordenar por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => setFilters({
            category: 'all',
            priceRange: 'all',
            condition: 'all',
            sortBy: 'newest'
          })}
          className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </motion.div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { 
  Star, 
  Activity, 
  Target, 
  Users, 
  ShoppingBag, 
  Trophy,
  Zap,
  Gift
} from 'lucide-react'

const pointsActivities = [
  {
    icon: Activity,
    activity: 'Conectar Garmin',
    points: 500,
    description: 'Bonus único por vincular tu cuenta'
  },
  {
    icon: Target,
    activity: 'Completar Entrenamiento',
    points: 50,
    description: 'Por cada sesión registrada'
  },
  {
    icon: Trophy,
    activity: 'Desafío Semanal',
    points: 200,
    description: 'Completar objetivos semanales'
  },
  {
    icon: Users,
    activity: 'Invitar Atleta',
    points: 300,
    description: 'Por cada nuevo miembro activo'
  },
  {
    icon: ShoppingBag,
    activity: 'Vender Producto',
    points: 100,
    description: 'Por cada venta en marketplace'
  },
  {
    icon: Star,
    activity: 'Reseña de Producto',
    points: 25,
    description: 'Ayuda a la comunidad'
  }
]

const rewards = [
  {
    title: 'Descuento Garmin 10%',
    points: 1000,
    description: 'En productos seleccionados'
  },
  {
    title: 'Descuento Garmin 20%',
    points: 2500,
    description: 'En toda la tienda'
  },
  {
    title: 'Producto Gratis',
    points: 5000,
    description: 'Selección de accesorios'
  },
  {
    title: 'Reloj Garmin',
    points: 15000,
    description: 'Modelos premium'
  }
]

export default function PointsSystem() {
  return (
    <section id="points" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sistema de
            <span className="gradient-text block">Puntos</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Gana puntos por tu actividad y canjéalos por descuentos exclusivos en equipamiento deportivo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Earn Points */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center mb-8">
                <Zap className="h-8 w-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-white">Ganar Puntos</h3>
              </div>
              
              <div className="space-y-6">
                {pointsActivities.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl"
                  >
                    <div className="flex items-center">
                      <item.icon className="h-6 w-6 text-primary-500 mr-4" />
                      <div>
                        <div className="text-white font-medium">{item.activity}</div>
                        <div className="text-slate-400 text-sm">{item.description}</div>
                      </div>
                    </div>
                    <div className="text-accent-500 font-bold text-lg">
                      +{item.points}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Redeem Points */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center mb-8">
                <Gift className="h-8 w-8 text-primary-500 mr-3" />
                <h3 className="text-2xl font-bold text-white">Canjear Puntos</h3>
              </div>
              
              <div className="space-y-6">
                {rewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-xl border border-primary-500/30 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold text-lg">{reward.title}</h4>
                      <div className="text-accent-500 font-bold">
                        {reward.points.toLocaleString()} pts
                      </div>
                    </div>
                    <p className="text-slate-300">{reward.description}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-8 bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-accent-700 transition-all"
              >
                Ver Todos los Premios
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Marketplace Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 text-center">
            <ShoppingBag className="h-16 w-16 text-primary-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Marketplace Integrado
            </h3>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Compra equipamiento con descuentos usando tus puntos, o vende tus productos usados 
              y gana puntos adicionales. Todo en una sola plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Explorar Tienda
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-slate-600 text-white px-8 py-3 rounded-xl font-semibold hover:border-slate-500 transition-colors"
              >
                Vender Producto
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
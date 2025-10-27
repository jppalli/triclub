'use client'

import { motion } from 'framer-motion'
import { 
  Activity, 
  Users, 
  Target, 
  ShoppingBag, 
  Zap, 
  Star,
  Shield,
  TrendingUp
} from 'lucide-react'

const features = [
  {
    icon: Activity,
    title: 'Integración Garmin',
    description: 'Conecta tu dispositivo Garmin y sincroniza automáticamente todos tus entrenamientos y métricas de rendimiento.',
    color: 'text-primary-500'
  },
  {
    icon: Users,
    title: 'Comunidad Exclusiva',
    description: 'Acceso solo por invitación de líderes de club. Conecta con triatletas de élite en Argentina.',
    color: 'text-accent-500'
  },
  {
    icon: Target,
    title: 'Desafíos Gamificados',
    description: 'Completa objetivos semanales y mensuales. Compite con otros atletas y sube en los rankings.',
    color: 'text-primary-500'
  },
  {
    icon: ShoppingBag,
    title: 'Marketplace Deportivo',
    description: 'Compra y vende equipamiento deportivo. Usa tus puntos para obtener descuentos exclusivos.',
    color: 'text-accent-500'
  },
  {
    icon: Zap,
    title: 'Sistema de Puntos',
    description: 'Gana puntos por entrenamientos, desafíos completados y participación en la comunidad.',
    color: 'text-primary-500'
  },
  {
    icon: TrendingUp,
    title: 'Análisis de Rendimiento',
    description: 'Métricas avanzadas y análisis de tu progreso con insights personalizados para mejorar.',
    color: 'text-accent-500'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Características
            <span className="gradient-text block">Revolucionarias</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Una plataforma completa diseñada específicamente para la comunidad de triatlón argentina
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300"
            >
              <feature.icon className={`h-12 w-12 ${feature.color} mb-6`} />
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12">
            <Shield className="h-16 w-16 text-white mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Plataforma Solo por Invitación
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Mantén la calidad y exclusividad de tu comunidad. Solo atletas invitados por líderes de club pueden acceder.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-colors"
            >
              Contactar Líder de Club
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
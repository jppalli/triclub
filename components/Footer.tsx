'use client'

import { Trophy, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="h-8 w-8 text-accent-500" />
              <span className="text-xl font-bold text-white">TriClub</span>
              <span className="text-sm text-slate-400">Argentina</span>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              La plataforma más avanzada para triatletas en Argentina. 
              Conecta, compite y crece con la comunidad de triatlón más exclusiva del país.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-slate-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-slate-300 hover:text-white transition-colors">Características</a></li>
              <li><a href="#points" className="text-slate-300 hover:text-white transition-colors">Sistema de Puntos</a></li>
              <li><a href="#marketplace" className="text-slate-300 hover:text-white transition-colors">Marketplace</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Desafíos</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Comunidad</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-slate-300">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">info@triclub.ar</span>
              </li>
              <li className="flex items-center text-slate-300">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+54 11 1234-5678</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2">Para Líderes de Club</h4>
              <p className="text-slate-400 text-sm mb-3">
                ¿Quieres integrar tu club? Contactanos para más información.
              </p>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Contactar
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 TriClub Argentina. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
# TriClub Argentina - Plataforma de Triatlón

Una plataforma gamificada exclusiva para clubes de triatlón en Argentina que combina elementos de ecommerce, redes sociales y marketplace estilo Vinted.

## Características Principales

### 🏆 Sistema de Invitaciones Exclusivo
- Acceso solo por invitación de líderes de club
- Comunidad curada y de alta calidad
- Verificación de atletas por parte de clubes reconocidos

### 📱 Integración Garmin
- Conexión directa con dispositivos Garmin
- Sincronización automática de entrenamientos
- Análisis avanzado de métricas de rendimiento

### 🎮 Sistema de Gamificación
- Puntos por entrenamientos completados
- Desafíos semanales y mensuales
- Rankings y competencias entre atletas
- Logros y badges por objetivos alcanzados

### 🛒 Marketplace Integrado
- Compra de equipamiento deportivo con descuentos
- Venta de productos usados estilo Vinted
- Uso de puntos como moneda de descuento
- Productos exclusivos para miembros

### 💰 Sistema de Puntos
- **500 puntos**: Conectar cuenta Garmin (bonus único)
- **50 puntos**: Por cada entrenamiento registrado
- **200 puntos**: Completar desafíos semanales
- **300 puntos**: Por cada atleta invitado activo
- **100 puntos**: Por cada venta en marketplace
- **25 puntos**: Por reseñas de productos

### 🎁 Sistema de Recompensas
- **1,000 puntos**: 10% descuento en Garmin
- **2,500 puntos**: 20% descuento en toda la tienda
- **5,000 puntos**: Producto gratis (accesorios)
- **15,000 puntos**: Reloj Garmin premium

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Headless UI

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   ├── Header.tsx         # Navegación principal
│   ├── Hero.tsx           # Sección hero
│   ├── Features.tsx       # Características principales
│   ├── PointsSystem.tsx   # Sistema de puntos
│   └── Footer.tsx         # Pie de página
├── public/                # Archivos estáticos
└── styles/                # Configuración de estilos
```

## Próximas Funcionalidades

### Fase 1 - MVP (Actual)
- [x] Landing page con información del producto
- [x] Sistema de puntos y recompensas
- [x] Diseño responsive y moderno
- [ ] Formulario de solicitud de invitación

### Fase 2 - Autenticación y Perfiles
- [ ] Sistema de autenticación
- [ ] Perfiles de usuario
- [ ] Dashboard de atletas
- [ ] Integración real con Garmin Connect

### Fase 3 - Gamificación Avanzada
- [ ] Sistema de desafíos dinámicos
- [ ] Rankings y leaderboards
- [ ] Logros y badges
- [ ] Notificaciones push

### Fase 4 - Marketplace
- [ ] Catálogo de productos
- [ ] Sistema de pagos
- [ ] Gestión de inventario
- [ ] Sistema de reseñas

### Fase 5 - Social Features
- [ ] Feed de actividades
- [ ] Comentarios y likes
- [ ] Grupos y equipos
- [ ] Mensajería privada

## Diseño y UX

El diseño sigue una estética **seria, deportiva y moderna** con:

- **Colores**: Paleta oscura con acentos en azul y naranja
- **Tipografía**: Inter para máxima legibilidad
- **Animaciones**: Sutiles y profesionales usando Framer Motion
- **Responsive**: Optimizado para todos los dispositivos
- **Accesibilidad**: Cumple con estándares WCAG

## Contacto

Para más información sobre integración de clubes o acceso a la plataforma:

- **Email**: info@triclub.ar
- **Teléfono**: +54 11 1234-5678
- **Ubicación**: Buenos Aires, Argentina

---

*TriClub Argentina - El futuro del triatlón está aquí*

## 🚀 Acceso a la Plataforma

- **Sitio Web**: https://jppalli.github.io/triclub/
- **Login Demo**: https://jppalli.github.io/triclub/login/
- **Credenciales**: atleta@triclub.ar / triclub123
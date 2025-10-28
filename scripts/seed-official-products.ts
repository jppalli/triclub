import { PrismaClient, OfficialCategory } from '@prisma/client'

const prisma = new PrismaClient()

const officialProducts = [
  {
    name: 'Garmin Forerunner 965',
    description: 'Reloj GPS premium con mapas a color, música y análisis avanzado de rendimiento. Perfecto para triatletas serios.',
    brand: 'Garmin',
    category: 'WATCHES_GPS' as OfficialCategory,
    originalPrice: 32000000, // $320,000 en centavos
    currentPrice: 27000000,  // $270,000 en centavos
    pointsDiscount: 5000,
    pointsRequired: 5000,
    images: [
      '/products/garmin-forerunner-965-1.jpg',
      '/products/garmin-forerunner-965-2.jpg',
      '/products/garmin-forerunner-965-3.jpg'
    ],
    features: [
      'GPS multibanda de alta precisión',
      'Mapas a color con navegación',
      'Almacenamiento de música',
      'Pagos sin contacto Garmin Pay',
      'Análisis de carga de entrenamiento',
      'Batería hasta 23 días'
    ],
    specifications: {
      display: '1.4" (35.4 mm) de diámetro',
      resolution: '454 x 454 píxeles',
      weight: '53 g',
      waterRating: '5 ATM',
      battery: 'Hasta 23 días en modo smartwatch',
      gps: 'GPS, GLONASS, Galileo',
      sensors: 'Pulsómetro, acelerómetro, giroscopio, brújula, termómetro'
    },
    stock: 25,
    isExclusive: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 156
  },
  {
    name: 'Wetsuit Orca Openwater Core',
    description: 'Traje de neopreno diseñado específicamente para aguas abiertas. Máxima flexibilidad y flotabilidad.',
    brand: 'Orca',
    category: 'SWIMMING' as OfficialCategory,
    originalPrice: 18000000, // $180,000
    currentPrice: 15000000,  // $150,000
    pointsDiscount: 3000,
    pointsRequired: 3000,
    images: [
      '/products/orca-wetsuit-1.jpg',
      '/products/orca-wetsuit-2.jpg'
    ],
    features: [
      'Neopreno Yamamoto 39-Cell',
      'Flexibilidad total en hombros',
      'Flotabilidad optimizada',
      'Cremallera YKK resistente',
      'Paneles hidrodinámicos',
      'Costuras selladas'
    ],
    specifications: {
      material: 'Neopreno Yamamoto 39-Cell',
      thickness: '5/3/2mm',
      sizes: 'XS a XXL',
      gender: 'Unisex',
      temperature: '14-20°C'
    },
    stock: 15,
    isExclusive: false,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 89
  },
  {
    name: 'Bicicleta Trek Madone SL 6',
    description: 'Bicicleta de ruta aerodinámica con cuadro de carbono OCLV 500. Diseñada para velocidad y comodidad.',
    brand: 'Trek',
    category: 'CYCLING' as OfficialCategory,
    originalPrice: 85000000, // $850,000
    currentPrice: 75000000,  // $750,000
    pointsDiscount: 10000,
    pointsRequired: 10000,
    images: [
      '/products/trek-madone-1.jpg',
      '/products/trek-madone-2.jpg',
      '/products/trek-madone-3.jpg'
    ],
    features: [
      'Cuadro carbono OCLV 500',
      'Aerodinámica avanzada',
      'Grupo Shimano 105',
      'Ruedas Bontrager Aeolus',
      'Ajuste IsoSpeed',
      'Cables internos'
    ],
    specifications: {
      frame: 'OCLV 500 Carbon',
      fork: 'Madone SL full carbon',
      groupset: 'Shimano 105 R7000',
      wheels: 'Bontrager Aeolus Elite 35',
      weight: '8.2 kg (talla 56)',
      sizes: '47, 50, 52, 54, 56, 58, 60, 62cm'
    },
    stock: 8,
    isExclusive: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 234
  },
  {
    name: 'Zapatillas Asics Gel-Nimbus 25',
    description: 'Zapatillas de running con máxima amortiguación. Ideales para entrenamientos largos y recuperación.',
    brand: 'Asics',
    category: 'RUNNING' as OfficialCategory,
    originalPrice: 9500000,  // $95,000
    currentPrice: 8000000,   // $80,000
    pointsDiscount: 1500,
    pointsRequired: 1500,
    images: [
      '/products/asics-nimbus-1.jpg',
      '/products/asics-nimbus-2.jpg'
    ],
    features: [
      'Gel en talón y antepié',
      'Espuma FlyteFoam Blast+',
      'Upper de malla técnica',
      'Suela AHAR Plus',
      'Reflectores 3M',
      'Drop 8mm'
    ],
    specifications: {
      drop: '8mm',
      weight: '290g (talla 9 US)',
      upper: 'Engineered mesh',
      midsole: 'FlyteFoam Blast+ Eco',
      outsole: 'AHAR Plus rubber',
      sizes: 'US 7-13 (hombre), US 5-11 (mujer)'
    },
    stock: 50,
    isExclusive: false,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 312
  },
  {
    name: 'Kit Nutrición Deportiva Pro',
    description: 'Kit completo de nutrición para triatletas. Incluye geles, sales y bebida isotónica de alta calidad.',
    brand: 'TriClub',
    category: 'NUTRITION' as OfficialCategory,
    originalPrice: 4500000,  // $45,000
    currentPrice: 3700000,   // $37,000
    pointsDiscount: 800,
    pointsRequired: 800,
    images: [
      '/products/nutrition-kit-1.jpg',
      '/products/nutrition-kit-2.jpg'
    ],
    features: [
      '12 geles energéticos sabores variados',
      '6 sobres de sales minerales',
      '2kg bebida isotónica',
      'Guía de nutrición deportiva',
      'Cinturón porta geles',
      'Botella deportiva 750ml'
    ],
    specifications: {
      gels: '12 unidades x 32g',
      salts: '6 sobres x 10g',
      drink: '2kg (40 porciones)',
      flavors: 'Limón, naranja, frutilla, tropical',
      caffeine: 'Con y sin cafeína disponible'
    },
    stock: 100,
    isExclusive: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 78
  },
  {
    name: 'Casco Giro Aether MIPS',
    description: 'Casco premium con tecnología MIPS para máxima protección y ventilación superior.',
    brand: 'Giro',
    category: 'CYCLING' as OfficialCategory,
    originalPrice: 12000000, // $120,000
    currentPrice: 10000000,  // $100,000
    pointsDiscount: 2000,
    pointsRequired: 2000,
    images: [
      '/products/giro-aether-1.jpg',
      '/products/giro-aether-2.jpg'
    ],
    features: [
      'Tecnología MIPS',
      'Ventilación Wind Tunnel',
      'Ajuste Roc Loc 5+',
      'Construcción In-Mold',
      'Reflectores integrados',
      'Compatible con gafas'
    ],
    specifications: {
      weight: '250g (talla M)',
      vents: '11 ventilaciones',
      sizes: 'S (51-55cm), M (55-59cm), L (59-63cm)',
      certification: 'CE EN1078, CPSC',
      colors: 'Matte Black, White, Blue, Red'
    },
    stock: 30,
    isExclusive: false,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 145
  }
]

async function seedOfficialProducts() {
  console.log('🌱 Seeding official products...')
  
  try {
    // Limpiar productos existentes
    await prisma.officialProduct.deleteMany()
    console.log('🗑️  Cleared existing products')
    
    // Crear productos oficiales
    for (const product of officialProducts) {
      const created = await prisma.officialProduct.create({
        data: product
      })
      console.log(`✅ Created product: ${created.name}`)
    }
    
    console.log(`🎉 Successfully seeded ${officialProducts.length} official products!`)
    
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedOfficialProducts()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedOfficialProducts }
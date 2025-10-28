import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedMarketplace() {
  console.log('🛒 Seeding marketplace data...')
  
  try {
    // Obtener usuarios existentes
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    })
    
    if (users.length === 0) {
      console.log('❌ No users found. Please run user seeding first.')
      return
    }
    
    console.log(`📊 Found ${users.length} users`)
    
    // Limpiar datos existentes del marketplace
    await prisma.review.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    console.log('🗑️  Cleared existing marketplace data')
    
    // Productos para el marketplace
    const products = [
      {
        title: 'Bicicleta Trek Domane AL 2',
        description: 'Bicicleta de ruta en excelente estado. Poco uso, ideal para principiantes. Incluye luces LED y computadora básica.',
        price: 45000000, // $450,000 en centavos
        condition: 'GOOD',
        category: 'CYCLING',
        images: ['/marketplace/trek-domane.jpg'],
        location: 'Palermo, Buenos Aires'
      },
      {
        title: 'Wetsuit Orca Openwater SW',
        description: 'Traje de neopreno para aguas abiertas. Talla M. Usado solo 5 veces. Perfecto para triatlón.',
        price: 12000000, // $120,000
        condition: 'LIKE_NEW',
        category: 'SWIMMING',
        images: ['/marketplace/orca-wetsuit.jpg'],
        location: 'San Isidro, Buenos Aires'
      },
      {
        title: 'Zapatillas Asics Gel-Kayano 29',
        description: 'Zapatillas de running para pronadores. Talla 42. Aproximadamente 300km de uso.',
        price: 6500000, // $65,000
        condition: 'GOOD',
        category: 'RUNNING',
        images: ['/marketplace/asics-kayano.jpg'],
        location: 'Belgrano, Buenos Aires'
      },
      {
        title: 'Garmin Forerunner 245',
        description: 'Reloj GPS con monitor de frecuencia cardíaca. Batería excelente. Incluye cargador original.',
        price: 18000000, // $180,000
        condition: 'GOOD',
        category: 'WATCHES',
        images: ['/marketplace/garmin-245.jpg'],
        location: 'Recoleta, Buenos Aires'
      },
      {
        title: 'Casco Giro Synthe MIPS',
        description: 'Casco de ciclismo profesional con tecnología MIPS. Talla M (55-59cm). Como nuevo.',
        price: 8500000, // $85,000
        condition: 'LIKE_NEW',
        category: 'ACCESSORIES',
        images: ['/marketplace/giro-synthe.jpg'],
        location: 'Villa Crespo, Buenos Aires'
      },
      {
        title: 'Conjunto Triatlón Zoot',
        description: 'Tri-suit completo talla L. Usado en 3 competencias. Excelente para distancias olímpicas.',
        price: 4500000, // $45,000
        condition: 'GOOD',
        category: 'CLOTHING',
        images: ['/marketplace/zoot-trisuit.jpg'],
        location: 'Núñez, Buenos Aires'
      },
      {
        title: 'Geles Energéticos GU (24 unidades)',
        description: 'Pack de geles energéticos sabores variados. Vencimiento 2025. Ideales para entrenamientos largos.',
        price: 1800000, // $18,000
        condition: 'NEW',
        category: 'NUTRITION',
        images: ['/marketplace/gu-gels.jpg'],
        location: 'Caballito, Buenos Aires'
      },
      {
        title: 'Bicicleta Specialized Allez',
        description: 'Bicicleta de ruta aluminio. Grupo Shimano Claris. Ideal para empezar en el ciclismo de ruta.',
        price: 35000000, // $350,000
        condition: 'FAIR',
        category: 'CYCLING',
        images: ['/marketplace/specialized-allez.jpg'],
        location: 'San Telmo, Buenos Aires'
      },
      {
        title: 'Gafas Oakley Radar EV',
        description: 'Gafas deportivas con lentes intercambiables. Incluye estuche y paño de limpieza.',
        price: 12500000, // $125,000
        condition: 'LIKE_NEW',
        category: 'ACCESSORIES',
        images: ['/marketplace/oakley-radar.jpg'],
        location: 'Tigre, Buenos Aires'
      },
      {
        title: 'Zapatillas Ciclismo Shimano',
        description: 'Zapatillas de ciclismo de ruta con calas SPD-SL. Talla 43. Muy poco uso.',
        price: 7500000, // $75,000
        condition: 'LIKE_NEW',
        category: 'CYCLING',
        images: ['/marketplace/shimano-shoes.jpg'],
        location: 'La Plata, Buenos Aires'
      }
    ]
    
    const createdProducts = []
    for (let i = 0; i < products.length; i++) {
      const seller = users[i % users.length]
      const product = await prisma.product.create({
        data: {
          sellerId: seller.id,
          ...products[i],
          createdAt: new Date(Date.now() - (i * 12 * 60 * 60 * 1000)) // Productos de diferentes horas
        }
      })
      createdProducts.push(product)
      console.log(`✅ Created product: ${product.title} by ${seller.name}`)
    }
    
    // Crear algunas reseñas aleatorias
    const reviewComments = [
      'Excelente vendedor, producto tal como se describe.',
      'Muy buena comunicación y entrega rápida.',
      'Producto en perfecto estado, recomendado.',
      'Todo perfecto, gracias por la venta.',
      'Muy conforme con la compra, vendedor serio.'
    ]
    
    for (const product of createdProducts.slice(0, 5)) { // Solo algunos productos con reviews
      const availableReviewers = users.filter(u => u.id !== product.sellerId)
      const reviewCount = Math.min(availableReviewers.length, Math.floor(Math.random() * 3) + 1) // 1-3 reviews, pero no más que usuarios disponibles
      
      for (let i = 0; i < reviewCount; i++) {
        const reviewer = availableReviewers[i] // Usar diferentes usuarios para cada review
        const rating = Math.floor(Math.random() * 2) + 4 // 4-5 estrellas
        const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)]
        
        await prisma.review.create({
          data: {
            userId: reviewer.id,
            productId: product.id,
            rating,
            comment,
            createdAt: new Date(product.createdAt.getTime() + (i * 24 * 60 * 60 * 1000))
          }
        })
      }
    }
    console.log('⭐ Created product reviews')
    
    console.log('\n🎉 Marketplace seeding completed successfully!')
    
    // Mostrar estadísticas
    const stats = await prisma.product.count()
    const reviewsCount = await prisma.review.count()
    
    console.log('\n📊 Marketplace Statistics:')
    console.log(`  - Products: ${stats}`)
    console.log(`  - Reviews: ${reviewsCount}`)
    
    // Mostrar productos por categoría
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true }
    })
    
    console.log('\n📦 Products by category:')
    categories.forEach(cat => {
      console.log(`  - ${cat.category}: ${cat._count.category} products`)
    })
    
  } catch (error) {
    console.error('❌ Error seeding marketplace:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedMarketplace()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedMarketplace }
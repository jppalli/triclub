import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testProducts() {
  try {
    console.log('🔍 Testing database connection...')
    
    const products = await prisma.officialProduct.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        brand: true,
        currentPrice: true,
        isActive: true,
        stock: true
      }
    })
    
    console.log(`✅ Found ${products.length} products:`)
    products.forEach(product => {
      console.log(`  - ${product.name} (${product.brand}) - $${product.currentPrice/100} - Stock: ${product.stock} - Active: ${product.isActive}`)
    })
    
    const totalCount = await prisma.officialProduct.count()
    console.log(`📊 Total products in database: ${totalCount}`)
    
  } catch (error) {
    console.error('❌ Error testing products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testProducts()
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...')
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Conexión exitosa!')
    
    // Test if tables exist
    const userCount = await prisma.user.count()
    console.log(`📊 Usuarios en la base de datos: ${userCount}`)
    
    // Test if demo user exists
    const demoUser = await prisma.user.findUnique({
      where: { email: 'atleta@triclub.ar' }
    })
    
    if (demoUser) {
      console.log('👤 Usuario demo encontrado:', demoUser.name)
      console.log('💰 Puntos:', demoUser.points)
    } else {
      console.log('⚠️  Usuario demo no encontrado - ejecuta npm run db:seed')
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error)
    console.log('\n🔧 Soluciones posibles:')
    console.log('1. Verifica la DATABASE_URL en .env.local')
    console.log('2. Asegúrate que Supabase esté activo')
    console.log('3. Ejecuta npm run db:push primero')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
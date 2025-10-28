import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testChallenges() {
  try {
    console.log('🔍 Probando datos de desafíos...')
    
    // Verificar si hay desafíos en la base de datos
    const challenges = await prisma.challenge.findMany()
    console.log(`📊 Desafíos en la base de datos: ${challenges.length}`)
    
    if (challenges.length > 0) {
      console.log('✅ Desafíos encontrados:')
      challenges.forEach(challenge => {
        console.log(`  - ${challenge.title} (${challenge.type})`)
      })
    } else {
      console.log('⚠️  No hay desafíos en la base de datos - se usarán datos mock')
    }
    
    // Verificar participaciones de usuario
    const userChallenges = await prisma.userChallenge.findMany({
      include: { challenge: true }
    })
    console.log(`👤 Participaciones de usuarios: ${userChallenges.length}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testChallenges()
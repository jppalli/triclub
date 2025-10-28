import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDashboard() {
  console.log('🧪 Testing dashboard for different users...')
  
  try {
    // 1. Verificar usuarios en la base de datos
    console.log('\n1. Users in database:')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        points: true,
        _count: {
          select: {
            workouts: true
          }
        }
      }
    })
    
    users.forEach(user => {
      console.log(`  👤 ${user.name} (${user.email})`)
      console.log(`     - Points: ${user.points}`)
      console.log(`     - Workouts: ${user._count.workouts}`)
    })
    
    // 2. Verificar workouts por usuario
    console.log('\n2. Workouts by user:')
    for (const user of users) {
      const workouts = await prisma.workout.findMany({
        where: { userId: user.id },
        select: {
          title: true,
          type: true,
          duration: true,
          distance: true,
          points: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      })
      
      console.log(`\n  📊 ${user.name}:`)
      if (workouts.length === 0) {
        console.log('     ✅ No workouts (new user - correct!)')
      } else {
        workouts.forEach(workout => {
          console.log(`     - ${workout.title} (${workout.type}) - ${workout.duration}min`)
        })
      }
    }
    
    // 3. Verificar puntos por usuario
    console.log('\n3. Points history:')
    for (const user of users) {
      const pointsHistory = await prisma.pointsHistory.findMany({
        where: { userId: user.id },
        select: {
          points: true,
          type: true,
          description: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      })
      
      console.log(`\n  💰 ${user.name}:`)
      if (pointsHistory.length === 0) {
        console.log('     ✅ No points history (new user)')
      } else {
        pointsHistory.forEach(point => {
          console.log(`     - ${point.points} pts (${point.type}): ${point.description}`)
        })
      }
    }
    
    console.log('\n✅ Dashboard test completed!')
    console.log('\n📋 Summary:')
    console.log('- New users should have 0 workouts and only welcome points')
    console.log('- Each user should see only their own data')
    console.log('- Demo user may have mock workouts if no real ones exist')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testDashboard()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { testDashboard }
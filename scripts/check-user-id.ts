import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUserId() {
  console.log('🔍 Checking user ID for atleta@triclub.ar...')
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'atleta@triclub.ar' },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        level: true,
        _count: {
          select: {
            workouts: true
          }
        }
      }
    })
    
    if (user) {
      console.log('✅ User found:')
      console.log(`  - ID: ${user.id}`)
      console.log(`  - Name: ${user.name}`)
      console.log(`  - Email: ${user.email}`)
      console.log(`  - Points: ${user.points}`)
      console.log(`  - Level: ${user.level}`)
      console.log(`  - Workouts in DB: ${user._count.workouts}`)
      
      // Verificar entrenamientos
      const workouts = await prisma.workout.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          title: true,
          type: true,
          duration: true,
          distance: true,
          points: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      console.log(`\n📊 Workouts for this user:`)
      workouts.forEach((workout, index) => {
        console.log(`  ${index + 1}. ${workout.title}`)
        console.log(`     Type: ${workout.type}, Duration: ${workout.duration}min`)
        console.log(`     Date: ${workout.createdAt.toLocaleDateString()}`)
      })
      
      console.log(`\n🔑 Use this ID in garmin-mock-data.ts:`)
      console.log(`  '${user.id}': [ /* activities */ ]`)
      
    } else {
      console.log('❌ User not found with email: atleta@triclub.ar')
      
      // Mostrar todos los usuarios disponibles
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true
        }
      })
      
      console.log('\n📋 Available users:')
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.name}) - ID: ${u.id}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserId()
/**
 * Script para probar que cada usuario solo ve sus propios workouts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testUserWorkouts() {
  console.log('🧪 Probando filtrado de workouts por usuario...\n')

  try {
    // 1. Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      },
      take: 5
    })

    console.log(`📊 Usuarios encontrados: ${users.length}\n`)

    // 2. Para cada usuario, mostrar sus workouts
    for (const user of users) {
      console.log(`👤 Usuario: ${user.name} (${user.email})`)
      
      const workouts = await prisma.workout.findMany({
        where: {
          userId: user.id
        },
        select: {
          id: true,
          title: true,
          type: true,
          duration: true,
          distance: true,
          date: true,
          source: true
        },
        orderBy: {
          date: 'desc'
        },
        take: 5
      })

      if (workouts.length === 0) {
        console.log('   ❌ No tiene workouts registrados')
      } else {
        console.log(`   ✅ Tiene ${workouts.length} workouts:`)
        workouts.forEach(workout => {
          console.log(`      - ${workout.title} (${workout.type}) - ${workout.duration}min - ${workout.source}`)
        })
      }
      console.log('')
    }

    // 3. Verificar que no hay workouts sin usuario
    const orphanWorkouts = await prisma.workout.findMany({
      where: {
        userId: null
      }
    })

    if (orphanWorkouts.length > 0) {
      console.log(`⚠️  ADVERTENCIA: ${orphanWorkouts.length} workouts sin usuario asignado`)
    } else {
      console.log('✅ Todos los workouts tienen un usuario asignado')
    }

    // 4. Estadísticas generales
    const totalWorkouts = await prisma.workout.count()
    const totalUsers = await prisma.user.count()
    const avgWorkoutsPerUser = totalWorkouts / totalUsers

    console.log('\n📈 Estadísticas:')
    console.log(`   Total de usuarios: ${totalUsers}`)
    console.log(`   Total de workouts: ${totalWorkouts}`)
    console.log(`   Promedio por usuario: ${avgWorkoutsPerUser.toFixed(2)}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testUserWorkouts()

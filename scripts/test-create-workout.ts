/**
 * Script para probar la creación de workouts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testCreateWorkout() {
  console.log('🧪 Probando creación de workout...\n')

  try {
    // 1. Obtener un usuario de prueba
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    if (!user) {
      console.error('❌ No se encontró ningún usuario en la base de datos')
      return
    }

    console.log(`👤 Usuario de prueba: ${user.name} (${user.email})`)
    console.log(`   ID: ${user.id}\n`)

    // 2. Intentar crear un workout simple
    console.log('📝 Creando workout de prueba...')
    
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        title: 'Test Running - 30 min',
        type: 'RUNNING',
        duration: 30,
        distance: 5.0,
        calories: 300,
        heartRate: 145,
        avgPace: '6:00/km',
        location: 'Parque',
        description: 'Workout de prueba',
        points: 0
      }
    })

    console.log('✅ Workout creado exitosamente!')
    console.log('   ID:', workout.id)
    console.log('   Título:', workout.title)
    console.log('   Tipo:', workout.type)
    console.log('   Duración:', workout.duration, 'min')
    console.log('   Distancia:', workout.distance, 'km')
    console.log('')

    // 3. Calcular puntos
    const points = Math.floor(workout.duration / 10) * 5
    console.log(`💎 Puntos calculados: ${points}`)

    // 4. Actualizar workout con puntos
    await prisma.workout.update({
      where: { id: workout.id },
      data: { points }
    })

    console.log('✅ Puntos actualizados en el workout')

    // 5. Actualizar puntos del usuario
    await prisma.user.update({
      where: { id: user.id },
      data: {
        points: {
          increment: points
        }
      }
    })

    console.log('✅ Puntos agregados al usuario')

    // 6. Crear historial de puntos
    await prisma.pointsHistory.create({
      data: {
        userId: user.id,
        points,
        type: 'WORKOUT',
        description: `Entrenamiento de running - ${workout.duration} minutos`,
        reference: workout.id
      }
    })

    console.log('✅ Historial de puntos creado')

    // 7. Verificar el workout creado
    const createdWorkout = await prisma.workout.findUnique({
      where: { id: workout.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            points: true
          }
        }
      }
    })

    console.log('\n📊 Workout final:')
    console.log(JSON.stringify(createdWorkout, null, 2))

    console.log('\n✅ ¡Prueba completada exitosamente!')
    console.log('\n💡 El workout se creó correctamente en la base de datos.')
    console.log('   Puedes verificarlo en el dashboard del usuario.')

  } catch (error) {
    console.error('\n❌ Error durante la prueba:', error)
    if (error instanceof Error) {
      console.error('   Mensaje:', error.message)
      console.error('   Stack:', error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testCreateWorkout()

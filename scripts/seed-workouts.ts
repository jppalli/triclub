import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedWorkouts() {
  console.log('🏃‍♂️ Seeding workout data...')
  
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
    
    // Limpiar entrenamientos existentes
    await prisma.pointsHistory.deleteMany({
      where: { type: 'WORKOUT' }
    })
    await prisma.workout.deleteMany()
    console.log('🗑️  Cleared existing workouts and points')
    
    // Entrenamientos de ejemplo
    const workoutTemplates = [
      {
        type: 'RUNNING',
        duration: 45,
        distance: 8.5,
        calories: 420,
        avgHeartRate: 155,
        maxHeartRate: 175,
        pace: '5:18',
        location: 'Puerto Madero, Buenos Aires',
        notes: 'Entrenamiento matutino con buen ritmo. Me sentí muy bien durante toda la carrera.'
      },
      {
        type: 'CYCLING',
        duration: 90,
        distance: 35.2,
        calories: 650,
        avgHeartRate: 145,
        maxHeartRate: 168,
        pace: '23.5',
        location: 'Costanera Norte',
        notes: 'Salida larga en bicicleta. Viento en contra en la vuelta pero buen entrenamiento.'
      },
      {
        type: 'SWIMMING',
        duration: 60,
        distance: 2.0,
        calories: 380,
        avgHeartRate: 140,
        maxHeartRate: 160,
        pace: '2:00',
        location: 'Club Náutico San Isidro',
        notes: 'Entrenamiento de técnica y resistencia. Trabajé mucho en la brazada.'
      },
      {
        type: 'TRIATHLON',
        duration: 120,
        distance: 25.7,
        calories: 980,
        avgHeartRate: 150,
        maxHeartRate: 180,
        location: 'Tigre',
        notes: 'Triatlón sprint completo. Muy buena transición entre disciplinas.'
      },
      {
        type: 'RUNNING',
        duration: 30,
        distance: 5.0,
        calories: 280,
        avgHeartRate: 165,
        maxHeartRate: 185,
        pace: '6:00',
        location: 'Parque Tres de Febrero',
        notes: 'Entrenamiento de velocidad. Series de 1km con descansos activos.'
      }
    ]
    
    const createdWorkouts = []
    
    // Crear entrenamientos para diferentes usuarios y fechas
    for (let i = 0; i < workoutTemplates.length; i++) {
      const template = workoutTemplates[i]
      const user = users[i % users.length]
      
      // Crear fechas variadas en los últimos 30 días
      const daysAgo = Math.floor(Math.random() * 30)
      const workoutDate = new Date()
      workoutDate.setDate(workoutDate.getDate() - daysAgo)
      
      const workout = await prisma.workout.create({
        data: {
          userId: user.id,
          title: `${template.type} - ${template.location}`,
          description: template.notes,
          type: template.type as any,
          duration: template.duration,
          distance: template.distance,
          calories: template.calories,
          avgPace: template.pace,
          heartRate: template.avgHeartRate,
          location: template.location,
          points: 0 // Se calculará después
        }
      })
      
      // Calcular puntos
      let points = 0
      switch (template.type) {
        case 'RUNNING':
          points = Math.floor(template.duration / 10) * 5
          break
        case 'CYCLING':
          points = Math.floor(template.duration / 15) * 5
          break
        case 'SWIMMING':
          points = Math.floor(template.duration / 5) * 5
          break
        case 'TRIATHLON':
          points = Math.floor(template.duration / 8) * 10
          break
        default:
          points = Math.floor(template.duration / 12) * 5
      }
      
      // Agregar puntos al usuario
      if (points > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            points: {
              increment: points
            }
          }
        })
        
        // Crear registro de puntos
        await prisma.pointsHistory.create({
          data: {
            userId: user.id,
            points,
            type: 'WORKOUT',
            description: `Entrenamiento de ${template.type.toLowerCase()} - ${template.duration} minutos`,
            reference: workout.id
          }
        })
      }
      
      createdWorkouts.push(workout)
      console.log(`✅ Created ${template.type} workout for ${user.name} (${points} points)`)
    }
    
    console.log('🎉 Workout seeding completed successfully!')
    
    // Mostrar estadísticas
    const totalWorkouts = await prisma.workout.count()
    const totalPoints = await prisma.pointsHistory.aggregate({
      where: { type: 'WORKOUT' },
      _sum: { points: true }
    })
    
    console.log(`📊 Created ${totalWorkouts} workouts`)
    console.log(`🏆 Total points awarded: ${totalPoints._sum.points || 0}`)
    
  } catch (error) {
    console.error('❌ Error seeding workouts:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedWorkouts()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedWorkouts }
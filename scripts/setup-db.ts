import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Configurando base de datos...')

  // Crear usuario demo
  const hashedPassword = await bcrypt.hash('triclub123', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'atleta@triclub.ar' },
    update: {},
    create: {
      email: 'atleta@triclub.ar',
      password: hashedPassword,
      firstName: 'Carlos',
      lastName: 'Mendoza',
      name: 'Carlos Mendoza',
      club: 'Club Triatlón Buenos Aires',
      city: 'Buenos Aires',
      level: 'ELITE',
      points: 2850,
      bio: 'Triatleta apasionado por los desafíos y la superación personal.',
    },
  })

  // Crear historial de puntos inicial
  await prisma.pointsHistory.createMany({
    data: [
      {
        userId: demoUser.id,
        points: 500,
        type: 'BONUS',
        description: 'Bonus de bienvenida',
      },
      {
        userId: demoUser.id,
        points: 75,
        type: 'WORKOUT',
        description: 'Entrenamiento de natación completado',
      },
      {
        userId: demoUser.id,
        points: 200,
        type: 'CHALLENGE',
        description: 'Desafío semanal completado',
      },
    ],
    skipDuplicates: true,
  })

  // Crear algunos entrenamientos demo
  await prisma.workout.createMany({
    data: [
      {
        userId: demoUser.id,
        title: 'Entrenamiento de Natación',
        description: '2.5km en piscina olímpica',
        type: 'SWIMMING',
        duration: 45,
        distance: 2.5,
        calories: 420,
        avgPace: '1:48/100m',
        heartRate: 145,
        location: 'Club Náutico San Isidro',
        points: 75,
      },
      {
        userId: demoUser.id,
        title: 'Ruta por Tigre',
        description: '45km en bicicleta por el delta',
        type: 'CYCLING',
        duration: 95,
        distance: 45,
        calories: 890,
        avgPace: '28.4 km/h',
        heartRate: 152,
        location: 'Delta del Tigre',
        points: 90,
      },
      {
        userId: demoUser.id,
        title: 'Carrera Matutina',
        description: '10km por la costanera',
        type: 'RUNNING',
        duration: 42,
        distance: 10,
        calories: 650,
        avgPace: '4:12/km',
        heartRate: 158,
        location: 'Puerto Madero',
        points: 50,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Base de datos configurada exitosamente!')
  console.log('👤 Usuario demo creado: atleta@triclub.ar / triclub123')
  console.log('📊 Datos de ejemplo agregados')
}

main()
  .catch((e) => {
    console.error('❌ Error configurando la base de datos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCommunity() {
  console.log('🌱 Seeding community data...')
  
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
    
    // Limpiar datos existentes
    await prisma.postLike.deleteMany()
    await prisma.postComment.deleteMany()
    await prisma.communityPost.deleteMany()
    await prisma.eventParticipant.deleteMany()
    await prisma.communityEvent.deleteMany()
    console.log('🗑️  Cleared existing community data')
    
    // Crear posts de la comunidad
    const posts = [
      {
        content: '¡Acabo de completar mi primer triatlón olímpico! 🏊‍♀️🚴‍♀️🏃‍♀️ Tiempo: 2:45:30. Gracias a todos por el apoyo durante el entrenamiento.',
        location: 'Tigre, Buenos Aires',
        achievement: 'Primer Triatlón Olímpico'
      },
      {
        content: 'Entrenamiento matutino en Puerto Madero. Las condiciones estaban perfectas para correr. ¿Alguien se suma mañana a las 6 AM?',
        location: 'Puerto Madero, Buenos Aires'
      },
      {
        content: 'Nuevo récord personal en natación: 1500m en 28:45! 💪 El entrenamiento de técnica está dando resultados.',
        achievement: 'Nuevo Récord Personal'
      },
      {
        content: 'Increíble sesión de ciclismo hoy. 80km por la ruta de los lagos. El paisaje estaba espectacular! 🚴‍♂️',
        location: 'Bariloche, Río Negro'
      },
      {
        content: 'Primer lugar en la carrera local de 10k! 🏆 Todo el entrenamiento valió la pena. Gracias al club por el apoyo.',
        achievement: 'Primer Lugar 10K'
      }
    ]
    
    const createdPosts = []
    for (let i = 0; i < posts.length; i++) {
      const user = users[i % users.length]
      const post = await prisma.communityPost.create({
        data: {
          authorId: user.id,
          ...posts[i],
          createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) // Posts de días anteriores
        }
      })
      createdPosts.push(post)
      console.log(`✅ Created post by ${user.name}`)
    }
    
    // Crear likes aleatorios
    for (const post of createdPosts) {
      const likeCount = Math.floor(Math.random() * 15) + 5 // 5-20 likes
      const likers = users.sort(() => 0.5 - Math.random()).slice(0, likeCount)
      
      for (const liker of likers) {
        if (liker.id !== post.authorId) { // No auto-like
          await prisma.postLike.create({
            data: {
              postId: post.id,
              authorId: liker.id
            }
          })
        }
      }
    }
    console.log('👍 Created post likes')
    
    // Crear comentarios
    const comments = [
      '¡Felicitaciones! Increíble logro 🎉',
      '¡Qué inspirador! Yo también quiero intentarlo',
      'Excelente tiempo, sigue así 💪',
      'Me sumo al entrenamiento de mañana',
      '¡Brutal! ¿Algún consejo para mejorar?',
      'Increíble dedicación, se nota el esfuerzo',
      '¡Vamos por más récords!',
      'El club está orgulloso de ti 🏆'
    ]
    
    for (const post of createdPosts) {
      const commentCount = Math.floor(Math.random() * 8) + 2 // 2-10 comentarios
      
      for (let i = 0; i < commentCount; i++) {
        const commenter = users[Math.floor(Math.random() * users.length)]
        const comment = comments[Math.floor(Math.random() * comments.length)]
        
        await prisma.postComment.create({
          data: {
            postId: post.id,
            authorId: commenter.id,
            content: comment,
            createdAt: new Date(post.createdAt.getTime() + (i * 60 * 60 * 1000)) // Comentarios después del post
          }
        })
      }
    }
    console.log('💬 Created post comments')
    
    // Crear eventos de la comunidad
    const events = [
      {
        title: 'Triatlón de Tigre',
        description: 'Competencia oficial de triatlón en el Delta del Tigre. Distancia olímpica.',
        eventType: 'COMPETITION',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // En 15 días
        location: 'Delta del Tigre, Buenos Aires',
        maxParticipants: 50
      },
      {
        title: 'Entrenamiento Grupal de Natación',
        description: 'Sesión de técnica y resistencia en piscina olímpica.',
        eventType: 'TRAINING',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
        location: 'Club Náutico San Isidro',
        maxParticipants: 20
      },
      {
        title: 'Charla: Nutrición Deportiva',
        description: 'Conferencia sobre alimentación para triatletas con especialista.',
        eventType: 'EDUCATIONAL',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
        location: 'Virtual - Zoom',
        maxParticipants: 100
      },
      {
        title: 'Rodada Grupal - Ruta de los Lagos',
        description: 'Ciclismo recreativo por la hermosa ruta de los lagos patagónicos.',
        eventType: 'SOCIAL',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // En 21 días
        location: 'Bariloche, Río Negro',
        maxParticipants: 30
      }
    ]
    
    const createdEvents = []
    for (const eventData of events) {
      const event = await prisma.communityEvent.create({
        data: eventData
      })
      createdEvents.push(event)
      console.log(`✅ Created event: ${event.title}`)
    }
    
    // Inscribir usuarios a eventos aleatoriamente
    for (const event of createdEvents) {
      const participantCount = Math.floor(Math.random() * (event.maxParticipants! / 2)) + 5
      const participants = users.sort(() => 0.5 - Math.random()).slice(0, participantCount)
      
      for (const participant of participants) {
        await prisma.eventParticipant.create({
          data: {
            eventId: event.id,
            userId: participant.id
          }
        })
      }
      console.log(`👥 Added ${participantCount} participants to ${event.title}`)
    }
    
    console.log('\n🎉 Community seeding completed successfully!')
    
    // Mostrar estadísticas
    const stats = await prisma.communityPost.count()
    const eventsCount = await prisma.communityEvent.count()
    const likesCount = await prisma.postLike.count()
    const commentsCount = await prisma.postComment.count()
    
    console.log('\n📊 Community Statistics:')
    console.log(`  - Posts: ${stats}`)
    console.log(`  - Events: ${eventsCount}`)
    console.log(`  - Likes: ${likesCount}`)
    console.log(`  - Comments: ${commentsCount}`)
    
  } catch (error) {
    console.error('❌ Error seeding community:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedCommunity()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedCommunity }
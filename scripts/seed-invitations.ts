import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedInvitations() {
  console.log('🎫 Seeding invitation codes...')
  
  try {
    // Obtener el usuario demo existente
    const demoUser = await prisma.user.findUnique({
      where: { email: 'atleta@triclub.ar' }
    })

    if (!demoUser) {
      console.log('❌ Demo user not found. Please run setup-db.ts first.')
      return
    }

    // Limpiar invitaciones existentes
    await prisma.invitation.deleteMany()
    console.log('🗑️  Cleared existing invitations')

    // Crear códigos de invitación de demo - REUTILIZABLES
    const invitations = [
      {
        code: 'TRICLUB2024',
        senderId: demoUser.id,
        senderName: 'Juan Pedro Palli',
        message: 'Te invito a unirte a nuestro club de triatlón. ¡Será genial tenerte en el equipo!',
        maxUses: 999, // Prácticamente ilimitado
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
      },
      {
        code: 'ELITE123',
        senderId: demoUser.id,
        senderName: 'Juan Pedro Palli',
        message: 'Código especial para atletas elite. Bienvenido al nivel avanzado.',
        maxUses: 999, // Prácticamente ilimitado
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
      },
      {
        code: 'GARMIN456',
        senderId: demoUser.id,
        senderName: 'Juan Pedro Palli',
        message: 'Para usuarios de Garmin. Aprovecha todas las integraciones.',
        maxUses: 999, // Prácticamente ilimitado
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
      },
      {
        code: 'BUENOS789',
        senderId: demoUser.id,
        senderName: 'Juan Pedro Palli',
        message: 'Código especial para atletas de Buenos Aires.',
        maxUses: 999, // Prácticamente ilimitado
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
      },
      {
        code: 'DEMO2024',
        senderId: demoUser.id,
        senderName: 'Juan Pedro Palli',
        message: 'Código de demostración - úsalo todas las veces que quieras.',
        maxUses: 999, // Prácticamente ilimitado
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
      }
    ]

    for (const inviteData of invitations) {
      const invitation = await prisma.invitation.create({
        data: {
          ...inviteData,
          status: 'PENDING'
        }
      })
      console.log(`✅ Created invitation: ${invitation.code} (expires: ${invitation.expiresAt.toLocaleDateString()})`)
    }

    console.log(`🎉 Successfully seeded ${invitations.length} invitation codes!`)
    
    // Mostrar resumen
    console.log('\n📋 Available invitation codes (REUSABLE):')
    invitations.forEach(inv => {
      console.log(`  ${inv.code} - ${inv.message} (${inv.maxUses === 999 ? 'UNLIMITED' : inv.maxUses} uses)`)
    })
    
    console.log('\n✨ All codes are now REUSABLE - they can be used multiple times!')
    
  } catch (error) {
    console.error('❌ Error seeding invitations:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedInvitations()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedInvitations }
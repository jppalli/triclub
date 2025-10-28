import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testRegistration() {
  console.log('🧪 Testing registration system...')
  
  try {
    // 1. Verificar códigos de invitación disponibles
    console.log('\n1. Checking available invitation codes:')
    const invitations = await prisma.invitation.findMany({
      where: { status: 'PENDING' },
      select: {
        code: true,
        senderName: true,
        message: true,
        currentUses: true,
        maxUses: true,
        expiresAt: true
      }
    })
    
    invitations.forEach(inv => {
      console.log(`  ✅ ${inv.code} - ${inv.senderName} (${inv.currentUses}/${inv.maxUses} uses, expires: ${inv.expiresAt.toLocaleDateString()})`)
    })
    
    // 2. Verificar usuarios existentes
    console.log('\n2. Current users in database:')
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        club: true,
        points: true,
        inviteCode: true,
        invitedBy: true,
        createdAt: true
      }
    })
    
    users.forEach(user => {
      console.log(`  👤 ${user.email} - ${user.name} (${user.points} pts, invited by: ${user.invitedBy || 'N/A'})`)
    })
    
    // 3. Mostrar estadísticas
    console.log('\n3. Registration statistics:')
    const totalUsers = await prisma.user.count()
    const totalInvitations = await prisma.invitation.count()
    const usedInvitations = await prisma.invitation.count({
      where: { status: 'USED' }
    })
    
    console.log(`  📊 Total users: ${totalUsers}`)
    console.log(`  📊 Total invitations: ${totalInvitations}`)
    console.log(`  📊 Used invitations: ${usedInvitations}`)
    console.log(`  📊 Success rate: ${totalInvitations > 0 ? Math.round((usedInvitations / totalInvitations) * 100) : 0}%`)
    
    // 4. Mostrar puntos por invitaciones
    console.log('\n4. Points from invitations:')
    const invitePoints = await prisma.pointsHistory.findMany({
      where: { type: 'INVITE' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })
    
    invitePoints.forEach(point => {
      console.log(`  💰 ${point.user.name} earned ${point.points} points: ${point.description}`)
    })
    
    console.log('\n✅ Registration system test completed!')
    
  } catch (error) {
    console.error('❌ Error testing registration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testRegistration()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { testRegistration }
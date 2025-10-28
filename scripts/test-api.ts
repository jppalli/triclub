import { prisma } from '@/lib/prisma'

async function testAPI() {
  console.log('🧪 Testing API and database connection...')
  
  try {
    // Test 1: Verificar conexión a la base de datos
    console.log('\n1. Testing database connection:')
    const userCount = await prisma.user.count()
    console.log(`✅ Database connected. Users: ${userCount}`)
    
    // Test 2: Verificar invitaciones
    console.log('\n2. Testing invitations:')
    const invitations = await prisma.invitation.findMany({
      where: { status: 'PENDING' },
      select: { code: true, status: true, expiresAt: true }
    })
    console.log(`✅ Found ${invitations.length} pending invitations`)
    invitations.forEach(inv => {
      console.log(`  - ${inv.code} (expires: ${inv.expiresAt.toLocaleDateString()})`)
    })
    
    // Test 3: Verificar código específico
    console.log('\n3. Testing specific invitation code:')
    const testCode = 'TRICLUB2024'
    const invitation = await prisma.invitation.findUnique({
      where: { code: testCode },
      include: {
        sender: {
          select: { id: true, name: true, club: true }
        }
      }
    })
    
    if (invitation) {
      console.log(`✅ Code ${testCode} found:`)
      console.log(`  - Sender: ${invitation.sender.name}`)
      console.log(`  - Status: ${invitation.status}`)
      console.log(`  - Uses: ${invitation.currentUses}/${invitation.maxUses}`)
      console.log(`  - Expires: ${invitation.expiresAt.toLocaleDateString()}`)
      console.log(`  - Valid: ${invitation.expiresAt > new Date() && invitation.currentUses < invitation.maxUses && invitation.status === 'PENDING'}`)
    } else {
      console.log(`❌ Code ${testCode} not found`)
    }
    
    console.log('\n✅ All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testAPI()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { testAPI }
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('🔍 Checking existing users...')
    
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        id: true
      }
    })
    
    console.log(`\n📊 Found ${users.length} users:`)
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.name})`)
    })
    
    // Create test user
    const testEmail = 'test@triclub.com'
    const testPassword = 'test123'
    
    const existingTest = await prisma.user.findUnique({
      where: { email: testEmail }
    })
    
    if (existingTest) {
      console.log(`\n✅ Test user already exists: ${testEmail}`)
      console.log(`   Password: ${testPassword}`)
      
      // Update password to make sure it's correct
      const hashedPassword = await bcrypt.hash(testPassword, 12)
      await prisma.user.update({
        where: { email: testEmail },
        data: { password: hashedPassword }
      })
      console.log('   Password updated!')
    } else {
      console.log(`\n🆕 Creating test user...`)
      const hashedPassword = await bcrypt.hash(testPassword, 12)
      
      const newUser = await prisma.user.create({
        data: {
          email: testEmail,
          password: hashedPassword,
          name: 'Test User',
          firstName: 'Test',
          lastName: 'User',
          club: 'TriClub Argentina',
          inviteCode: 'TEST' + Date.now(),
          points: 100,
          level: 'BEGINNER'
        }
      })
      
      console.log(`✅ Test user created: ${newUser.email}`)
      console.log(`   Password: ${testPassword}`)
    }
    
    console.log('\n🎯 You can now login with:')
    console.log(`   Email: ${testEmail}`)
    console.log(`   Password: ${testPassword}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()

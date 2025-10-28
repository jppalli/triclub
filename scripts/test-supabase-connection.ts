import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    console.log('📍 DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Connected to database successfully')
    
    // Check if tables exist
    console.log('\n📊 Checking tables...')
    
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ User table exists - ${userCount} users found`)
    } catch (error: any) {
      console.log('❌ User table error:', error.message)
    }
    
    try {
      const invitationCount = await prisma.invitation.count()
      console.log(`✅ Invitation table exists - ${invitationCount} invitations found`)
    } catch (error: any) {
      console.log('❌ Invitation table error:', error.message)
    }
    
    try {
      const workoutCount = await prisma.workout.count()
      console.log(`✅ Workout table exists - ${workoutCount} workouts found`)
    } catch (error: any) {
      console.log('❌ Workout table error:', error.message)
    }
    
    // Try to create a test user
    console.log('\n🧪 Testing user creation...')
    try {
      const testUser = await prisma.user.create({
        data: {
          email: `test-${Date.now()}@example.com`,
          name: 'Test User',
          password: 'test123'
        }
      })
      console.log('✅ Successfully created test user:', testUser.email)
      
      // Clean up
      await prisma.user.delete({ where: { id: testUser.id } })
      console.log('✅ Successfully deleted test user')
    } catch (error: any) {
      console.log('❌ User creation error:', error.message)
    }
    
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

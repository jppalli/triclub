async function testNewUserWorkouts() {
  console.log('🧪 Testing that new users have NO workouts...')
  
  try {
    // Simular llamada a la API de workouts para un usuario nuevo
    console.log('📤 Testing workouts API for new user...')
    
    // Nota: En un test real necesitaríamos autenticación
    // Por ahora verificamos directamente en la base de datos
    
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    // Obtener usuarios nuevos (no el demo)
    const newUsers = await prisma.user.findMany({
      where: {
        email: {
          not: 'atleta@triclub.ar' // Excluir usuario demo
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        _count: {
          select: { workouts: true }
        }
      }
    })
    
    console.log('\n📊 Testing new users:')
    
    for (const user of newUsers) {
      console.log(`\n👤 ${user.name} (${user.email}):`)
      
      // Verificar workouts en base de datos
      const dbWorkouts = await prisma.workout.count({
        where: { userId: user.id }
      })
      
      console.log(`   - DB workouts: ${dbWorkouts}`)
      
      if (dbWorkouts === 0) {
        console.log('   ✅ CORRECTO: Usuario nuevo sin entrenamientos')
      } else {
        console.log('   ❌ ERROR: Usuario nuevo tiene entrenamientos!')
      }
    }
    
    // Verificar usuario demo
    const demoUser = await prisma.user.findUnique({
      where: { email: 'atleta@triclub.ar' },
      select: {
        id: true,
        name: true,
        _count: {
          select: { workouts: true }
        }
      }
    })
    
    if (demoUser) {
      console.log(`\n👤 ${demoUser.name} (DEMO USER):`)
      const demoWorkouts = await prisma.workout.count({
        where: { userId: demoUser.id }
      })
      console.log(`   - DB workouts: ${demoWorkouts}`)
      
      if (demoWorkouts > 0) {
        console.log('   ✅ CORRECTO: Usuario demo tiene entrenamientos reales')
      } else {
        console.log('   ℹ️  INFO: Usuario demo usará mock data (normal)')
      }
    }
    
    await prisma.$disconnect()
    
    console.log('\n✅ Test completed!')
    console.log('\n📋 Expected behavior:')
    console.log('- New users: 0 workouts (empty dashboard)')
    console.log('- Demo user: Real workouts or mock data fallback')
    console.log('- Each user sees only their own data')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Ejecutar test
testNewUserWorkouts()
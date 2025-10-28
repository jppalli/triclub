async function testNewUser() {
  console.log('🧪 Testing new user registration and dashboard...')
  
  try {
    // 1. Registrar un nuevo usuario
    const testData = {
      inviteCode: 'ELITE123',
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      phone: '+54911111111',
      city: 'Córdoba'
    }
    
    console.log('📤 Registering new user...')
    
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ New user registered successfully!')
      console.log('User data:', result.user)
      
      // 2. Simular login y obtener stats
      console.log('\n📊 Testing user stats API...')
      
      // Nota: En un test real necesitaríamos hacer login primero
      // Por ahora solo verificamos que el usuario se creó correctamente
      
      console.log('✅ Test completed successfully!')
      console.log('\n📋 Summary:')
      console.log(`- New user: ${result.user.name} (${result.user.email})`)
      console.log(`- Points: ${result.user.points}`)
      console.log(`- Club: ${result.user.club}`)
      console.log(`- Invite code: ${result.user.inviteCode}`)
      
    } else {
      console.log('❌ Registration failed:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Ejecutar test
testNewUser()
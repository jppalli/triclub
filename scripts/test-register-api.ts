async function testRegisterAPI() {
  console.log('🧪 Testing registration API...')
  
  try {
    const testData = {
      inviteCode: 'TRICLUB2024',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+54911234567',
      city: 'Buenos Aires'
    }
    
    console.log('📤 Sending registration request...')
    console.log('Data:', testData)
    
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })
    
    console.log('📥 Response status:', response.status)
    
    const result = await response.json()
    console.log('📥 Response data:', result)
    
    if (response.ok) {
      console.log('✅ Registration successful!')
    } else {
      console.log('❌ Registration failed:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Ejecutar test
testRegisterAPI()
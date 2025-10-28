async function testReusableInvitations() {
  console.log('🔄 Testing Reusable Invitation System...')
  
  try {
    const baseUrl = 'http://localhost:3000'
    const testCode = 'TRICLUB2024'
    
    console.log('\n1️⃣ Testing invitation validation (should be reusable):')
    
    // Probar validación del código
    const validateResponse = await fetch(`${baseUrl}/api/validate-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: testCode })
    })
    
    const validateData = await validateResponse.json()
    console.log(`✅ Validation result:`, validateData)
    
    if (!validateData.valid) {
      console.log('❌ Code validation failed, cannot proceed with reuse test')
      return
    }
    
    console.log('\n2️⃣ Testing multiple registrations with same code:')
    
    // Intentar registrar múltiples usuarios con el mismo código
    const testUsers = [
      {
        email: `test1_${Date.now()}@example.com`,
        firstName: 'Usuario',
        lastName: 'Uno'
      },
      {
        email: `test2_${Date.now()}@example.com`,
        firstName: 'Usuario',
        lastName: 'Dos'
      },
      {
        email: `test3_${Date.now()}@example.com`,
        firstName: 'Usuario',
        lastName: 'Tres'
      }
    ]
    
    for (let i = 0; i < testUsers.length; i++) {
      const user = testUsers[i]
      console.log(`\\n  Registering user ${i + 1}: ${user.firstName} ${user.lastName}`)
      
      try {
        const registerResponse = await fetch(`${baseUrl}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inviteCode: testCode,
            email: user.email,
            password: 'password123',
            firstName: user.firstName,
            lastName: user.lastName,
            phone: '+54 11 1234-5678',
            city: 'Buenos Aires'
          })
        })
        
        const registerData = await registerResponse.json()
        
        if (registerData.success) {
          console.log(`  ✅ User ${i + 1} registered successfully!`)
          console.log(`     Email: ${registerData.user.email}`)
          console.log(`     Points: ${registerData.user.points}`)
        } else {
          console.log(`  ❌ User ${i + 1} registration failed: ${registerData.error}`)
        }
      } catch (error) {
        console.log(`  ❌ User ${i + 1} registration error: ${error}`)
      }
      
      // Pequeña pausa entre registros
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log('\n3️⃣ Testing code validation after multiple uses:')
    
    // Verificar que el código sigue siendo válido después de múltiples usos
    const finalValidateResponse = await fetch(`${baseUrl}/api/validate-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: testCode })
    })
    
    const finalValidateData = await finalValidateResponse.json()
    console.log(`✅ Final validation result:`, finalValidateData)
    
    if (finalValidateData.valid) {
      console.log('🎉 SUCCESS: Code is still valid after multiple uses!')
      console.log(`   Current uses: ${finalValidateData.invitation?.currentUses || 'N/A'}`)
      console.log(`   Max uses: ${finalValidateData.invitation?.maxUses || 'N/A'}`)
    } else {
      console.log('❌ FAILED: Code became invalid after uses')
    }
    
    console.log('\n🔗 Test URLs:')
    console.log(`  - Validate: ${baseUrl}/api/validate-invite`)
    console.log(`  - Register: ${baseUrl}/api/register`)
    console.log(`  - Registration page: ${baseUrl}/registro`)
    
    console.log('\n📋 Reusable invitation codes:')
    console.log('  - TRICLUB2024 (unlimited uses)')
    console.log('  - ELITE123 (unlimited uses)')
    console.log('  - GARMIN456 (unlimited uses)')
    console.log('  - BUENOS789 (unlimited uses)')
    console.log('  - DEMO2024 (unlimited uses)')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Ejecutar test
testReusableInvitations()
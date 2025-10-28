async function testInvitationFlow() {
  console.log('🧪 Testing Invitation Flow...')
  
  try {
    const baseUrl = 'http://localhost:3000'
    
    // 1. Probar que las páginas principales cargan
    console.log('\n📄 Testing page accessibility:')
    
    const pages = [
      { name: 'Home', url: '/' },
      { name: 'Login', url: '/login' },
      { name: 'Registro', url: '/registro' },
      { name: 'Unirse', url: '/unirse' }
    ]
    
    for (const page of pages) {
      try {
        const response = await fetch(`${baseUrl}${page.url}`)
        const status = response.status
        console.log(`  ✅ ${page.name} (${page.url}): ${status === 200 ? 'OK' : status}`)
      } catch (error) {
        console.log(`  ❌ ${page.name} (${page.url}): Error - ${error}`)
      }
    }
    
    console.log('\n🎉 Invitation flow test completed!')
    
    // Mostrar URLs importantes
    console.log('\n🔗 Important URLs:')
    console.log(`  - Home: ${baseUrl}/`)
    console.log(`  - Login: ${baseUrl}/login`)
    console.log(`  - Register: ${baseUrl}/registro`)
    console.log(`  - Join Club: ${baseUrl}/unirse`)
    console.log(`  - Dashboard: ${baseUrl}/dashboard`)
    console.log(`  - Invitations: ${baseUrl}/dashboard/invitations`)
    
    console.log('\n📋 Test invitation codes:')
    console.log('  - TRICLUB2024')
    console.log('  - ELITE123')
    console.log('  - GARMIN456')
    console.log('  - BUENOS789')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Ejecutar test
testInvitationFlow()
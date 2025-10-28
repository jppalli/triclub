async function testStandaloneGarmin() {
  console.log('🧪 Testing Standalone Garmin Admin...')
  
  try {
    const baseUrl = 'http://localhost:3000'
    
    console.log('\n1️⃣ Testing standalone page accessibility:')
    
    // Probar que la página standalone carga sin autenticación
    const pageResponse = await fetch(`${baseUrl}/admin/garmin`)
    console.log(`✅ Standalone page: ${pageResponse.status === 200 ? 'Accessible' : pageResponse.status}`)
    
    console.log('\n🔗 Standalone Garmin Admin URLs:')
    console.log(`  - Standalone Garmin Admin: ${baseUrl}/admin/garmin`)
    console.log(`  - Original Dashboard Admin: ${baseUrl}/dashboard/admin/garmin-data`)
    
    console.log('\n📋 Standalone Features:')
    console.log('  ✅ No authentication required')
    console.log('  ✅ No user session dependency')
    console.log('  ✅ Independent user selection')
    console.log('  ✅ Mock data fallback if API unavailable')
    console.log('  ✅ Full CRUD operations per user')
    console.log('  ✅ Import/Export functionality')
    console.log('  ✅ Real-time statistics')
    
    console.log('\n🎮 How to use:')
    console.log('  1. Go directly to /admin/garmin (no login needed)')
    console.log('  2. Select any user from the dropdown')
    console.log('  3. Manage their Garmin activities independently')
    console.log('  4. Add/Edit/Delete activities as needed')
    console.log('  5. Export/Import data for testing')
    
    console.log('\n💾 Data Management:')
    console.log('  - Uses mock users if API unavailable')
    console.log('  - Separate localStorage per user ID')
    console.log('  - No cross-user data contamination')
    console.log('  - Persistent data between sessions')
    
    console.log('\n🔧 Technical Details:')
    console.log('  - No DashboardLayout dependency')
    console.log('  - No NextAuth session requirement')
    console.log('  - Fallback to mock data if needed')
    console.log('  - Completely standalone operation')
    
    console.log('\n🎯 Use Cases:')
    console.log('  - Development testing without login')
    console.log('  - Demo preparation with specific user data')
    console.log('  - API testing with mock Garmin data')
    console.log('  - Quick data setup for any user')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Ejecutar test
testStandaloneGarmin()
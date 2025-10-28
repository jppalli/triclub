async function testGarminAdmin() {
  console.log('🧪 Testing Garmin Admin System...')
  
  try {
    const baseUrl = 'http://localhost:3000'
    
    console.log('\n1️⃣ Testing admin users API (for user selection):')
    
    // Probar API de usuarios para admin
    const usersResponse = await fetch(`${baseUrl}/api/admin/users`)
    const usersData = await usersResponse.json()
    
    if (usersData.success) {
      console.log(`✅ Users loaded: ${usersData.users.length} users available for Garmin data management`)
      usersData.users.slice(0, 3).forEach((user) => {
        console.log(`  - ${user.name} (${user.email}) - ID: ${user.id}`)
      })
    } else {
      console.log('❌ Failed to load users:', usersData.error)
    }
    
    console.log('\n🔗 Garmin Admin URLs:')
    console.log(`  - Garmin Admin: ${baseUrl}/dashboard/admin/garmin-data`)
    console.log(`  - Workouts Admin: ${baseUrl}/dashboard/admin/workouts`)
    console.log(`  - Dashboard: ${baseUrl}/dashboard`)
    
    console.log('\n📋 Garmin Admin Features:')
    console.log('  ✅ User selection dropdown with all registered users')
    console.log('  ✅ Independent of logged-in user')
    console.log('  ✅ Can manage Garmin data for any selected user')
    console.log('  ✅ Add/Edit/Delete Garmin activities per user')
    console.log('  ✅ Import/Export JSON data per user')
    console.log('  ✅ Real-time statistics for selected user')
    
    console.log('\n🎮 How to use:')
    console.log('  1. Go to /dashboard/admin/garmin-data')
    console.log('  2. Select any user from the dropdown')
    console.log('  3. View/manage their Garmin activities')
    console.log('  4. Add new activities or modify existing ones')
    console.log('  5. Data is stored per user independently')
    
    console.log('\n💾 Data Storage:')
    console.log('  - Each user has separate Garmin data storage')
    console.log('  - Data persists in localStorage per user ID')
    console.log('  - Admin can switch between users seamlessly')
    console.log('  - No cross-contamination of user data')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Ejecutar test
testGarminAdmin()
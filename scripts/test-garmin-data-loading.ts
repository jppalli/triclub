async function testGarminDataLoading() {
  console.log('🧪 Testing Garmin Data Loading...')
  
  try {
    // Simular importación de la librería Garmin
    const { getUserGarminActivities, mockGarminActivities } = await import('../lib/garmin-mock-data')
    
    console.log('\n1️⃣ Testing Garmin mock data availability:')
    
    const testUserId = 'cmhabbtsv0000tmtguvd0b2lx'
    console.log(`Testing user ID: ${testUserId}`)
    
    // Verificar datos mock disponibles
    const availableUsers = Object.keys(mockGarminActivities)
    console.log(`✅ Available users in mock data: ${availableUsers.length}`)
    availableUsers.forEach(userId => {
      const activities = mockGarminActivities[userId]
      console.log(`  - ${userId}: ${activities.length} activities`)
    })
    
    console.log('\n2️⃣ Testing getUserGarminActivities function:')
    
    const userActivities = getUserGarminActivities(testUserId)
    console.log(`✅ Activities for ${testUserId}: ${userActivities.length}`)
    
    if (userActivities.length > 0) {
      console.log('\n📊 Sample activities:')
      userActivities.slice(0, 3).forEach((activity, index) => {
        console.log(`  ${index + 1}. ${activity.title}`)
        console.log(`     Type: ${activity.type}, Duration: ${activity.duration}min`)
        console.log(`     Distance: ${activity.distance}km, Points: ${activity.points}`)
        console.log(`     Created: ${activity.createdAt}`)
      })
    }
    
    console.log('\n3️⃣ Testing email to user ID mapping:')
    
    const emailToUserId = {
      'atleta@triclub.ar': 'cmhabbtsv0000tmtguvd0b2lx',
      'juan@triclub.ar': 'cmhabbtsv0000tmtguvd0b2lx',
      'admin@triclub.ar': 'cmhabbtsv0000tmtguvd0b2lx'
    }
    
    Object.entries(emailToUserId).forEach(([email, userId]) => {
      const activities = getUserGarminActivities(userId)
      console.log(`✅ ${email} → ${userId}: ${activities.length} activities`)
    })
    
    console.log('\n4️⃣ Testing data conversion:')
    
    if (userActivities.length > 0) {
      const sampleActivity = userActivities[0]
      console.log('✅ Sample converted activity structure:')
      console.log(`  - ID: ${sampleActivity.id}`)
      console.log(`  - Title: ${sampleActivity.title}`)
      console.log(`  - Type: ${sampleActivity.type}`)
      console.log(`  - Duration: ${sampleActivity.duration} minutes`)
      console.log(`  - Distance: ${sampleActivity.distance} km`)
      console.log(`  - Calories: ${sampleActivity.calories}`)
      console.log(`  - Heart Rate: ${sampleActivity.heartRate}`)
      console.log(`  - Points: ${sampleActivity.points}`)
      console.log(`  - Has Garmin Data: ${!!sampleActivity.garminData}`)
    }
    
    console.log('\n🔗 Dashboard URLs to test:')
    console.log('  - Login as atleta@triclub.ar: http://localhost:3000/login')
    console.log('  - Dashboard: http://localhost:3000/dashboard')
    console.log('  - Garmin Admin: http://localhost:3000/admin/garmin')
    
    console.log('\n📋 Expected behavior:')
    console.log('  ✅ User atleta@triclub.ar should see Garmin data in dashboard')
    console.log('  ✅ GarminSync should show as connected with activities')
    console.log('  ✅ GarminStats should display statistics from Garmin data')
    console.log('  ✅ RecentWorkouts should include Garmin activities')
    
    console.log('\n🎯 Troubleshooting:')
    console.log('  - Check if user is logged in with correct email')
    console.log('  - Verify email to user ID mapping is correct')
    console.log('  - Ensure components are using session data properly')
    console.log('  - Check browser console for any errors')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Ejecutar test
testGarminDataLoading()
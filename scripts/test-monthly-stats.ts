async function testMonthlyStats() {
  console.log('🧪 Testing Monthly Statistics...')
  
  try {
    // Simular importación de la librería Garmin
    const { getUserGarminActivities } = await import('../lib/garmin-mock-data')
    
    console.log('\n1️⃣ Testing current month filtering:')
    
    const testUserId = 'cmhabbtsv0000tmtguvd0b2lx'
    const allActivities = getUserGarminActivities(testUserId)
    
    console.log(`✅ Total activities available: ${allActivities.length}`)
    
    // Filtrar por mes actual
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthName = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    
    console.log(`📅 Current month: ${monthName} (${currentMonth}/${currentYear})`)
    
    const thisMonthActivities = allActivities.filter(activity => {
      const activityDate = new Date(activity.createdAt)
      const isThisMonth = activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear
      
      console.log(`  - ${activity.title}: ${activity.createdAt} → ${isThisMonth ? '✅ This month' : '❌ Other month'}`)
      
      return isThisMonth
    })
    
    console.log(`\n✅ Activities in ${monthName}: ${thisMonthActivities.length}`)
    
    console.log('\n2️⃣ Testing monthly statistics calculation:')
    
    const monthlyStats = thisMonthActivities.reduce((acc, activity) => {
      acc.totalWorkouts++
      acc.totalDuration += activity.duration
      acc.totalDistance += activity.distance || 0
      acc.totalCalories += activity.calories || 0
      acc.totalPoints += activity.points
      
      if (activity.heartRate) {
        acc.heartRateSum += activity.heartRate
        acc.heartRateCount++
      }
      
      return acc
    }, {
      totalWorkouts: 0,
      totalDuration: 0,
      totalDistance: 0,
      totalCalories: 0,
      totalPoints: 0,
      heartRateSum: 0,
      heartRateCount: 0
    })
    
    const avgHeartRate = monthlyStats.heartRateCount > 0 ? 
      Math.round(monthlyStats.heartRateSum / monthlyStats.heartRateCount) : 0
    
    console.log('📊 Monthly Statistics:')
    console.log(`  - Entrenamientos: ${monthlyStats.totalWorkouts}`)
    console.log(`  - Tiempo Total: ${Math.round(monthlyStats.totalDuration / 60)}h ${monthlyStats.totalDuration % 60}m`)
    console.log(`  - Distancia: ${monthlyStats.totalDistance.toFixed(1)}km`)
    console.log(`  - Calorías: ${monthlyStats.totalCalories}`)
    console.log(`  - FC Promedio: ${avgHeartRate} bpm`)
    console.log(`  - Puntos: ${monthlyStats.totalPoints}`)
    
    console.log('\n3️⃣ Testing recent workouts filtering:')
    
    // Simular el filtrado de entrenamientos recientes del mes
    const recentThisMonth = thisMonthActivities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    
    console.log(`✅ Recent workouts this month: ${recentThisMonth.length}`)
    recentThisMonth.forEach((activity, index) => {
      console.log(`  ${index + 1}. ${activity.title} (${activity.type})`)
      console.log(`     Date: ${new Date(activity.createdAt).toLocaleDateString('es-AR')}`)
    })
    
    console.log('\n🔗 Dashboard behavior:')
    console.log(`  - GarminStats will show statistics for ${monthName}`)
    console.log(`  - RecentWorkouts will show "${monthName}" workouts`)
    console.log(`  - All components filter by current month automatically`)
    
    console.log('\n📅 Expected dashboard content:')
    if (thisMonthActivities.length > 0) {
      console.log(`  ✅ Dashboard will show ${thisMonthActivities.length} workouts from ${monthName}`)
      console.log(`  ✅ Statistics will reflect monthly totals`)
      console.log(`  ✅ Recent workouts will show up to 5 from this month`)
    } else {
      console.log(`  ⚠️  Dashboard will show "No workouts this month" message`)
      console.log(`  ⚠️  But will indicate ${allActivities.length} total workouts available`)
    }
    
    console.log('\n🎯 To test:')
    console.log('  1. Login as atleta@triclub.ar')
    console.log('  2. Go to dashboard')
    console.log('  3. Check that statistics show "Este mes" labels')
    console.log('  4. Verify workout counts match monthly filtering')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Ejecutar test
testMonthlyStats()
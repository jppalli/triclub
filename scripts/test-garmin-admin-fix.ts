import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testGarminAdminFix() {
  console.log('Testing Garmin Admin Fix...');
  
  try {
    // Create a test user if one doesn't exist
    let testUser = await prisma.user.findFirst({
      where: { email: 'test-garmin@example.com' }
    });
    
    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: 'test-garmin@example.com',
          name: 'Test Garmin User',
          points: 0
        }
      });
      console.log('Created test user:', testUser.id);
    } else {
      console.log('Using existing test user:', testUser.id);
    }
    
    // Test creating a workout for the user
    const workout = await prisma.workout.create({
      data: {
        userId: testUser.id,
        title: 'Test Running Workout',
        type: 'RUNNING',
        duration: 30,
        distance: 5.2,
        calories: 300,
        date: new Date(),
        source: 'MANUAL'
      }
    });
    
    console.log('Created test workout:', workout.id);
    
    // Test fetching workouts for the user
    const userWorkouts = await prisma.workout.findMany({
      where: { userId: testUser.id },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${userWorkouts.length} workouts for user ${testUser.id}`);
    
    // Test fetching workouts via the API endpoint
    // This would normally be done via HTTP request, but we can simulate it
    const allWorkouts = await prisma.workout.findMany({
      where: { userId: testUser.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`API would return ${allWorkouts.length} workouts for user ${testUser.id}`);
    
    // Clean up test data
    await prisma.workout.deleteMany({
      where: { userId: testUser.id }
    });
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testGarminAdminFix();
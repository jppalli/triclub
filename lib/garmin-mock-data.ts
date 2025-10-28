// Mock data que simula respuestas reales de Garmin Connect API
// Basado en la documentación oficial: https://developer.garmin.com/gc-developer-program/activity-api/

export interface GarminActivity {
  activityId: number
  activityName: string
  description: string | null
  startTimeLocal: string
  startTimeGMT: string
  activityType: {
    typeId: number
    typeKey: string
    parentTypeId: number
  }
  eventType: {
    typeId: number
    typeKey: string
  }
  distance: number // metros
  duration: number // segundos
  elapsedDuration: number // segundos
  movingDuration: number // segundos
  elevationGain: number // metros
  elevationLoss: number // metros
  averageSpeed: number // m/s
  maxSpeed: number // m/s
  calories: number
  averageHR: number | null
  maxHR: number | null
  averageRunningCadence: number | null
  maxRunningCadence: number | null
  averageBikingCadence: number | null
  maxBikingCadence: number | null
  averageSwimCadence: number | null
  maxSwimCadence: number | null
  strokes: number | null
  avgStrokeDistance: number | null
  poolLength: number | null
  unitOfPoolLength: string | null
  hasPolyline: boolean
  ownerId: number
  ownerDisplayName: string
  ownerFullName: string
  ownerProfileImageUrlSmall: string | null
  ownerProfileImageUrlMedium: string | null
  ownerProfileImageUrlLarge: string | null
  locationName: string | null
  beginTimestamp: number
  sportTypeId: number
  avgPower: number | null
  maxPower: number | null
  aerobicTrainingEffect: number | null
  anaerobicTrainingEffect: number | null
  moderateIntensityMinutes: number | null
  vigorousIntensityMinutes: number | null
}

// Mock data de entrenamientos para diferentes usuarios
export const mockGarminActivities: Record<string, GarminActivity[]> = {
  // Usuario demo: Juan Pedro Palli
  'cmhabbtsv0000tmtguvd0b2lx': [
    {
      activityId: 12345678901,
      activityName: "Entrenamiento de Natación Matutino",
      description: "Sesión técnica en piscina olímpica - Series de 100m",
      startTimeLocal: "2025-10-28T07:00:00",
      startTimeGMT: "2025-10-28T10:00:00Z",
      activityType: {
        typeId: 5,
        typeKey: "lap_swimming",
        parentTypeId: 5
      },
      eventType: {
        typeId: 9,
        typeKey: "training"
      },
      distance: 2500, // 2.5km
      duration: 3600, // 1 hora
      elapsedDuration: 3720, // 1h 2min (incluye descansos)
      movingDuration: 3600,
      elevationGain: 0,
      elevationLoss: 0,
      averageSpeed: 0.69, // m/s (2:24/100m)
      maxSpeed: 1.2,
      calories: 485,
      averageHR: 142,
      maxHR: 165,
      averageRunningCadence: null,
      maxRunningCadence: null,
      averageBikingCadence: null,
      maxBikingCadence: null,
      averageSwimCadence: 28, // brazadas por minuto
      maxSwimCadence: 35,
      strokes: 2800,
      avgStrokeDistance: 0.89, // metros por brazada
      poolLength: 50,
      unitOfPoolLength: "METER",
      hasPolyline: false,
      ownerId: 12345,
      ownerDisplayName: "JuanPedro_P",
      ownerFullName: "Juan Pedro Palli",
      ownerProfileImageUrlSmall: null,
      ownerProfileImageUrlMedium: null,
      ownerProfileImageUrlLarge: null,
      locationName: "Club Náutico San Isidro",
      beginTimestamp: 1761642000000,
      sportTypeId: 5,
      avgPower: null,
      maxPower: null,
      aerobicTrainingEffect: 3.2,
      anaerobicTrainingEffect: 1.8,
      moderateIntensityMinutes: 45,
      vigorousIntensityMinutes: 15
    },
    {
      activityId: 12345678902,
      activityName: "Ruta Ciclística - Delta del Tigre",
      description: "Entrenamiento de resistencia aeróbica en terreno mixto",
      startTimeLocal: "2025-10-27T08:30:00",
      startTimeGMT: "2025-10-27T11:30:00Z",
      activityType: {
        typeId: 2,
        typeKey: "cycling",
        parentTypeId: 2
      },
      eventType: {
        typeId: 9,
        typeKey: "training"
      },
      distance: 45000, // 45km
      duration: 5400, // 1.5 horas
      elapsedDuration: 5580, // 1h 33min
      movingDuration: 5280, // 1h 28min
      elevationGain: 245,
      elevationLoss: 238,
      averageSpeed: 8.33, // m/s (30 km/h)
      maxSpeed: 16.67, // 60 km/h
      calories: 892,
      averageHR: 148,
      maxHR: 172,
      averageRunningCadence: null,
      maxRunningCadence: null,
      averageBikingCadence: 85, // rpm
      maxBikingCadence: 110,
      averageSwimCadence: null,
      maxSwimCadence: null,
      strokes: null,
      avgStrokeDistance: null,
      poolLength: null,
      unitOfPoolLength: null,
      hasPolyline: true,
      ownerId: 12345,
      ownerDisplayName: "JuanPedro_P",
      ownerFullName: "Juan Pedro Palli",
      ownerProfileImageUrlSmall: null,
      ownerProfileImageUrlMedium: null,
      ownerProfileImageUrlLarge: null,
      locationName: "Tigre, Buenos Aires",
      beginTimestamp: 1761555000000,
      sportTypeId: 2,
      avgPower: 185, // watts
      maxPower: 420,
      aerobicTrainingEffect: 4.1,
      anaerobicTrainingEffect: 2.3,
      moderateIntensityMinutes: 65,
      vigorousIntensityMinutes: 25
    },
    {
      activityId: 12345678903,
      activityName: "Running - Costanera Norte",
      description: "Tempo run con intervalos de velocidad",
      startTimeLocal: "2025-10-26T18:45:00",
      startTimeGMT: "2025-10-26T21:45:00Z",
      activityType: {
        typeId: 1,
        typeKey: "running",
        parentTypeId: 1
      },
      eventType: {
        typeId: 9,
        typeKey: "training"
      },
      distance: 10000, // 10km
      duration: 2520, // 42 minutos
      elapsedDuration: 2640, // 44 minutos
      movingDuration: 2520,
      elevationGain: 45,
      elevationLoss: 42,
      averageSpeed: 3.97, // m/s (4:12/km)
      maxSpeed: 5.56, // 3:00/km
      calories: 658,
      averageHR: 158,
      maxHR: 182,
      averageRunningCadence: 178, // pasos por minuto
      maxRunningCadence: 195,
      averageBikingCadence: null,
      maxBikingCadence: null,
      averageSwimCadence: null,
      maxSwimCadence: null,
      strokes: null,
      avgStrokeDistance: null,
      poolLength: null,
      unitOfPoolLength: null,
      hasPolyline: true,
      ownerId: 12345,
      ownerDisplayName: "JuanPedro_P",
      ownerFullName: "Juan Pedro Palli",
      ownerProfileImageUrlSmall: null,
      ownerProfileImageUrlMedium: null,
      ownerProfileImageUrlLarge: null,
      locationName: "Puerto Madero, CABA",
      beginTimestamp: 1761507900000,
      sportTypeId: 1,
      avgPower: null,
      maxPower: null,
      aerobicTrainingEffect: 3.8,
      anaerobicTrainingEffect: 3.2,
      moderateIntensityMinutes: 25,
      vigorousIntensityMinutes: 17
    },
    {
      activityId: 12345678904,
      activityName: "Triatlón Simulacro - Olímpico",
      description: "Simulacro completo de triatlón olímpico para competencia",
      startTimeLocal: "2025-10-25T07:00:00",
      startTimeGMT: "2025-10-25T10:00:00Z",
      activityType: {
        typeId: 18,
        typeKey: "multi_sport",
        parentTypeId: 18
      },
      eventType: {
        typeId: 9,
        typeKey: "training"
      },
      distance: 52500, // 1.5km natación + 40km ciclismo + 10km running
      duration: 7200, // 2 horas
      elapsedDuration: 7680, // 2h 8min
      movingDuration: 7080, // 1h 58min
      elevationGain: 180,
      elevationLoss: 175,
      averageSpeed: 7.42, // m/s promedio general
      maxSpeed: 15.28,
      calories: 1456,
      averageHR: 152,
      maxHR: 185,
      averageRunningCadence: 175,
      maxRunningCadence: 190,
      averageBikingCadence: 82,
      maxBikingCadence: 105,
      averageSwimCadence: 30,
      maxSwimCadence: 38,
      strokes: 1350,
      avgStrokeDistance: 1.11,
      poolLength: null,
      unitOfPoolLength: null,
      hasPolyline: true,
      ownerId: 12345,
      ownerDisplayName: "JuanPedro_P",
      ownerFullName: "Juan Pedro Palli",
      ownerProfileImageUrlSmall: null,
      ownerProfileImageUrlMedium: null,
      ownerProfileImageUrlLarge: null,
      locationName: "Club de Triatlón Buenos Aires",
      beginTimestamp: 1761372000000,
      sportTypeId: 18,
      avgPower: 165,
      maxPower: 380,
      aerobicTrainingEffect: 4.8,
      anaerobicTrainingEffect: 3.5,
      moderateIntensityMinutes: 85,
      vigorousIntensityMinutes: 35
    },
    {
      activityId: 12345678905,
      activityName: "Entrenamiento de Fuerza - Gimnasio",
      description: "Sesión de fuerza funcional para triatlón",
      startTimeLocal: "2025-10-24T19:00:00",
      startTimeGMT: "2025-10-24T22:00:00Z",
      activityType: {
        typeId: 13,
        typeKey: "strength_training",
        parentTypeId: 13
      },
      eventType: {
        typeId: 9,
        typeKey: "training"
      },
      distance: 0,
      duration: 3600, // 1 hora
      elapsedDuration: 3900, // 1h 5min
      movingDuration: 2700, // 45min activos
      elevationGain: 0,
      elevationLoss: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      calories: 385,
      averageHR: 125,
      maxHR: 165,
      averageRunningCadence: null,
      maxRunningCadence: null,
      averageBikingCadence: null,
      maxBikingCadence: null,
      averageSwimCadence: null,
      maxSwimCadence: null,
      strokes: null,
      avgStrokeDistance: null,
      poolLength: null,
      unitOfPoolLength: null,
      hasPolyline: false,
      ownerId: 12345,
      ownerDisplayName: "JuanPedro_P",
      ownerFullName: "Juan Pedro Palli",
      ownerProfileImageUrlSmall: null,
      ownerProfileImageUrlMedium: null,
      ownerProfileImageUrlLarge: null,
      locationName: "Megatlon Puerto Madero",
      beginTimestamp: 1761336000000,
      sportTypeId: 13,
      avgPower: null,
      maxPower: null,
      aerobicTrainingEffect: 2.1,
      anaerobicTrainingEffect: 1.5,
      moderateIntensityMinutes: 35,
      vigorousIntensityMinutes: 10
    },
    {
      activityId: 12345678906,
      activityName: "Natación Técnica - Aguas Abiertas",
      description: "Entrenamiento de técnica en aguas abiertas del Río de la Plata",
      startTimeLocal: "2025-10-22T09:00:00",
      startTimeGMT: "2025-10-22T12:00:00Z",
      activityType: {
        typeId: 5,
        typeKey: "open_water_swimming",
        parentTypeId: 5
      },
      eventType: {
        typeId: 9,
        typeKey: "training"
      },
      distance: 3000,
      duration: 4200,
      elapsedDuration: 4380,
      movingDuration: 4200,
      elevationGain: 0,
      elevationLoss: 0,
      averageSpeed: 0.71,
      maxSpeed: 1.1,
      calories: 520,
      averageHR: 138,
      maxHR: 158,
      averageRunningCadence: null,
      maxRunningCadence: null,
      averageBikingCadence: null,
      maxBikingCadence: null,
      averageSwimCadence: 26,
      maxSwimCadence: 32,
      strokes: 3200,
      avgStrokeDistance: 0.94,
      poolLength: null,
      unitOfPoolLength: null,
      hasPolyline: true,
      ownerId: 12345,
      ownerDisplayName: "JuanPedro_P",
      ownerFullName: "Juan Pedro Palli",
      ownerProfileImageUrlSmall: null,
      ownerProfileImageUrlMedium: null,
      ownerProfileImageUrlLarge: null,
      locationName: "Costanera Norte, CABA",
      beginTimestamp: 1761163200000,
      sportTypeId: 5,
      avgPower: null,
      maxPower: null,
      aerobicTrainingEffect: 3.5,
      anaerobicTrainingEffect: 2.0,
      moderateIntensityMinutes: 55,
      vigorousIntensityMinutes: 15
    },
    {
      activityId: 12345678907,
      activityName: "Intervalos en Pista - Velocidad",
      description: "Entrenamiento de velocidad en pista de atletismo - 8x400m",
      startTimeLocal: "2025-10-20T18:00:00",
      startTimeGMT: "2025-10-20T21:00:00Z",
      activityType: {
        typeId: 1,
        typeKey: "running",
        parentTypeId: 1
      },
      eventType: {
        typeId: 9,
        typeKey: "training"
      },
      distance: 6000,
      duration: 1800,
      elapsedDuration: 2100,
      movingDuration: 1800,
      elevationGain: 15,
      elevationLoss: 15,
      averageSpeed: 3.33,
      maxSpeed: 5.0,
      calories: 420,
      averageHR: 168,
      maxHR: 188,
      averageRunningCadence: 185,
      maxRunningCadence: 200,
      averageBikingCadence: null,
      maxBikingCadence: null,
      averageSwimCadence: null,
      maxSwimCadence: null,
      strokes: null,
      avgStrokeDistance: null,
      poolLength: null,
      unitOfPoolLength: null,
      hasPolyline: true,
      ownerId: 12345,
      ownerDisplayName: "JuanPedro_P",
      ownerFullName: "Juan Pedro Palli",
      ownerProfileImageUrlSmall: null,
      ownerProfileImageUrlMedium: null,
      ownerProfileImageUrlLarge: null,
      locationName: "Pista del CeNARD",
      beginTimestamp: 1760990400000,
      sportTypeId: 1,
      avgPower: null,
      maxPower: null,
      aerobicTrainingEffect: 4.2,
      anaerobicTrainingEffect: 4.5,
      moderateIntensityMinutes: 10,
      vigorousIntensityMinutes: 20
    }
  ]
}

// Función para convertir datos de Garmin a formato de la aplicación
export function convertGarminToAppFormat(garminActivity: GarminActivity): any {
  const typeMapping: Record<string, string> = {
    'lap_swimming': 'SWIMMING',
    'open_water_swimming': 'SWIMMING',
    'cycling': 'CYCLING',
    'running': 'RUNNING',
    'multi_sport': 'TRIATHLON',
    'strength_training': 'OTHER'
  }

  const calculatePace = (distance: number, duration: number, type: string): string => {
    if (distance === 0) return '-'
    
    const speed = distance / duration // m/s
    
    switch (type) {
      case 'SWIMMING':
        const pace100m = (100 / speed) / 60 // minutos por 100m
        const minutes = Math.floor(pace100m)
        const seconds = Math.round((pace100m - minutes) * 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}/100m`
      
      case 'RUNNING':
        const paceKm = (1000 / speed) / 60 // minutos por km
        const minKm = Math.floor(paceKm)
        const secKm = Math.round((paceKm - minKm) * 60)
        return `${minKm}:${secKm.toString().padStart(2, '0')}/km`
      
      case 'CYCLING':
        const speedKmh = speed * 3.6 // km/h
        return `${speedKmh.toFixed(1)} km/h`
      
      default:
        return '-'
    }
  }

  const calculatePoints = (type: string, duration: number, distance: number, calories: number): number => {
    const durationMinutes = duration / 60
    const distanceKm = distance / 1000

    let basePoints = 0
    
    switch (type) {
      case 'SWIMMING':
        basePoints = Math.floor(durationMinutes * 2.5 + distanceKm * 60)
        break
      case 'CYCLING':
        basePoints = Math.floor(durationMinutes * 1.8 + distanceKm * 4)
        break
      case 'RUNNING':
        basePoints = Math.floor(durationMinutes * 3 + distanceKm * 12)
        break
      case 'TRIATHLON':
        basePoints = Math.floor(durationMinutes * 4 + distanceKm * 8)
        break
      default:
        basePoints = Math.floor(durationMinutes * 1.5)
    }

    // Bonus por intensidad (basado en calorías)
    const intensityBonus = Math.floor(calories / 50)
    
    return basePoints + intensityBonus
  }

  const appType = typeMapping[garminActivity.activityType.typeKey] || 'OTHER'

  return {
    id: `garmin_${garminActivity.activityId}`,
    title: garminActivity.activityName,
    description: garminActivity.description,
    type: appType,
    duration: Math.round(garminActivity.duration / 60), // convertir a minutos
    distance: garminActivity.distance > 0 ? garminActivity.distance / 1000 : null, // convertir a km
    calories: garminActivity.calories,
    heartRate: garminActivity.averageHR,
    avgPace: calculatePace(garminActivity.distance, garminActivity.duration, appType),
    location: garminActivity.locationName,
    points: calculatePoints(appType, garminActivity.duration, garminActivity.distance, garminActivity.calories),
    createdAt: garminActivity.startTimeLocal,
    garminId: garminActivity.activityId.toString(),
    // Datos adicionales de Garmin
    garminData: {
      elevationGain: garminActivity.elevationGain,
      maxSpeed: garminActivity.maxSpeed,
      maxHR: garminActivity.maxHR,
      cadence: garminActivity.averageRunningCadence || garminActivity.averageBikingCadence || garminActivity.averageSwimCadence,
      power: garminActivity.avgPower,
      trainingEffect: {
        aerobic: garminActivity.aerobicTrainingEffect,
        anaerobic: garminActivity.anaerobicTrainingEffect
      },
      intensityMinutes: {
        moderate: garminActivity.moderateIntensityMinutes,
        vigorous: garminActivity.vigorousIntensityMinutes
      }
    }
  }
}

// Función para obtener entrenamientos de un usuario específico
export function getUserGarminActivities(userId: string): any[] {
  // Intentar cargar desde localStorage primero
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('triclub_garmin_mock_data')
      if (stored) {
        const storedData = JSON.parse(stored)
        if (storedData[userId]) {
          return storedData[userId].map(convertGarminToAppFormat)
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }
  
  // Fallback a datos mock por defecto
  const userActivities = mockGarminActivities[userId] || []
  return userActivities.map(convertGarminToAppFormat)
}
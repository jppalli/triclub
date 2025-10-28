import { getUserGarminActivities } from './garmin-mock-data'

export interface UserStats {
  totalWorkouts: number
  totalDistance: number
  totalDuration: number // en horas
  totalPoints: number
  totalCalories: number
  averageHeartRate: number
  thisMonthWorkouts: number
  thisMonthDistance: number
  thisMonthDuration: number
  thisMonthPoints: number
  lastMonthWorkouts: number
  lastMonthDistance: number
  level: string
  rankingPosition: number
  weeklyProgress: {
    swimming: number
    cycling: number
    running: number
    totalDistance: number
    workoutCount: number
  }
}

export function calculateUserStats(userId: string): UserStats {
  const workouts = getUserGarminActivities(userId)
  
  // Si no hay workouts, devolver stats vacíos
  if (!workouts || workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalDistance: 0,
      totalDuration: 0,
      totalPoints: 0,
      totalCalories: 0,
      averageHeartRate: 0,
      thisMonthWorkouts: 0,
      thisMonthDistance: 0,
      thisMonthDuration: 0,
      thisMonthPoints: 0,
      lastMonthWorkouts: 0,
      lastMonthDistance: 0,
      level: 'Principiante',
      rankingPosition: 5,
      weeklyProgress: {
        swimming: 0,
        cycling: 0,
        running: 0,
        totalDistance: 0,
        workoutCount: 0
      }
    }
  }
  
  // Calcular totales
  const totalWorkouts = workouts.length
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0)
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0) / 60 // convertir a horas
  const totalPoints = workouts.reduce((sum, w) => sum + w.points, 0)
  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0)
  
  // Calcular frecuencia cardíaca promedio
  const workoutsWithHR = workouts.filter(w => w.heartRate && w.heartRate > 0)
  const averageHeartRate = workoutsWithHR.length > 0 
    ? workoutsWithHR.reduce((sum, w) => sum + (w.heartRate || 0), 0) / workoutsWithHR.length
    : 0
  
  // Calcular estadísticas mensuales
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  
  const thisMonthWorkoutsData = workouts.filter(w => new Date(w.createdAt) >= thisMonthStart)
  const lastMonthWorkoutsData = workouts.filter(w => {
    const date = new Date(w.createdAt)
    return date >= lastMonthStart && date <= lastMonthEnd
  })
  
  const thisMonthWorkouts = thisMonthWorkoutsData.length
  const thisMonthDistance = thisMonthWorkoutsData.reduce((sum, w) => sum + (w.distance || 0), 0)
  const thisMonthDuration = thisMonthWorkoutsData.reduce((sum, w) => sum + w.duration, 0) / 60
  const thisMonthPoints = thisMonthWorkoutsData.reduce((sum, w) => sum + w.points, 0)
  
  const lastMonthWorkouts = lastMonthWorkoutsData.length
  const lastMonthDistance = lastMonthWorkoutsData.reduce((sum, w) => sum + (w.distance || 0), 0)
  
  // Determinar nivel basado en puntos
  let level = 'Principiante'
  if (totalPoints >= 5000) level = 'Elite'
  else if (totalPoints >= 3000) level = 'Avanzado'
  else if (totalPoints >= 1500) level = 'Intermedio'
  
  // Calcular ranking simulado basado en puntos
  const rankingPosition = totalPoints >= 5000 ? 1 : 
                         totalPoints >= 3000 ? 2 : 
                         totalPoints >= 1500 ? 3 : 
                         totalPoints >= 500 ? 4 : 5
  
  // Calcular progreso semanal
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Domingo
  
  const thisWeekWorkouts = workouts.filter(w => new Date(w.createdAt) >= weekStart)
  
  const weeklyProgress = {
    swimming: thisWeekWorkouts
      .filter(w => w.type === 'SWIMMING')
      .reduce((sum, w) => sum + (w.distance || 0), 0),
    cycling: thisWeekWorkouts
      .filter(w => w.type === 'CYCLING')
      .reduce((sum, w) => sum + (w.distance || 0), 0),
    running: thisWeekWorkouts
      .filter(w => w.type === 'RUNNING')
      .reduce((sum, w) => sum + (w.distance || 0), 0),
    totalDistance: thisWeekWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0),
    workoutCount: thisWeekWorkouts.length
  }
  
  return {
    totalWorkouts,
    totalDistance,
    totalDuration,
    totalPoints,
    totalCalories,
    averageHeartRate: Math.round(averageHeartRate),
    thisMonthWorkouts,
    thisMonthDistance,
    thisMonthDuration,
    thisMonthPoints,
    lastMonthWorkouts,
    lastMonthDistance,
    level,
    rankingPosition,
    weeklyProgress
  }
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInDays = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoy'
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays <= 7) return `Hace ${diffInDays} días`
  if (diffInDays <= 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`
  return `Hace ${Math.floor(diffInDays / 30)} meses`
}

export function calculatePercentageChange(current: number, previous: number): string {
  if (previous === 0) {
    return current > 0 ? '+100%' : '0%'
  }
  
  const change = ((current - previous) / previous) * 100
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(0)}%`
}
import { type GarminActivity } from './garmin-mock-data'

const STORAGE_KEY = 'triclub_garmin_mock_data'

export function saveGarminActivities(userId: string, activities: GarminActivity[]): void {
  if (typeof window === 'undefined') return
  
  try {
    const existingData = getStoredGarminData()
    existingData[userId] = activities
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData))
  } catch (error) {
    console.error('Error saving Garmin activities:', error)
  }
}

export function loadGarminActivities(userId: string): GarminActivity[] | null {
  if (typeof window === 'undefined') return null
  
  try {
    const storedData = getStoredGarminData()
    return storedData[userId] || null
  } catch (error) {
    console.error('Error loading Garmin activities:', error)
    return null
  }
}

export function getStoredGarminData(): Record<string, GarminActivity[]> {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error parsing stored Garmin data:', error)
    return {}
  }
}

export function exportGarminData(): string {
  const data = getStoredGarminData()
  return JSON.stringify(data, null, 2)
}

export function importGarminData(jsonData: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const data = JSON.parse(jsonData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Error importing Garmin data:', error)
    return false
  }
}

export function clearGarminData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
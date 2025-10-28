# Plan de Implementación: Corrección del Sistema de Actividades Garmin

## 🎯 Objetivo
Asegurar que cada usuario solo vea sus propias actividades y que las actividades cargadas por el admin se mapeen correctamente a cada usuario.

## 📋 Cambios Necesarios

### 1. Actualizar Schema de Base de Datos

**Archivo:** `prisma/schema.prisma`

**Problema:** Faltan campos que el admin API está intentando usar.

**Campos faltantes:**
- `date` - Fecha del entrenamiento
- `avgHeartRate` - Frecuencia cardíaca promedio
- `maxHeartRate` - Frecuencia cardíaca máxima
- `pace` - Ritmo del entrenamiento
- `notes` - Notas adicionales
- `source` - Origen del dato (MANUAL, GARMIN, etc.)

### 2. Corregir API de Workouts

**Archivo:** `app/api/workouts/recent/route.ts`

**Problema:** No filtra por el usuario actual de la sesión.

**Solución:** Obtener el usuario de la sesión y filtrar solo sus workouts.

### 3. Corregir Dashboard de Workouts

**Archivo:** `app/dashboard/workouts/page.tsx`

**Problema:** Usuario hardcodeado `'cmhabbtsv0000tmtguvd0b2lx'`.

**Solución:** Usar la sesión del usuario actual para cargar sus datos.

### 4. Corregir Admin Garmin

**Archivo:** `app/admin/garmin/page.tsx`

**Problema:** Usa localStorage en lugar de la base de datos.

**Solución:** Usar la API `/api/admin/workouts` para persistir datos.

### 5. Actualizar Componentes del Dashboard

**Archivos:**
- `components/dashboard/RecentWorkouts.tsx`
- `components/dashboard/GarminStats.tsx`

**Problema:** No filtran correctamente por usuario actual.

**Solución:** Asegurar que solo carguen datos del usuario de la sesión.

## 🔧 Implementación Paso a Paso

### Paso 1: Actualizar Schema (CRÍTICO)

```prisma
model Workout {
  id            String      @id @default(cuid())
  userId        String
  title         String
  description   String?
  type          WorkoutType
  duration      Int         // in minutes
  distance      Float?      // in kilometers
  calories      Int?
  avgPace       String?
  heartRate     Int?        // Mantener para compatibilidad
  avgHeartRate  Int?        // Nuevo campo
  maxHeartRate  Int?        // Nuevo campo
  pace          String?     // Nuevo campo
  location      String?
  notes         String?     // Nuevo campo
  points        Int         @default(0)
  garminId      String?     @unique
  date          DateTime    @default(now()) // Nuevo campo
  source        String      @default("MANUAL") // Nuevo campo
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Paso 2: Migración de Base de Datos

```bash
npx prisma migrate dev --name add_workout_fields
npx prisma generate
```

### Paso 3: Corregir API de Workouts Recent

Asegurar que filtre por usuario actual:

```typescript
// Obtener usuario de la sesión
const user = await prisma.user.findUnique({
  where: { email: session.user.email }
})

if (!user) {
  return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
}

// Filtrar solo workouts del usuario actual
const workouts = await prisma.workout.findMany({
  where: {
    userId: user.id  // ✅ Solo del usuario actual
  },
  include: {
    user: {
      select: {
        name: true,
        email: true,
        image: true
      }
    }
  },
  orderBy: {
    date: 'desc'
  },
  take: limit
})
```

### Paso 4: Corregir Dashboard de Workouts

Eliminar usuario hardcodeado y usar sesión:

```typescript
export default function WorkoutsPage() {
  const { data: session } = useSession()
  const [workouts, setWorkouts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      loadWorkouts()
    }
  }, [session])

  const loadWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts/recent?limit=50')
      const data = await response.json()
      if (data.success) {
        setWorkouts(data.workouts)
      }
    } catch (error) {
      console.error('Error loading workouts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ... resto del componente
}
```

### Paso 5: Actualizar Admin Garmin

Cambiar de localStorage a API:

```typescript
const handleAdd = async () => {
  if (!selectedUserId) return
  
  try {
    const response = await fetch('/api/admin/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: selectedUserId,
        type: getWorkoutType(newActivity.activityType?.typeKey),
        duration: Math.round((newActivity.duration || 0) / 60), // segundos a minutos
        distance: (newActivity.distance || 0) / 1000, // metros a km
        calories: newActivity.calories || 0,
        avgHeartRate: newActivity.averageHR || null,
        maxHeartRate: newActivity.maxHR || null,
        pace: calculatePace(newActivity),
        location: newActivity.locationName || null,
        notes: newActivity.description || null,
        date: newActivity.startTimeLocal || new Date().toISOString()
      })
    })
    
    if (response.ok) {
      await loadUserActivities(selectedUserId)
      setShowAddForm(false)
      setNewActivity({})
    }
  } catch (error) {
    console.error('Error creating workout:', error)
  }
}
```

## ✅ Checklist de Validación

Después de implementar los cambios, verificar:

- [ ] El schema tiene todos los campos necesarios
- [ ] La migración se ejecutó correctamente
- [ ] `/api/workouts/recent` filtra por usuario actual
- [ ] Dashboard muestra solo workouts del usuario logueado
- [ ] Admin puede crear workouts para cualquier usuario
- [ ] Los workouts creados por admin aparecen en el dashboard del usuario correcto
- [ ] No hay fugas de datos entre usuarios
- [ ] localStorage ya no se usa para workouts
- [ ] Todos los workouts tienen un `userId` válido

## 🧪 Pruebas

### Prueba 1: Usuario ve solo sus workouts
1. Login como Usuario A
2. Ir a `/dashboard/workouts`
3. Verificar que solo aparecen workouts del Usuario A

### Prueba 2: Admin crea workout para usuario
1. Login como Admin
2. Ir a `/admin/garmin`
3. Seleccionar Usuario B
4. Crear un workout
5. Logout y login como Usuario B
6. Verificar que el workout aparece en su dashboard

### Prueba 3: Sin fugas de datos
1. Login como Usuario A
2. Abrir DevTools > Network
3. Cargar dashboard
4. Verificar que la API solo devuelve workouts con userId del Usuario A

## 📊 Impacto

**Antes:**
- ❌ Datos en localStorage (no persisten)
- ❌ Usuario hardcodeado
- ❌ Posibles fugas de datos
- ❌ Inconsistencia entre navegadores

**Después:**
- ✅ Todos los datos en base de datos
- ✅ Filtrado automático por usuario
- ✅ Seguridad garantizada
- ✅ Consistencia total

## 🚀 Orden de Implementación

1. **PRIMERO:** Actualizar schema y migrar DB
2. **SEGUNDO:** Corregir API de workouts
3. **TERCERO:** Actualizar dashboard
4. **CUARTO:** Actualizar admin Garmin
5. **QUINTO:** Probar exhaustivamente

# Análisis: Mapeo de Actividades Garmin con Usuarios

## 🔍 Problema Identificado

Existen **múltiples sistemas desconectados** para gestionar actividades de entrenamiento, lo que puede causar que las actividades se muestren incorrectamente o se mezclen entre usuarios.

## 📊 Estado Actual del Sistema

### 1. **Base de Datos (Prisma Schema)**

```prisma
model Workout {
  id          String      @id @default(cuid())
  userId      String      ✅ CORRECTO - Mapeo directo al usuario
  // ... otros campos
  user        User        @relation(fields: [userId], references: [id])
}
```

**Estado:** ✅ **CORRECTO** - La tabla `Workout` tiene una relación directa con `User` mediante `userId`.

### 2. **Admin Garmin Page** (`app/admin/garmin/page.tsx`)

**Problemas Identificados:**

❌ **PROBLEMA 1:** Usa `localStorage` para almacenar actividades Garmin por usuario
```typescript
saveGarminActivities(selectedUserId, updatedActivities)
```

❌ **PROBLEMA 2:** Las actividades se almacenan en el navegador, no en la base de datos
- Datos en: `localStorage['triclub_garmin_mock_data'][userId]`
- No persisten entre sesiones/navegadores
- No están en la base de datos real

❌ **PROBLEMA 3:** Mezcla datos de múltiples fuentes sin validación clara:
```typescript
// Carga de workouts reales
const userWorkouts = data.workouts.filter((w: any) => w.userId === userId)

// Combina con datos mock
const allActivities = [...garminActivities, ...storedActivities, ...mockActivities]
```

### 3. **Garmin Storage** (`lib/garmin-storage.ts`)

❌ **PROBLEMA CRÍTICO:** Todo se almacena en `localStorage` del navegador
```typescript
export function saveGarminActivities(userId: string, activities: GarminActivity[]): void {
  const existingData = getStoredGarminData()
  existingData[userId] = activities  // ❌ Solo en navegador
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData))
}
```

**Consecuencias:**
- Los datos no persisten en la base de datos
- Cada navegador tiene datos diferentes
- No hay sincronización entre admin y usuarios
- Los datos se pierden al limpiar el navegador

### 4. **API Routes**

#### `/api/workouts/recent/route.ts`
```typescript
const where: any = {}
if (userId) {
  where.userId = userId  // ✅ CORRECTO - Filtra por userId
}

const workouts = await prisma.workout.findMany({
  where,
  // ...
})
```

**Estado:** ✅ **CORRECTO** - Filtra correctamente por usuario

#### `/api/admin/workouts/route.ts`
```typescript
// POST - Crear workout
const workout = await prisma.workout.create({
  data: {
    userId,  // ✅ CORRECTO - Asigna al usuario correcto
    type,
    duration,
    // ...
  }
})
```

**Estado:** ✅ **CORRECTO** - Crea workouts con el userId correcto

### 5. **Dashboard Components**

#### `RecentWorkouts.tsx`
```typescript
const response = await fetch('/api/workouts/recent?limit=50')
```

**Estado:** ⚠️ **PARCIAL** - No filtra por usuario actual, muestra todos los workouts

#### `GarminStats.tsx`
```typescript
// Carga datos de múltiples fuentes
const dbWorkouts = await fetch('/api/workouts/recent?limit=50')
const garminWorkouts = getUserGarminActivities(userId)  // ❌ localStorage
```

**Estado:** ❌ **PROBLEMA** - Mezcla datos de DB y localStorage sin filtrar por usuario actual

#### `app/dashboard/workouts/page.tsx`
```typescript
const workouts = getUserGarminActivities('cmhabbtsv0000tmtguvd0b2lx')  // ❌ HARDCODED
```

**Estado:** ❌ **PROBLEMA CRÍTICO** - Usuario hardcodeado, siempre muestra datos del mismo usuario

## 🚨 Problemas Críticos Encontrados

### 1. **Datos No Persisten en Base de Datos**
- Las actividades Garmin se guardan en `localStorage`
- No hay sincronización con la tabla `Workout` de Prisma
- Los datos se pierden entre sesiones/navegadores

### 2. **Usuario Hardcodeado en Dashboard**
```typescript
// app/dashboard/workouts/page.tsx
const workouts = getUserGarminActivities('cmhabbtsv0000tmtguvd0b2lx')
```
Todos los usuarios ven las mismas actividades.

### 3. **Sin Filtro de Usuario en API**
```typescript
// RecentWorkouts.tsx
const response = await fetch('/api/workouts/recent?limit=50')
// ❌ No pasa userId, devuelve todos los workouts
```

### 4. **Mezcla de Fuentes de Datos**
- Base de datos (Prisma)
- localStorage (Garmin mock)
- Mock data hardcodeado
- Sin prioridad clara ni validación

## ✅ Soluciones Recomendadas

### Solución 1: **Guardar Actividades Garmin en Base de Datos**

**Modificar:** `app/admin/garmin/page.tsx`

Cuando el admin crea/edita una actividad Garmin:
1. Guardar en la tabla `Workout` con el `userId` correcto
2. Eliminar uso de `localStorage`
3. Usar la API `/api/admin/workouts` para persistir

```typescript
// En lugar de:
saveGarminActivities(selectedUserId, updatedActivities)

// Hacer:
await fetch('/api/admin/workouts', {
  method: 'POST',
  body: JSON.stringify({
    userId: selectedUserId,
    type: activity.type,
    duration: activity.duration,
    // ... otros campos
  })
})
```

### Solución 2: **Filtrar por Usuario Actual en Dashboard**

**Modificar:** `app/dashboard/workouts/page.tsx`

```typescript
// En lugar de:
const workouts = getUserGarminActivities('cmhabbtsv0000tmtguvd0b2lx')

// Hacer:
const { data: session } = useSession()
const [workouts, setWorkouts] = useState([])

useEffect(() => {
  if (session?.user?.email) {
    loadUserWorkouts()
  }
}, [session])

const loadUserWorkouts = async () => {
  const response = await fetch('/api/workouts/recent?limit=50')
  const data = await response.json()
  setWorkouts(data.workouts)
}
```

### Solución 3: **Filtrar por Usuario en API**

**Modificar:** `/api/workouts/recent/route.ts`

```typescript
// Obtener usuario de la sesión
const user = await prisma.user.findUnique({
  where: { email: session.user.email }
})

// Filtrar solo workouts del usuario actual
const workouts = await prisma.workout.findMany({
  where: {
    userId: user.id  // ✅ Solo workouts del usuario actual
  },
  orderBy: { date: 'desc' },
  take: limit
})
```

### Solución 4: **Eliminar localStorage de Garmin**

**Modificar:** `lib/garmin-storage.ts`

Eliminar o deprecar este archivo, ya que los datos deben estar en la base de datos.

## 📋 Plan de Implementación

### Fase 1: Corregir Dashboard (Prioridad Alta)
1. ✅ Filtrar workouts por usuario actual en `/api/workouts/recent`
2. ✅ Eliminar userId hardcodeado en `app/dashboard/workouts/page.tsx`
3. ✅ Usar sesión del usuario para cargar sus propios datos

### Fase 2: Migrar Admin Garmin a Base de Datos (Prioridad Alta)
1. ✅ Modificar `app/admin/garmin/page.tsx` para usar API en lugar de localStorage
2. ✅ Crear endpoint para cargar workouts de un usuario específico
3. ✅ Eliminar dependencia de `garmin-storage.ts`

### Fase 3: Limpieza (Prioridad Media)
1. ✅ Deprecar `lib/garmin-storage.ts`
2. ✅ Eliminar mock data hardcodeado
3. ✅ Documentar flujo de datos correcto

## 🔐 Validación de Seguridad

### Verificar que:
1. ✅ Un usuario solo puede ver sus propios workouts
2. ✅ El admin puede ver/editar workouts de cualquier usuario
3. ✅ Los workouts siempre tienen un `userId` válido
4. ✅ No hay fugas de datos entre usuarios

## 📝 Resumen

**Estado Actual:**
- ❌ Datos en localStorage (no persisten)
- ❌ Usuario hardcodeado en dashboard
- ❌ Sin filtro por usuario en algunas APIs
- ❌ Mezcla de fuentes de datos

**Estado Deseado:**
- ✅ Todos los workouts en base de datos
- ✅ Filtrado automático por usuario actual
- ✅ Admin puede gestionar workouts de cualquier usuario
- ✅ Una sola fuente de verdad (Prisma DB)

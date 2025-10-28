# 📊 Diagrama de Flujo: Sistema de Workouts Corregido

## 🔴 ANTES (Incorrecto)

```
┌─────────────────────────────────────────────────────────────┐
│                    PROBLEMA: USUARIO HARDCODEADO             │
└─────────────────────────────────────────────────────────────┘

Usuario A (juan@triclub.ar)
    │
    ├─> Login ✅
    │
    └─> Dashboard /workouts
            │
            └─> getUserGarminActivities('cmhabbtsv0000tmtguvd0b2lx')
                    │
                    └─> localStorage['triclub_garmin_mock_data']
                            │
                            └─> ❌ Datos del usuario hardcodeado
                                    (Siempre el mismo usuario)

Usuario B (maria@triclub.ar)
    │
    ├─> Login ✅
    │
    └─> Dashboard /workouts
            │
            └─> getUserGarminActivities('cmhabbtsv0000tmtguvd0b2lx')
                    │
                    └─> localStorage['triclub_garmin_mock_data']
                            │
                            └─> ❌ Datos del MISMO usuario hardcodeado
                                    (Usuario A y B ven lo mismo!)
```

## 🟢 DESPUÉS (Correcto)

```
┌─────────────────────────────────────────────────────────────┐
│              SOLUCIÓN: FILTRADO POR USUARIO ACTUAL           │
└─────────────────────────────────────────────────────────────┘

Usuario A (juan@triclub.ar)
    │
    ├─> Login ✅
    │   └─> Session: { email: 'juan@triclub.ar' }
    │
    └─> Dashboard /workouts
            │
            └─> fetch('/api/workouts/recent')
                    │
                    ├─> Obtiene usuario de sesión
                    │   └─> prisma.user.findUnique({ email: 'juan@triclub.ar' })
                    │       └─> userId: 'user_abc123'
                    │
                    └─> prisma.workout.findMany({
                            where: { userId: 'user_abc123' }  ✅
                        })
                            │
                            └─> ✅ Solo workouts de Usuario A
                                    [Workout1, Workout2, Workout3]

Usuario B (maria@triclub.ar)
    │
    ├─> Login ✅
    │   └─> Session: { email: 'maria@triclub.ar' }
    │
    └─> Dashboard /workouts
            │
            └─> fetch('/api/workouts/recent')
                    │
                    ├─> Obtiene usuario de sesión
                    │   └─> prisma.user.findUnique({ email: 'maria@triclub.ar' })
                    │       └─> userId: 'user_xyz789'
                    │
                    └─> prisma.workout.findMany({
                            where: { userId: 'user_xyz789' }  ✅
                        })
                            │
                            └─> ✅ Solo workouts de Usuario B
                                    [Workout4, Workout5, Workout6]
```

## 🔐 Capa de Seguridad

```
┌─────────────────────────────────────────────────────────────┐
│                    VALIDACIONES AGREGADAS                    │
└─────────────────────────────────────────────────────────────┘

Request → /api/workouts/recent
    │
    ├─> 1. ¿Tiene sesión?
    │       │
    │       ├─> NO → ❌ 401 Unauthorized
    │       └─> SÍ → Continuar
    │
    ├─> 2. ¿Usuario existe en DB?
    │       │
    │       ├─> NO → ❌ 404 Not Found
    │       └─> SÍ → Continuar
    │
    └─> 3. Filtrar por userId
            │
            └─> ✅ Solo devuelve workouts del usuario actual
```

## 📊 Flujo de Datos Completo

```
┌─────────────────────────────────────────────────────────────┐
│              ADMIN CREA WORKOUT PARA USUARIO                 │
└─────────────────────────────────────────────────────────────┘

Admin
    │
    └─> /admin/garmin
            │
            ├─> Selecciona Usuario B (userId: 'user_xyz789')
            │
            └─> Crea workout
                    │
                    └─> POST /api/admin/workouts
                            {
                              userId: 'user_xyz789',  ✅
                              type: 'RUNNING',
                              duration: 45,
                              ...
                            }
                                │
                                └─> prisma.workout.create({
                                        data: {
                                          userId: 'user_xyz789',  ✅
                                          ...
                                        }
                                    })
                                        │
                                        └─> ✅ Workout guardado en DB

Usuario B
    │
    └─> /dashboard/workouts
            │
            └─> fetch('/api/workouts/recent')
                    │
                    └─> WHERE userId = 'user_xyz789'
                            │
                            └─> ✅ Ve el workout que el admin creó
```

## 🗄️ Estructura de Base de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    TABLA: Workout                            │
└─────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ id           │ userId       │ title        │ type         │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ workout_001  │ user_abc123  │ Running 10k  │ RUNNING      │ ← Usuario A
│ workout_002  │ user_abc123  │ Cycling 45k  │ CYCLING      │ ← Usuario A
│ workout_003  │ user_xyz789  │ Swimming 2k  │ SWIMMING     │ ← Usuario B
│ workout_004  │ user_xyz789  │ Running 5k   │ RUNNING      │ ← Usuario B
│ workout_005  │ user_def456  │ Triathlon    │ TRIATHLON    │ ← Usuario C
└──────────────┴──────────────┴──────────────┴──────────────┘

Query de Usuario A:
SELECT * FROM Workout WHERE userId = 'user_abc123'
Resultado: workout_001, workout_002  ✅

Query de Usuario B:
SELECT * FROM Workout WHERE userId = 'user_xyz789'
Resultado: workout_003, workout_004  ✅

Query de Usuario C:
SELECT * FROM Workout WHERE userId = 'user_def456'
Resultado: workout_005  ✅
```

## 🎯 Puntos Clave

### ✅ Correcciones Implementadas

1. **Eliminado usuario hardcodeado**
   - Antes: `'cmhabbtsv0000tmtguvd0b2lx'`
   - Ahora: `session.user.email` → `currentUser.id`

2. **Filtrado automático en API**
   - Siempre filtra por `userId` del usuario actual
   - No es posible ver workouts de otros usuarios

3. **Datos en base de datos**
   - Antes: localStorage (temporal)
   - Ahora: PostgreSQL (permanente)

4. **Validación de seguridad**
   - Verifica sesión
   - Verifica usuario existe
   - Filtra automáticamente

### ⏳ Pendiente

1. **Admin Garmin**
   - Aún usa localStorage
   - Debe migrar a usar `/api/admin/workouts`

2. **Paginación**
   - Agregar límite y offset
   - Mejorar rendimiento con muchos workouts

3. **Filtros adicionales**
   - Por tipo de workout
   - Por rango de fechas
   - Por ubicación

---

**Conclusión:** El sistema ahora garantiza que cada usuario solo ve sus propios workouts, con validación de seguridad en cada paso.

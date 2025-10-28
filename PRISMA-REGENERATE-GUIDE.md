# 🔧 Guía: Regenerar Prisma Client

## ⚠️ Problema

Después de actualizar el schema de Prisma, el cliente de Prisma necesita ser regenerado para que los nuevos campos estén disponibles en TypeScript.

## 🛠️ Solución

### Paso 1: Detener el Servidor de Desarrollo

```bash
# Presiona Ctrl+C en la terminal donde corre el servidor
# O cierra la terminal
```

### Paso 2: Regenerar Prisma Client

```bash
npx prisma generate
```

Si hay errores de permisos (EPERM), intenta:

```bash
# Opción 1: Eliminar y regenerar
Remove-Item -Recurse -Force node_modules\.prisma\client
npx prisma generate

# Opción 2: Reiniciar y regenerar
# Cierra todas las terminales y VSCode
# Abre de nuevo y ejecuta:
npx prisma generate
```

### Paso 3: Verificar Schema Sincronizado

```bash
npx prisma db push
```

### Paso 4: Reiniciar Servidor

```bash
npm run dev
```

## 📊 Campos Nuevos en Workout

Después de regenerar, estos campos estarán disponibles:

```typescript
model Workout {
  // ... campos existentes
  avgHeartRate  Int?        // ✅ Nuevo
  maxHeartRate  Int?        // ✅ Nuevo
  pace          String?     // ✅ Nuevo
  notes         String?     // ✅ Nuevo
  date          DateTime    // ✅ Nuevo
  source        String      // ✅ Nuevo
}
```

## 🔄 Workaround Temporal

Mientras tanto, el código usa type casting para acceder a los nuevos campos:

```typescript
// Temporal - hasta regenerar Prisma
avgHeartRate: (workout as any).avgHeartRate || workout.heartRate
```

## ✅ Verificar que Funciona

1. Crear un workout desde el admin
2. Verificar que se guarda correctamente
3. Ver el workout en el dashboard del usuario

## 📝 Nota

El workaround actual permite que el sistema funcione mientras se regenera Prisma. Una vez regenerado, el código funcionará con tipos completos.

---

**Estado Actual:** Workaround implementado, funcional
**Próximo Paso:** Regenerar Prisma cuando el servidor esté detenido

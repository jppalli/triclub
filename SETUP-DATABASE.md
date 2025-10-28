# 🗄️ Configuración de Base de Datos - TriClub Argentina

## 🚀 Opción 1: Supabase (Recomendado)

### Paso 1: Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Clic en "New Project"
4. Completa:
   - **Name**: `triclub-argentina`
   - **Database Password**: (genera una segura)
   - **Region**: `South America (São Paulo)`

### Paso 2: Obtener la URL de conexión
1. En tu proyecto, ve a **Settings** → **Database**
2. Copia la **Connection string** en modo **URI**
3. Reemplaza `[YOUR-PASSWORD]` con tu contraseña

### Paso 3: Configurar variables de entorno
1. Abre `.env.local`
2. Reemplaza la línea `DATABASE_URL` con tu URL de Supabase:
```
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres"
```

### Paso 4: Ejecutar migraciones
```bash
npm run db:push
npm run db:seed
```

## 🐳 Opción 2: PostgreSQL Local con Docker

### Requisitos
- Docker Desktop instalado

### Comandos
```bash
# Iniciar PostgreSQL
docker-compose up -d

# Ejecutar migraciones
npm run db:push
npm run db:seed

# Ver base de datos
npm run db:studio
```

## 🛠️ Comandos Útiles

```bash
# Generar cliente Prisma
npm run db:generate

# Crear migración
npm run db:migrate

# Sincronizar schema (desarrollo)
npm run db:push

# Poblar con datos demo
npm run db:seed

# Abrir Prisma Studio
npm run db:studio

# Resetear base de datos
npm run db:reset
```

## 📊 Datos Demo

Después de ejecutar `npm run db:seed`:

**Usuario Demo:**
- Email: `atleta@triclub.ar`
- Password: `triclub123`
- Puntos: 2,850
- Entrenamientos: 3 ejemplos
- Historial de puntos

## ✅ Verificación

1. Ejecuta `npm run db:studio`
2. Verifica que las tablas estén creadas
3. Confirma que el usuario demo existe
4. Prueba el login en la aplicación

## 🚨 Troubleshooting

**Error de conexión:**
- Verifica que la URL de la base de datos sea correcta
- Asegúrate que Supabase esté activo
- Revisa que la contraseña no tenga caracteres especiales

**Error de migración:**
- Ejecuta `npm run db:generate` primero
- Luego `npm run db:push`

**Usuario demo no funciona:**
- Ejecuta `npm run db:seed` nuevamente
- Verifica en Prisma Studio que el usuario existe
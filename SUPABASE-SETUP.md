# 🗄️ Configuración de Supabase - TriClub Argentina

## 📋 **Datos de tu proyecto:**
- **URL**: https://pmmjphffwqnqrrjwdizz.supabase.co
- **Project ID**: pmmjphffwqnqrrjwdizz
- **API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## 🔧 **Pasos para completar la configuración:**

### **Paso 1: Obtener la contraseña de la base de datos**
1. Ve a tu proyecto Supabase: https://pmmjphffwqnqrrjwdizz.supabase.co
2. Ve a **Settings** → **Database**
3. En la sección **Connection string**, copia la **URI**
4. Debería verse así:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.pmmjphffwqnqrrjwdizz.supabase.co:5432/postgres
   ```

### **Paso 2: Actualizar .env.local**
1. Abre el archivo `.env.local`
2. Reemplaza la línea `DATABASE_URL` con tu URL completa:
   ```
   DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.pmmjphffwqnqrrjwdizz.supabase.co:5432/postgres"
   ```

### **Paso 3: Ejecutar la configuración**
```bash
# Sincronizar el schema con Supabase
npm run db:push

# Poblar con datos demo
npm run db:seed

# Verificar que todo funcione
npm run db:studio
```

## ✅ **Verificación**

Después de ejecutar los comandos:

1. **Prisma Studio** se abrirá en http://localhost:5555
2. Deberías ver todas las tablas creadas
3. El usuario demo `atleta@triclub.ar` debería existir
4. Deberías ver entrenamientos y puntos de ejemplo

## 🚨 **Si tienes problemas:**

**Error de conexión:**
- Verifica que la contraseña sea correcta
- Asegúrate de no tener caracteres especiales sin escapar
- Prueba la conexión desde Supabase Dashboard

**Error de permisos:**
- Ve a **Settings** → **API** en Supabase
- Verifica que RLS (Row Level Security) esté configurado correctamente

## 🎯 **Una vez configurado:**

Podremos:
- ✅ **Login real** con base de datos
- ✅ **Registro de usuarios** funcional
- ✅ **Sistema de puntos** persistente
- ✅ **Entrenamientos** guardados en DB
- ✅ **Dashboard** con datos reales

---

**¿Necesitas ayuda con algún paso?** ¡Avísame cuando tengas la DATABASE_URL lista!
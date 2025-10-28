# Despliegue en Vercel con Supabase

## Pasos para Desplegar

### 1. Preparar el Repositorio Git

Si aún no tienes un repositorio Git:

```bash
git init
git add .
git commit -m "Initial commit"
```

Sube tu código a GitHub, GitLab o Bitbucket:

```bash
# Crear repositorio en GitHub primero, luego:
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### 2. Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con tu cuenta de GitHub (recomendado)
3. Autoriza a Vercel para acceder a tus repositorios

### 3. Importar Proyecto

1. Click en "Add New..." → "Project"
2. Selecciona tu repositorio
3. Vercel detectará automáticamente que es Next.js

### 4. Configurar Variables de Entorno

En la sección "Environment Variables", agrega estas variables (copia de tu .env.local):

**IMPORTANTE: No incluyas comillas en los valores**

```
DATABASE_URL=postgresql://postgres:bocaboca@db.pmmjphffwqnqrrjwdizz.supabase.co:5432/postgres

NEXT_PUBLIC_SUPABASE_URL=https://pmmjphffwqnqrrjwdizz.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtbWpwaGZmd3FucXJyandkaXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTg3NDMsImV4cCI6MjA3NzE3NDc0M30.55UMetRM_i8UR9BGaNRX3sJJnsrG2WdRPANd3R3Weh0

NEXTAUTH_SECRET=triclub-secret-key-2024-super-secure-random-string

NEXTAUTH_URL=https://tu-proyecto.vercel.app
```

**Nota:** Actualiza `NEXTAUTH_URL` después del primer despliegue con tu URL real de Vercel.

### 5. Configuración de Build

Vercel debería detectar automáticamente:
- Framework Preset: Next.js
- Build Command: `prisma generate && next build` (ya configurado en vercel.json)
- Output Directory: `.next`
- Install Command: `npm install`

### 6. Desplegar

1. Click en "Deploy"
2. Espera 2-3 minutos mientras Vercel construye tu app
3. Una vez completado, obtendrás una URL como: `https://tu-proyecto.vercel.app`

### 7. Actualizar NEXTAUTH_URL

1. Copia tu URL de Vercel
2. Ve a Settings → Environment Variables
3. Edita `NEXTAUTH_URL` con tu URL real
4. Redeploy desde la pestaña "Deployments" → "..." → "Redeploy"

### 8. Configurar Dominio Personalizado (Opcional)

1. Ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

## Actualizaciones Futuras

Cada vez que hagas push a tu rama principal:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

Vercel automáticamente desplegará los cambios.

## Comandos Útiles

### Ver logs en tiempo real
```bash
npx vercel logs
```

### Desplegar desde CLI (opcional)
```bash
npm i -g vercel
vercel login
vercel
```

## Solución de Problemas

### Error de Build con Prisma
Si falla el build, asegúrate de que `vercel.json` incluya `prisma generate`:
```json
{
  "buildCommand": "prisma generate && next build"
}
```

### Error de Conexión a Base de Datos
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que Supabase permita conexiones desde cualquier IP (0.0.0.0/0)

### Error de NextAuth
- Verifica que `NEXTAUTH_URL` coincida con tu URL de Vercel
- Asegúrate de que `NEXTAUTH_SECRET` esté configurado

### Prisma Client no generado
Agrega este script en package.json si no existe:
```json
"postinstall": "prisma generate"
```

## Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Supabase con Vercel](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

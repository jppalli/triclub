# Sistema de Invitaciones TriClub

## 🎯 Descripción

Sistema completo de invitaciones por códigos para registro exclusivo de usuarios. Solo los usuarios con códigos válidos pueden registrarse en la plataforma.

## ✨ Características

### **Para Usuarios Existentes:**
- ✅ Crear códigos de invitación personalizados
- ✅ Configurar expiración y límite de usos
- ✅ Mensajes personalizados para invitados
- ✅ Ganar 200 puntos por cada registro exitoso
- ✅ Estadísticas detalladas de invitaciones
- ✅ Compartir códigos y links de registro

### **Para Nuevos Usuarios:**
- ✅ Registro solo con código de invitación válido
- ✅ Validación en tiempo real del código
- ✅ 100 puntos de bienvenida automáticos
- ✅ Asignación automática al club del invitador
- ✅ Generación de código propio para invitar

## 🚀 Cómo Usar

### **1. Códigos de Demo Disponibles**

```
TRICLUB2024 - Código general (5 usos, expira 27/11/2025)
ELITE123    - Para atletas elite (3 usos, expira 12/11/2025)  
GARMIN456   - Para usuarios Garmin (10 usos, expira 27/12/2025)
BUENOS789   - Para Buenos Aires (1 uso, expira 4/11/2025)
```

### **2. Proceso de Registro**

1. **Ir a `/registro`**
2. **Ingresar código de invitación**
   - Usar cualquiera de los códigos de demo
   - El sistema valida en tiempo real
3. **Completar datos personales**
   - Nombre, apellido, email, contraseña
   - Teléfono y ciudad (opcionales)
4. **¡Listo!** - Usuario creado con 100 puntos

### **3. Crear Invitaciones (Dashboard)**

1. **Ir a `/dashboard/invitations`**
2. **Hacer clic en "Nueva Invitación"**
3. **Configurar:**
   - Mensaje personalizado
   - Días de expiración (7, 15, 30, 60)
   - Máximo de usos (1, 3, 5, 10)
4. **El código se copia automáticamente**

## 🛠️ APIs Disponibles

### **Validar Código**
```bash
POST /api/validate-invite
{
  "code": "TRICLUB2024"
}
```

### **Registrar Usuario**
```bash
POST /api/register
{
  "inviteCode": "TRICLUB2024",
  "email": "nuevo@usuario.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+54911234567",
  "city": "Buenos Aires"
}
```

## 📊 Base de Datos

### **Tabla `Invitation`**
- `code` - Código único de 8 caracteres
- `senderId` - Usuario que creó la invitación
- `receiverId` - Usuario que usó el código (nullable)
- `status` - PENDING, USED, EXPIRED, CANCELLED
- `maxUses` - Máximo número de usos
- `currentUses` - Usos actuales
- `expiresAt` - Fecha de expiración
- `message` - Mensaje personalizado

### **Campos en `User`**
- `inviteCode` - Código propio para invitar
- `invitedBy` - ID del usuario que lo invitó

## 🎁 Sistema de Puntos

### **Invitador (200 puntos)**
- Se otorgan automáticamente al completarse un registro
- Se registra en `PointsHistory` con tipo `INVITE`

### **Nuevo Usuario (100 puntos)**
- Puntos de bienvenida automáticos
- Se registra en `PointsHistory` con tipo `BONUS`

## 🧪 Testing

### **Verificar Sistema**
```bash
npx tsx scripts/test-registration.ts
```

### **Crear Códigos de Demo**
```bash
npx tsx scripts/seed-invitations.ts
```

### **Poblar Productos**
```bash
npx tsx scripts/seed-official-products.ts
```

## 🔧 Configuración Técnica

### **Dependencias**
- Prisma (ORM)
- bcryptjs (Hash de contraseñas)
- NextAuth.js (Autenticación)
- tRPC (API type-safe)

### **Archivos Principales**
```
📁 server/api/routers/
  └── invitations.ts          # Router tRPC completo
📁 app/api/
  ├── register/route.ts       # API REST para registro
  └── validate-invite/route.ts # API REST para validación
📁 app/
  ├── registro/page.tsx       # Página de registro
  └── dashboard/invitations/  # Gestión de invitaciones
📁 scripts/
  ├── seed-invitations.ts     # Crear códigos demo
  └── test-registration.ts    # Verificar sistema
```

## 🎯 Próximas Mejoras

- [ ] **Email de invitación** - Envío automático por email
- [ ] **QR Codes** - Generar QR para compartir fácilmente
- [ ] **Analytics** - Métricas avanzadas de conversión
- [ ] **Invitaciones masivas** - Crear múltiples códigos
- [ ] **Templates** - Plantillas de mensajes predefinidas
- [ ] **Notificaciones** - Alertas cuando alguien usa tu código

## 🚀 Estado Actual

✅ **Sistema Completamente Funcional**
- Registro con códigos ✅
- Validación en tiempo real ✅
- Gestión desde dashboard ✅
- Sistema de puntos ✅
- APIs REST y tRPC ✅
- Base de datos configurada ✅

¡El sistema está listo para usar! 🎉
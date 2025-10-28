import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Crear instancia directa de Prisma para evitar problemas de importación
const prisma = new PrismaClient()

// Función para generar código de invitación único
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: Request) {
  try {
    console.log('🔍 API called, checking prisma...')
    console.log('🔍 Prisma available:', !!prisma)
    
    const body = await request.json()
    const { inviteCode, email, password, firstName, lastName, phone, city } = body

    console.log('🔐 Registration attempt with invite code:', inviteCode)
    console.log('🔐 Request data:', { email, firstName, lastName, phone, city })

    // Validar campos requeridos
    if (!inviteCode || !email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben ser completados' },
        { status: 400 }
      )
    }

    // Verificar que el email no esté en uso
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    // Validar código de invitación
    const invitation = await prisma.invitation.findUnique({
      where: { code: inviteCode },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            club: true
          }
        }
      }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Código de invitación no válido' },
        { status: 404 }
      )
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'El código de invitación ha expirado' },
        { status: 400 }
      )
    }

    // PERMITIR REUTILIZACIÓN: Los códigos pueden ser usados múltiples veces
    // Solo verificamos que no esté expirado (ya verificado arriba)
    console.log('✅ Invitation is reusable, current uses:', invitation.currentUses)

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generar código de invitación para el nuevo usuario
    let newUserInviteCode: string
    let attempts = 0
    do {
      newUserInviteCode = generateInviteCode()
      const existing = await prisma.invitation.findUnique({
        where: { code: newUserInviteCode }
      })
      if (!existing) {
        const existingUser = await prisma.user.findUnique({
          where: { inviteCode: newUserInviteCode }
        })
        if (!existingUser) break
      }
      attempts++
    } while (attempts < 10)

    console.log('✅ Creating user with invite code:', newUserInviteCode)

    // Crear usuario en transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear usuario
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
          firstName,
          lastName,
          phone,
          city,
          club: invitation.sender.club || 'TriClub Argentina',
          inviteCode: newUserInviteCode,
          invitedBy: invitation.senderId,
          points: 100, // Puntos de bienvenida
          level: 'BEGINNER'
        }
      })

      // Actualizar invitación (incrementar contador pero mantener activa)
      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          currentUses: invitation.currentUses + 1,
          usedAt: new Date()
          // No cambiar status ni receiverId para permitir reutilización
        }
      })

      // Dar puntos al invitador
      await tx.user.update({
        where: { id: invitation.senderId },
        data: {
          points: {
            increment: 200 // Puntos por invitar
          }
        }
      })

      // Crear registro de puntos para el invitador
      await tx.pointsHistory.create({
        data: {
          userId: invitation.senderId,
          points: 200,
          type: 'INVITE',
          description: `Invitación exitosa de ${firstName} ${lastName}`,
          reference: newUser.id
        }
      })

      // Crear registro de puntos de bienvenida
      await tx.pointsHistory.create({
        data: {
          userId: newUser.id,
          points: 100,
          type: 'BONUS',
          description: 'Puntos de bienvenida',
          reference: invitation.id
        }
      })

      return newUser
    })

    console.log('🎉 User created successfully:', result.email)

    return NextResponse.json({
      success: true,
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        club: result.club,
        points: result.points,
        inviteCode: result.inviteCode
      },
      message: 'Usuario registrado exitosamente'
    })

  } catch (error) {
    console.error('❌ Registration error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
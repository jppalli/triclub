import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Código de invitación requerido' },
        { status: 400 }
      )
    }

    console.log('🔍 Validating invitation code:', code)

    // Buscar la invitación por código
    const invitation = await prisma.invitation.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        sender: {
          select: {
            name: true,
            club: true
          }
        }
      }
    })

    if (!invitation) {
      console.log('❌ Invitation not found:', code)
      return NextResponse.json(
        { valid: false, error: 'Código de invitación no válido' },
        { status: 404 }
      )
    }

    // Verificar si la invitación ha expirado
    if (invitation.expiresAt < new Date()) {
      console.log('❌ Invitation expired:', code)
      return NextResponse.json(
        { valid: false, error: 'El código de invitación ha expirado' },
        { status: 400 }
      )
    }

    // PERMITIR REUTILIZACIÓN: No verificar límites de uso
    // Los códigos pueden ser reutilizados indefinidamente
    console.log('✅ Invitation valid and reusable:', code)

    return NextResponse.json({
      valid: true,
      invitation: {
        id: invitation.id,
        code: invitation.code,
        senderName: invitation.sender.name,
        senderClub: invitation.sender.club,
        message: invitation.message,
        expiresAt: invitation.expiresAt,
        currentUses: invitation.currentUses,
        maxUses: invitation.maxUses
      },
      message: 'Código válido y disponible para uso'
    })

  } catch (error) {
    console.error('❌ Error validating invitation:', error)
    return NextResponse.json(
      { valid: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
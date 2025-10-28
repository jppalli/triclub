import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const workoutId = params.id

    console.log('🗑️ Admin API: Deleting workout:', workoutId)

    // Buscar el entrenamiento
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId }
    })

    if (!workout) {
      return NextResponse.json(
        { error: 'Entrenamiento no encontrado' },
        { status: 404 }
      )
    }

    // Buscar el registro de puntos asociado para revertir
    const pointsRecord = await prisma.pointsHistory.findFirst({
      where: {
        reference: workoutId,
        type: 'WORKOUT'
      }
    })

    // Eliminar en transacción
    await prisma.$transaction(async (tx) => {
      // Eliminar el entrenamiento
      await tx.workout.delete({
        where: { id: workoutId }
      })

      // Revertir puntos si existe el registro
      if (pointsRecord) {
        await tx.user.update({
          where: { id: workout.userId },
          data: {
            points: {
              decrement: pointsRecord.points
            }
          }
        })

        // Eliminar el registro de puntos
        await tx.pointsHistory.delete({
          where: { id: pointsRecord.id }
        })
      }
    })

    console.log(`✅ Workout deleted successfully, reverted ${pointsRecord?.points || 0} points`)

    return NextResponse.json({
      success: true,
      message: 'Entrenamiento eliminado exitosamente',
      pointsReverted: pointsRecord?.points || 0
    })

  } catch (error) {
    console.error('❌ Error deleting workout:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
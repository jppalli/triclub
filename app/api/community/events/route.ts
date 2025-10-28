import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const upcoming = searchParams.get('upcoming') === 'true'

    console.log('🎯 Community events API called')

    const where: any = {}
    
    if (upcoming) {
      where.date = {
        gte: new Date()
      }
    }

    const events = await prisma.communityEvent.findMany({
      where,
      orderBy: { date: 'asc' },
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: {
            participants: true
          }
        }
      }
    })

    console.log(`✅ Found ${events.length} community events`)

    return NextResponse.json({
      events: events.map(event => ({
        ...event,
        participantsCount: event._count.participants
      }))
    })
  } catch (error) {
    console.error('❌ Error in community events API:', error)
    return NextResponse.json(
      { error: 'Error fetching events' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, description, date, location, eventType, maxParticipants } = body

    console.log('🎯 Creating new community event:', { title, eventType })

    const event = await prisma.communityEvent.create({
      data: {
        organizerId: user.id,
        title,
        description,
        date: new Date(date),
        location,
        eventType: eventType.toUpperCase(),
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        }
      }
    })

    console.log('✅ Event created successfully:', event.id)

    return NextResponse.json({
      success: true,
      event: {
        ...event,
        participantsCount: event._count.participants
      }
    })

  } catch (error) {
    console.error('❌ Error creating event:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
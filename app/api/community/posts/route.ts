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

    console.log('📱 Community posts API called')

    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        author: {
          select: {
            name: true,
            club: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    console.log(`✅ Found ${posts.length} community posts`)

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        likeCount: post._count.likes,
        commentCount: post._count.comments
      }))
    })
  } catch (error) {
    console.error('❌ Error in community posts API:', error)
    return NextResponse.json(
      { error: 'Error fetching posts' },
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
    const { content, type, images } = body

    console.log('📝 Creating new community post:', { content: content.substring(0, 50), type })

    const post = await prisma.communityPost.create({
      data: {
        authorId: user.id,
        content,
        type: type || 'GENERAL',
        images: images || []
      },
      include: {
        author: {
          select: {
            name: true,
            club: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    console.log('✅ Post created successfully:', post.id)

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        likeCount: post._count.likes,
        commentCount: post._count.comments
      }
    })

  } catch (error) {
    console.error('❌ Error creating post:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
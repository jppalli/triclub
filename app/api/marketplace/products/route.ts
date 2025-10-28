import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const condition = searchParams.get('condition')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('🔍 Marketplace API called with params:', { category, search, condition, minPrice, maxPrice, sortBy })

    // Construir filtros
    const where: any = {
      isActive: true,
      isSold: false
    }

    if (category && category !== 'todos') {
      where.category = category.toUpperCase()
    }

    if (condition && condition !== 'todos') {
      where.condition = condition.toUpperCase()
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseInt(minPrice) * 100 } // convertir a centavos
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseInt(maxPrice) * 100 } // convertir a centavos
    }

    // Construir ordenamiento
    let orderBy: any = {}
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    console.log('🔍 Querying with where:', where)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          seller: {
            select: {
              name: true,
              club: true,
              image: true
            }
          },
          _count: {
            select: { reviews: true }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    console.log(`✅ Found ${products.length} products, total: ${total}`)

    const result = {
      products: products.map(product => ({
        ...product,
        price: product.price / 100, // convertir de centavos a pesos
        reviewCount: product._count.reviews
      })),
      total,
      hasMore: offset + limit < total
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Error in marketplace API:', error)
    return NextResponse.json(
      { error: 'Error fetching products' },
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
    const { title, description, price, condition, category, images, location } = body

    console.log('📦 Creating new product:', { title, price, condition, category })

    // Validar campos requeridos
    if (!title || !description || !price || !condition || !category) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben ser completados' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        sellerId: user.id,
        title,
        description,
        price: Math.round(price * 100), // convertir a centavos
        condition: condition.toUpperCase(),
        category: category.toUpperCase(),
        images: images || [],
        location
      },
      include: {
        seller: {
          select: {
            name: true,
            club: true,
            image: true
          }
        }
      }
    })

    console.log('✅ Product created successfully:', product.id)

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        price: product.price / 100 // convertir de centavos a pesos
      },
      message: 'Producto creado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error creating product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
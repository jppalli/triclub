import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'featured'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('🔍 API route called with params:', { category, search, sortBy, limit, offset })

    // Construir filtros
    const where: any = {
      isActive: true
    }

    if (category && category !== 'todos') {
      where.category = category.toUpperCase().replace('-', '_')
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Construir ordenamiento
    let orderBy: any = {}
    switch (sortBy) {
      case 'price-low':
        orderBy = { currentPrice: 'asc' }
        break
      case 'price-high':
        orderBy = { currentPrice: 'desc' }
        break
      case 'points-low':
        orderBy = { pointsRequired: 'asc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'featured':
      default:
        orderBy = [
          { isFeatured: 'desc' },
          { isExclusive: 'desc' },
          { rating: 'desc' }
        ]
        break
    }

    console.log('🔍 Querying with where:', where)

    const [products, total] = await Promise.all([
      prisma.officialProduct.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: { reviews: true }
          }
        }
      }),
      prisma.officialProduct.count({ where })
    ])

    console.log(`✅ Found ${products.length} products, total: ${total}`)

    const result = {
      products: products.map(product => ({
        ...product,
        reviewCount: product._count.reviews
      })),
      total,
      hasMore: offset + limit < total
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Error in products API:', error)
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    )
  }
}
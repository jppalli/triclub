import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/lib/trpc'
import { TRPCError } from '@trpc/server'

export const storeRouter = createTRPCRouter({
  // Test endpoint
  test: publicProcedure
    .query(async ({ ctx }) => {
      console.log('🧪 Test endpoint called')
      console.log('🧪 Context available:', !!ctx)
      console.log('🧪 Prisma available:', !!ctx?.prisma)
      
      if (!ctx || !ctx.prisma) {
        return { error: 'No context or prisma available' }
      }
      
      try {
        const count = await ctx.prisma.officialProduct.count()
        return { success: true, productCount: count }
      } catch (error) {
        console.error('🧪 Test error:', error)
        return { error: 'Database error', details: error }
      }
    }),

  // Obtener productos oficiales con filtros
  getProducts: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      sortBy: z.enum(['featured', 'price-low', 'price-high', 'points-low', 'rating']).default('featured'),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ ctx, input }) => {
      console.log('🔍 getProducts called with input:', input)
      console.log('🔍 Context available:', !!ctx)
      console.log('🔍 Prisma available:', !!ctx?.prisma)
      
      if (!ctx || !ctx.prisma) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection not available'
        })
      }

      const { category, search, sortBy, limit, offset } = input

      try {
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
        console.log('🔍 Querying with orderBy:', orderBy)

        const [products, total] = await Promise.all([
          ctx.prisma.officialProduct.findMany({
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
          ctx.prisma.officialProduct.count({ where })
        ])

        console.log(`✅ Found ${products.length} products, total: ${total}`)

        return {
          products: products.map((product: any) => ({
            ...product,
            reviewCount: product._count.reviews
          })),
          total,
          hasMore: offset + limit < total
        }
      } catch (error) {
        console.error('❌ Error in getProducts:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error fetching products'
        })
      }
    }),

  // Obtener producto por ID
  getProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.officialProduct.findUnique({
        where: { id: input.id },
        include: {
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: { reviews: true }
          }
        }
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Producto no encontrado'
        })
      }

      return {
        ...product,
        reviewCount: product._count.reviews
      }
    }),

  // Agregar al carrito
  addToCart: protectedProcedure
    .input(z.object({
      productId: z.string(),
      quantity: z.number().min(1).max(10).default(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const { productId, quantity } = input
      const userId = ctx.session.user.id

      // Verificar que el producto existe y está disponible
      const product = await ctx.prisma.officialProduct.findUnique({
        where: { id: productId }
      })

      if (!product || !product.isActive) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Producto no encontrado o no disponible'
        })
      }

      if (product.stock < quantity) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Stock insuficiente'
        })
      }

      // Verificar si ya existe en el carrito
      const existingItem = await ctx.prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      })

      if (existingItem) {
        // Actualizar cantidad
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > product.stock) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No hay suficiente stock para esta cantidad'
          })
        }

        const updated = await ctx.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
          include: {
            product: true
          }
        })

        return { cartItem: updated, message: 'Cantidad actualizada en el carrito' }
      } else {
        // Crear nuevo item
        const cartItem = await ctx.prisma.cartItem.create({
          data: {
            userId,
            productId,
            quantity
          },
          include: {
            product: true
          }
        })

        return { cartItem, message: 'Producto agregado al carrito' }
      }
    }),

  // Obtener carrito del usuario
  getCart: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const cartItems = await ctx.prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: true
        },
        orderBy: { createdAt: 'desc' }
      })

      // Calcular totales
      let subtotal = 0
      let totalPointsRequired = 0
      let totalPointsDiscount = 0

      cartItems.forEach(item => {
        const itemTotal = item.product.currentPrice * item.quantity
        subtotal += itemTotal
        totalPointsRequired += item.product.pointsRequired * item.quantity
        totalPointsDiscount += item.product.pointsDiscount * item.quantity
      })

      return {
        items: cartItems,
        summary: {
          itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal,
          totalPointsRequired,
          totalPointsDiscount,
          total: subtotal - (totalPointsDiscount * 100) // Asumiendo 1 punto = $1
        }
      }
    }),

  // Actualizar cantidad en carrito
  updateCartItem: protectedProcedure
    .input(z.object({
      itemId: z.string(),
      quantity: z.number().min(0).max(10)
    }))
    .mutation(async ({ ctx, input }) => {
      const { itemId, quantity } = input
      const userId = ctx.session.user.id

      const cartItem = await ctx.prisma.cartItem.findFirst({
        where: {
          id: itemId,
          userId
        },
        include: { product: true }
      })

      if (!cartItem) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Item no encontrado en el carrito'
        })
      }

      if (quantity === 0) {
        // Eliminar del carrito
        await ctx.prisma.cartItem.delete({
          where: { id: itemId }
        })
        return { message: 'Producto eliminado del carrito' }
      }

      if (quantity > cartItem.product.stock) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Stock insuficiente'
        })
      }

      const updated = await ctx.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: { product: true }
      })

      return { cartItem: updated, message: 'Carrito actualizado' }
    }),

  // Limpiar carrito
  clearCart: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id

      await ctx.prisma.cartItem.deleteMany({
        where: { userId }
      })

      return { message: 'Carrito limpiado' }
    }),

  // Crear orden
  createOrder: protectedProcedure
    .input(z.object({
      shippingAddress: z.object({
        fullName: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        phone: z.string()
      }),
      paymentMethod: z.string(),
      usePoints: z.boolean().default(true)
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { shippingAddress, paymentMethod, usePoints } = input

      // Obtener carrito
      const cartItems = await ctx.prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
      })

      if (cartItems.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El carrito está vacío'
        })
      }

      // Obtener puntos del usuario
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { points: true }
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado'
        })
      }

      // Calcular totales
      let totalAmount = 0
      let totalPointsRequired = 0
      let totalPointsDiscount = 0

      for (const item of cartItems) {
        totalAmount += item.product.currentPrice * item.quantity
        totalPointsRequired += item.product.pointsRequired * item.quantity
        totalPointsDiscount += item.product.pointsDiscount * item.quantity
      }

      // Verificar puntos si se van a usar
      if (usePoints && user.points < totalPointsRequired) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Puntos insuficientes. Necesitas ${totalPointsRequired} puntos pero solo tienes ${user.points}`
        })
      }

      // Generar número de orden
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      // Crear orden en transacción
      const order = await ctx.prisma.$transaction(async (tx) => {
        // Crear orden
        const newOrder = await tx.officialOrder.create({
          data: {
            userId,
            orderNumber,
            totalAmount: usePoints ? totalAmount - (totalPointsDiscount * 100) : totalAmount,
            pointsUsed: usePoints ? totalPointsRequired : 0,
            pointsDiscount: usePoints ? totalPointsDiscount * 100 : 0,
            paymentMethod,
            shippingAddress,
            status: 'PAYMENT_PENDING'
          }
        })

        // Crear items de la orden
        for (const item of cartItems) {
          await tx.officialOrderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.currentPrice,
              pointsUsed: usePoints ? item.product.pointsRequired * item.quantity : 0,
              pointsDiscount: usePoints ? item.product.pointsDiscount * item.quantity * 100 : 0
            }
          })

          // Reducir stock
          await tx.officialProduct.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          })
        }

        // Descontar puntos si se usaron
        if (usePoints) {
          await tx.user.update({
            where: { id: userId },
            data: {
              points: {
                decrement: totalPointsRequired
              }
            }
          })
        }

        // Limpiar carrito
        await tx.cartItem.deleteMany({
          where: { userId }
        })

        return newOrder
      })

      return {
        order,
        message: 'Orden creada exitosamente'
      }
    }),

  // Obtener órdenes del usuario
  getUserOrders: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { limit, offset } = input

      const [orders, total] = await Promise.all([
        ctx.prisma.officialOrder.findMany({
          where: { userId },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: true,
                    brand: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset
        }),
        ctx.prisma.officialOrder.count({
          where: { userId }
        })
      ])

      return {
        orders,
        total,
        hasMore: offset + limit < total
      }
    })
})
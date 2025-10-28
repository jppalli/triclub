'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, ShoppingCart, Minus, Plus, Trash2, Zap } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { data: cartData, isLoading } = trpc.store.getCart.useQuery()
  const utils = trpc.useUtils()
  const updateCartMutation = trpc.store.updateCartItem.useMutation({
    onSuccess: () => {
      utils.store.getCart.invalidate()
    }
  })

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS'
    })
  }

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartMutation.mutateAsync({ itemId, quantity })
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    await handleUpdateQuantity(itemId, 0)
  }

  if (isLoading) {
    return null
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-slate-900 shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="h-6 w-6 text-primary-500" />
                        <h2 className="text-lg font-semibold text-white">
                          Carrito ({cartData?.summary.itemCount || 0})
                        </h2>
                      </div>
                      <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      {!cartData?.items.length ? (
                        <div className="text-center py-12">
                          <ShoppingCart className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">Tu carrito está vacío</h3>
                          <p className="text-slate-400">Agrega productos para comenzar tu compra</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cartData.items.map((item) => (
                            <div key={item.id} className="bg-slate-800/50 rounded-xl p-4">
                              <div className="flex items-start gap-4">
                                {/* Product Image */}
                                <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                  {item.product.images.length > 0 ? (
                                    <img 
                                      src={item.product.images[0]} 
                                      alt={item.product.name}
                                      className="w-full h-full object-cover rounded-lg"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                        e.currentTarget.nextElementSibling!.style.display = 'flex'
                                      }}
                                    />
                                  ) : null}
                                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                    IMG
                                  </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-white font-medium text-sm mb-1 truncate">
                                    {item.product.name}
                                  </h4>
                                  <p className="text-slate-400 text-xs mb-2">{item.product.brand}</p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="text-white font-semibold">
                                      {formatPrice(item.product.currentPrice)}
                                    </div>
                                    <div className="flex items-center gap-1 text-accent-500 text-xs">
                                      <Zap className="h-3 w-3" />
                                      <span>{item.product.pointsRequired}</span>
                                    </div>
                                  </div>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        disabled={updateCartMutation.isPending}
                                        className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 transition-colors disabled:opacity-50"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </button>
                                      <span className="text-white font-medium w-8 text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        disabled={updateCartMutation.isPending || item.quantity >= item.product.stock}
                                        className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 transition-colors disabled:opacity-50"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => handleRemoveItem(item.id)}
                                      disabled={updateCartMutation.isPending}
                                      className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer with Summary */}
                    {cartData?.items.length ? (
                      <div className="border-t border-slate-700 px-6 py-4 space-y-4">
                        {/* Summary */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Subtotal</span>
                            <span className="text-white">{formatPrice(cartData.summary.subtotal)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Descuento con puntos</span>
                            <span className="text-accent-500">
                              -{formatPrice(cartData.summary.totalPointsDiscount * 100)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Puntos requeridos</span>
                            <div className="flex items-center gap-1 text-accent-500">
                              <Zap className="h-4 w-4" />
                              <span>{cartData.summary.totalPointsRequired}</span>
                            </div>
                          </div>
                          <div className="border-t border-slate-700 pt-2">
                            <div className="flex items-center justify-between font-semibold">
                              <span className="text-white">Total</span>
                              <span className="text-white">{formatPrice(cartData.summary.total)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Checkout Button */}
                        <button className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all">
                          Proceder al Checkout
                        </button>
                      </div>
                    ) : null}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
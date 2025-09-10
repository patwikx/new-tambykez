"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export interface CartItemWithDetails {
  id: string
  quantity: number
  productVariant: {
    id: string
    name: string
    price: number
    compareAtPrice: number | null
    inventory: number
    size: string | null
    color: string | null
    product: {
      id: string
      name: string
      slug: string
      images: {
        url: string
        altText: string | null
      }[]
      brand: {
        name: string
      }
    }
  }
}

export async function addToCart(productVariantId: string, quantity = 1) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productVariantId: {
          userId: session.user.id,
          productVariantId,
        },
      },
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productVariantId,
          quantity,
        },
      })
    }

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return { success: false, error: "Failed to add item to cart" }
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
    })

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("Error removing from cart:", error)
    return { success: false, error: "Failed to remove item from cart" }
  }
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    if (quantity <= 0) {
      return removeFromCart(cartItemId)
    }

    await prisma.cartItem.update({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
      data: { quantity },
    })

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("Error updating cart quantity:", error)
    return { success: false, error: "Failed to update quantity" }
  }
}

export async function getCartItems(): Promise<CartItemWithDetails[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        productVariant: {
          include: {
            product: {
              include: {
                images: {
                  select: {
                    url: true,
                    altText: true,
                  },
                  take: 1,
                  orderBy: { sortOrder: "asc" },
                },
                brand: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      productVariant: {
        id: item.productVariant.id,
        name: item.productVariant.name,
        price: item.productVariant.price,
        compareAtPrice: item.productVariant.compareAtPrice,
        inventory: item.productVariant.inventory,
        size: item.productVariant.size,
        color: item.productVariant.color,
        product: {
          id: item.productVariant.product.id,
          name: item.productVariant.product.name,
          slug: item.productVariant.product.slug,
          images: item.productVariant.product.images,
          brand: item.productVariant.product.brand,
        },
      },
    }))
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return []
  }
}

export async function getCartCount(): Promise<number> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return 0
    }

    const count = await prisma.cartItem.aggregate({
      where: { userId: session.user.id },
      _sum: { quantity: true },
    })

    return count._sum.quantity || 0
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return 0
  }
}

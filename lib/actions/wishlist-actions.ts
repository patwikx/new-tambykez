"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export interface WishlistItemWithDetails {
  id: string
  product: {
    id: string
    name: string
    slug: string
    images: {
      url: string
      altText: string | null
    }[]
    variants: {
      id: string
      price: number
      compareAtPrice: number | null
      inventory: number
      isDefault: boolean
    }[]
    brand: {
      name: string
    }
    rating: number
    reviewCount: number
  }
  createdAt: string
}

export async function addToWishlist(productId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    if (existing) {
      return { success: false, error: "Item already in wishlist" }
    }

    await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
    })

    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return { success: false, error: "Failed to add to wishlist" }
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return { success: false, error: "Failed to remove from wishlist" }
  }
}

export async function getWishlistItems(): Promise<WishlistItemWithDetails[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
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
            variants: {
              select: {
                id: true,
                price: true,
                compareAtPrice: true,
                inventory: true,
                isDefault: true,
              },
              where: {
                isActive: true,
                deletedAt: null,
              },
              orderBy: { isDefault: "desc" },
            },
            brand: {
              select: { name: true },
            },
            reviews: {
              select: { rating: true },
              where: { isApproved: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return wishlistItems.map((item) => ({
      id: item.id,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        images: item.product.images,
        variants: item.product.variants,
        brand: item.product.brand,
        rating:
          item.product.reviews.length > 0
            ? item.product.reviews.reduce((sum, review) => sum + review.rating, 0) / item.product.reviews.length
            : 0,
        reviewCount: item.product.reviews.length,
      },
      createdAt: item.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching wishlist items:", error)
    return []
  }
}

export async function isInWishlist(productId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return false
    }

    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    return !!item
  } catch (error) {
    console.error("Error checking wishlist:", error)
    return false
  }
}

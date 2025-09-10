"use server"

import { prisma } from "@/lib/prisma"

export interface ProductWithDetails {
  id: string
  name: string
  description: string | null
  variants: {
    id: string
    price: number
    compareAtPrice: number | null
    inventory: number
    isDefault: boolean
  }[]
  images: string[]
  rating: number
  reviewCount: number
  brand: {
    name: string
  }
  categories: {
    name: string
  }[]
  isNew: boolean
  createdAt: string
}

export interface CategoryWithCount {
  id: string
  name: string
  description: string | null
  image: string | null
  productCount: number
}

export async function getFeaturedProducts(): Promise<ProductWithDetails[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
        isFeatured: true,
      },
      include: {
        brand: {
          select: {
            name: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        images: {
          select: {
            url: true,
          },
          take: 3,
          orderBy: {
            sortOrder: "asc",
          },
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
          orderBy: {
            isDefault: "desc",
          },
        },
        reviews: {
          select: {
            rating: true,
          },
          where: {
            isApproved: true,
          },
        },
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    })

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      variants: product.variants,
      images: product.images.map((img) => img.url),
      rating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0,
      reviewCount: product.reviews.length,
      brand: {
        name: product.brand.name,
      },
      categories: product.categories.map((pc) => ({
        name: pc.category.name,
      })),
      isNew: new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      createdAt: product.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                product: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
      productCount: category._count.products,
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getAllProducts(): Promise<
  {
    id: string
    name: string
    price: number
    stock: number
    category: string
    brand: string
    status: string // Changed from isActive: boolean to status: string
  }[]
> {
  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        brand: {
          select: {
            name: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
          take: 1, // Get primary category
        },
        variants: {
          select: {
            price: true,
            inventory: true,
          },
          where: {
            isActive: true,
            deletedAt: null,
            isDefault: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.variants[0]?.price || 0,
      stock: product.variants[0]?.inventory || 0,
      category: product.categories[0]?.category.name || "Uncategorized",
      brand: product.brand.name,
      status: product.status, // Return actual status from database instead of isActive
    }))
  } catch (error) {
    console.error("Error fetching all products:", error)
    return []
  }
}

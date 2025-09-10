"use server"

import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export interface FilterCriteria {
  query?: string
  categories?: string[]
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  onSale?: boolean
  rating?: number
  sortBy?: "relevance" | "price_asc" | "price_desc" | "newest" | "rating" | "name_asc" | "name_desc"
}

export interface SearchFilters extends FilterCriteria {
  page?: number
  limit?: number
}

export interface SearchResult {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  variants: {
    id: string
    price: number
    compareAtPrice: number | null
    inventory: number
    isDefault: boolean
    size: string | null
    color: string | null
  }[]
  images: string[]
  rating: number
  reviewCount: number
  brand: {
    id: string
    name: string
    slug: string
  }
  categories: {
    id: string
    name: string
    slug: string
  }[]
  isNew: boolean
  createdAt: string
}

export interface SearchResponse {
  products: SearchResult[]
  totalCount: number
  totalPages: number
  currentPage: number
  filters: {
    categories: { id: string; name: string; slug: string; count: number }[]
    brands: { id: string; name: string; slug: string; count: number }[]
    priceRange: { min: number; max: number }
    avgRating: number
  }
}

export async function searchProducts(filters: SearchFilters = {}): Promise<SearchResponse> {
  try {
    const {
      query = "",
      categories = [],
      brands = [],
      minPrice,
      maxPrice,
      inStock,
      onSale,
      rating,
      sortBy = "relevance",
      page = 1,
      limit = 12,
    } = filters

    const skip = (page - 1) * limit

    const whereClause: Prisma.ProductWhereInput = {
      deletedAt: null,
      status: "ACTIVE",
    }

    // Text search
    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { shortDescription: { contains: query, mode: "insensitive" } },
        { brand: { name: { contains: query, mode: "insensitive" } } },
        { categories: { some: { category: { name: { contains: query, mode: "insensitive" } } } } },
      ]
    }

    // Category filter
    if (categories.length > 0) {
      whereClause.categories = {
        some: {
          category: {
            slug: { in: categories },
          },
        },
      }
    }

    // Brand filter
    if (brands.length > 0) {
      whereClause.brand = {
        slug: { in: brands },
      }
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.variants = {
        some: {
          isActive: true,
          deletedAt: null,
          ...(minPrice !== undefined && { price: { gte: minPrice } }),
          ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
        },
      }
    }

    // In stock filter
    if (inStock) {
      whereClause.variants = {
        ...whereClause.variants,
        some: {
          ...((whereClause.variants as Prisma.ProductVariantListRelationFilter)?.some || {}),
          inventory: { gt: 0 },
        },
      }
    }

    // On sale filter
    if (onSale) {
      whereClause.variants = {
        ...whereClause.variants,
        some: {
          ...((whereClause.variants as Prisma.ProductVariantListRelationFilter)?.some || {}),
          compareAtPrice: { not: null },
        },
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = {}
    switch (sortBy) {
      case "price_asc":
        orderBy = {
          variants: {
            _count: "asc",
          },
        }
        break
      case "price_desc":
        orderBy = {
          variants: {
            _count: "desc",
          },
        }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "name_asc":
        orderBy = { name: "asc" }
        break
      case "name_desc":
        orderBy = { name: "desc" }
        break
      case "rating":
        orderBy = {
          reviews: {
            _count: "desc",
          },
        }
        break
      default:
        orderBy = { createdAt: "desc" }
    }

    // Get products
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
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
              size: true,
              color: true,
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
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where: whereClause }),
    ])

    // Get filter options
    const [availableCategories, availableBrands, priceRange] = await Promise.all([
      prisma.category.findMany({
        where: {
          isActive: true,
          deletedAt: null,
          products: {
            some: {
              product: {
                ...whereClause,
              },
            },
          },
        },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  product: {
                    ...whereClause,
                  },
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.brand.findMany({
        where: {
          isActive: true,
          deletedAt: null,
          products: {
            some: {
              ...whereClause,
            },
          },
        },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  ...whereClause,
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.productVariant.aggregate({
        where: {
          isActive: true,
          deletedAt: null,
          product: {
            ...whereClause,
          },
        },
        _min: { price: true },
        _max: { price: true },
      }),
    ])

    // Transform results
    const searchResults: SearchResult[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      variants: product.variants,
      images: product.images.map((img) => img.url),
      rating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0,
      reviewCount: product.reviews.length,
      brand: product.brand,
      categories: product.categories.map((pc) => pc.category),
      isNew: new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      createdAt: product.createdAt.toISOString(),
    }))

    return {
      products: searchResults,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      filters: {
        categories: availableCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          count: cat._count.products,
        })),
        brands: availableBrands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          count: brand._count.products,
        })),
        priceRange: {
          min: priceRange._min.price || 0,
          max: priceRange._max.price || 1000,
        },
        avgRating: 4.2, // This could be calculated from actual data
      },
    }
  } catch (error) {
    console.error("Error searching products:", error)
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      filters: {
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 1000 },
        avgRating: 0,
      },
    }
  }
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    if (!query || query.length < 2) return []

    const [products, brands, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          deletedAt: null,
          status: "ACTIVE",
          name: { contains: query, mode: "insensitive" },
        },
        select: { name: true },
        take: 5,
      }),
      prisma.brand.findMany({
        where: {
          isActive: true,
          deletedAt: null,
          name: { contains: query, mode: "insensitive" },
        },
        select: { name: true },
        take: 3,
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          deletedAt: null,
          name: { contains: query, mode: "insensitive" },
        },
        select: { name: true },
        take: 3,
      }),
    ])

    const suggestions = [...products.map((p) => p.name), ...brands.map((b) => b.name), ...categories.map((c) => c.name)]

    return [...new Set(suggestions)].slice(0, 8)
  } catch (error) {
    console.error("Error getting search suggestions:", error)
    return []
  }
}

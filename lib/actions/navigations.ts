"use server"

import { prisma } from "@/lib/prisma"

// TypeScript interfaces
export interface NavigationCategory {
  id: string
  name: string
  slug: string
  children: NavigationCategory[]
}

export interface NavigationBrand {
  id: string
  name: string
  slug: string
}

export async function getNavigationCategories(): Promise<NavigationCategory[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        sortOrder: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    })

    // Build hierarchical structure
    const categoryMap = new Map<string, NavigationCategory>()
    const rootCategories: NavigationCategory[] = []

    // First pass: create all category objects
    categories.forEach((category) => {
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        children: [],
      })
    })

    // Second pass: build hierarchy
    categories.forEach((category) => {
      const categoryObj = categoryMap.get(category.id)!

      if (category.parentId) {
        const parent = categoryMap.get(category.parentId)
        if (parent) {
          parent.children.push(categoryObj)
        }
      } else {
        rootCategories.push(categoryObj)
      }
    })

    return rootCategories
  } catch (error) {
    console.error("Error fetching navigation categories:", error)
    return []
  }
}

export async function getNavigationBrands(): Promise<NavigationBrand[]> {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return brands
  } catch (error) {
    console.error("Error fetching navigation brands:", error)
    return []
  }
}

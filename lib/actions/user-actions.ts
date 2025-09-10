"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation schemas
const addressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING", "BOTH"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().default("US"),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
})

export interface UserProfile {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  role: string
  createdAt: string
  updatedAt: string
}

export interface UserAddress {
  id: string
  type: string
  firstName: string
  lastName: string
  company: string | null
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  zipCode: string
  country: string
  phone: string | null
  isDefault: boolean
}

export interface UserOrder {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  fulfillmentStatus: string
  totalAmount: number
  createdAt: string
  items: {
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    productVariant: {
      name: string
      product: {
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
  }[]
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) return null

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function getUserAddresses(): Promise<UserAddress[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    })

    return addresses
  } catch (error) {
    console.error("Error fetching user addresses:", error)
    return []
  }
}

export async function addAddress(data: z.infer<typeof addressSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const validatedData = addressSchema.parse(data)

    // If this is set as default, unset other defaults
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          deletedAt: null,
        },
        data: { isDefault: false },
      })
    }

    await prisma.address.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    })

    revalidatePath("/account/addresses")
    return { success: true }
  } catch (error) {
    console.error("Error adding address:", error)
    return { success: false, error: "Failed to add address" }
  }
}

export async function updateAddress(addressId: string, data: z.infer<typeof addressSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const validatedData = addressSchema.parse(data)

    // If this is set as default, unset other defaults
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          deletedAt: null,
          id: { not: addressId },
        },
        data: { isDefault: false },
      })
    }

    await prisma.address.update({
      where: {
        id: addressId,
        userId: session.user.id,
      },
      data: validatedData,
    })

    revalidatePath("/account/addresses")
    return { success: true }
  } catch (error) {
    console.error("Error updating address:", error)
    return { success: false, error: "Failed to update address" }
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    await prisma.address.update({
      where: {
        id: addressId,
        userId: session.user.id,
      },
      data: { deletedAt: new Date() },
    })

    revalidatePath("/account/addresses")
    return { success: true }
  } catch (error) {
    console.error("Error deleting address:", error)
    return { success: false, error: "Failed to delete address" }
  }
}

export async function getUserOrders(): Promise<UserOrder[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
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
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        productVariant: {
          name: item.productVariant.name,
          product: {
            name: item.productVariant.product.name,
            slug: item.productVariant.product.slug,
            images: item.productVariant.product.images,
            brand: item.productVariant.product.brand,
          },
        },
      })),
    }))
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return []
  }
}

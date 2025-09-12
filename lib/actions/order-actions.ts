"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createOrderSchema = z.object({
  shippingAddressId: z.string().min(1, "Shipping address is required"),
  billingAddressId: z.string().min(1, "Billing address is required"),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["card", "gcash", "paymaya", "cod"]),
})

export async function createOrder(data: z.infer<typeof createOrderSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const validatedData = createOrderSchema.parse(data)

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    })

    if (cartItems.length === 0) {
      return { success: false, error: "Cart is empty" }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.productVariant.price * item.quantity, 0)
    const shippingAmount = validatedData.shippingMethod === "express" ? 200 : subtotal > 2500 ? 0 : 150
    const taxAmount = subtotal * 0.12 // 12% VAT
    const totalAmount = subtotal + shippingAmount + taxAmount

    // Generate order number
    const orderNumber = `TBK-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        email: session.user.email,
        phone: session.user.phone,
        status: "PENDING",
        paymentStatus: validatedData.paymentMethod === "cod" ? "PENDING" : "PENDING",
        fulfillmentStatus: "UNFULFILLED",
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount: 0,
        totalAmount,
        shippingAddressId: validatedData.shippingAddressId,
        billingAddressId: validatedData.billingAddressId,
        shippingMethod: validatedData.shippingMethod,
        items: {
          create: cartItems.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            unitPrice: item.productVariant.price,
            totalPrice: item.productVariant.price * item.quantity,
          })),
        },
      },
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    })

    // Update inventory
    for (const item of cartItems) {
      await prisma.productVariant.update({
        where: { id: item.productVariantId },
        data: {
          inventory: {
            decrement: item.quantity,
          },
        },
      })

      // Log inventory change
      await prisma.inventoryLog.create({
        data: {
          productVariantId: item.productVariantId,
          type: "SALE",
          quantity: -item.quantity,
          previousStock: item.productVariant.inventory,
          newStock: item.productVariant.inventory - item.quantity,
          reason: `Order ${orderNumber}`,
          reference: order.id,
        },
      })
    }

    revalidatePath("/cart")
    revalidatePath("/account/orders")

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function getOrderById(orderId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
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
        shippingAddress: true,
        billingAddress: true,
        payments: true,
      },
    })

    return order
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}
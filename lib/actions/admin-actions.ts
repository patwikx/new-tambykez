"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { OrderStatus } from "@prisma/client"

export async function checkAdminAccess() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN") {
    redirect("/")
  }

  return true
}

export async function getDashboardStats() {
  await checkAdminAccess()

  const [totalProducts, totalOrders, totalUsers, totalRevenue, recentOrdersRaw, lowStockProducts] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: OrderStatus.DELIVERED },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: {
          include: {
            productVariant: {
              include: {
                product: { select: { name: true } },
              },
            },
          },
        },
      },
    }),
    prisma.productVariant.findMany({
      where: {
        inventory: { lte: 10 },
        isActive: true,
        deletedAt: null,
      },
      take: 10,
      select: {
        id: true,
        inventory: true,
        price: true,
        product: { select: { id: true, name: true } },
      },
    }),
  ])

  const recentOrders = recentOrdersRaw.map((order) => ({
    id: order.id,
    total: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
    user: {
      name: order.user ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() || null : null,
      email: order.user?.email || null,
    },
    orderItems: order.items.map((item) => ({
      product: {
        name: item.productVariant.product.name,
      },
    })),
  }))

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    recentOrders,
    lowStockProducts,
  }
}

export async function updateProductStock(variantId: string, inventory: number) {
  await checkAdminAccess()

  await prisma.productVariant.update({
    where: { id: variantId },
    data: { inventory },
  })

  revalidatePath("/admin")
  revalidatePath("/admin/products")
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await checkAdminAccess()

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  })

  revalidatePath("/admin")
  revalidatePath("/admin/orders")
}

export async function deleteProduct(productId: string) {
  await checkAdminAccess()

  await prisma.product.update({
    where: { id: productId },
    data: { deletedAt: new Date() },
  })

  revalidatePath("/admin/products")
}

export async function getAdminOrders() {
  await checkAdminAccess()

  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: {
        include: {
          productVariant: {
            select: {
              price: true,
              product: { select: { name: true } },
            },
          },
        },
      },
    },
  })
}

export async function getAdminUsers() {
  await checkAdminAccess()

  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  })
}

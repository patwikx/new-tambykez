"use client"

import { Box, Card, CardContent, Typography, Chip, Divider, Button } from "@mui/material"
import { CheckCircle, LocalShipping, Payment, Print } from "@mui/icons-material"
import Link from "next/link"
import type { Order, OrderItem, ProductVariant, Product, Brand, ProductImage, Address, Payment as PaymentType } from "@prisma/client"

interface OrderWithDetails extends Order {
  items: (OrderItem & {
    productVariant: ProductVariant & {
      product: Product & {
        brand: Brand
        images: ProductImage[]
      }
    }
  })[]
  shippingAddress: Address | null
  billingAddress: Address | null
  payments: PaymentType[]
}

interface OrderDetailsProps {
  order: OrderWithDetails
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#10b981"
      case "shipped":
        return "#3b82f6"
      case "processing":
        return "#f59e0b"
      case "pending":
        return "#6b7280"
      case "cancelled":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle sx={{ color: "#10b981" }} />
      case "shipped":
        return <LocalShipping sx={{ color: "#3b82f6" }} />
      case "processing":
        return <Payment sx={{ color: "#f59e0b" }} />
      default:
        return <CheckCircle sx={{ color: "#6b7280" }} />
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Order Header */}
      <Card sx={{ bgcolor: "#111111", border: "1px solid #333" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "white", mb: 1 }}>
                Order #{order.orderNumber}
              </Typography>
              <Typography variant="body1" sx={{ color: "#999" }}>
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {getStatusIcon(order.status)}
              <Chip
                label={order.status}
                sx={{
                  bgcolor: getStatusColor(order.status),
                  color: "white",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box>
              <Typography variant="body2" sx={{ color: "#999", mb: 1 }}>
                Payment Status
              </Typography>
              <Chip
                label={order.paymentStatus}
                size="small"
                sx={{
                  bgcolor: order.paymentStatus === "PAID" ? "#10b981" : "#f59e0b",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "#999", mb: 1 }}>
                Fulfillment Status
              </Typography>
              <Chip
                label={order.fulfillmentStatus}
                size="small"
                sx={{
                  bgcolor: order.fulfillmentStatus === "FULFILLED" ? "#10b981" : "#6b7280",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              />
            </Box>
            {order.trackingNumber && (
              <Box>
                <Typography variant="body2" sx={{ color: "#999", mb: 1 }}>
                  Tracking Number
                </Typography>
                <Typography variant="body1" sx={{ color: "#FF6B35", fontWeight: 600 }}>
                  {order.trackingNumber}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", lg: "row" } }}>
        {/* Order Items */}
        <Box sx={{ flex: 2 }}>
          <Card sx={{ bgcolor: "#111111", border: "1px solid #333" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 3 }}>
                Order Items
              </Typography>
              
              {order.items.map((item) => (
                <Box key={item.id} sx={{ display: "flex", gap: 3, mb: 3, pb: 3, borderBottom: "1px solid #333" }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #333",
                    }}
                  >
                    <img
                      src={item.productVariant.product.images[0]?.url || "/motorcycle-gear.jpg"}
                      alt={item.productVariant.product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: "#FF6B35", fontWeight: 600, mb: 1 }}>
                      {item.productVariant.product.brand.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 1 }}>
                      {item.productVariant.product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#999", mb: 2 }}>
                      Variant: {item.productVariant.name}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ color: "#999" }}>
                        Qty: {item.quantity} × ₱{item.unitPrice}
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#FF6B35", fontWeight: 700 }}>
                        ₱{item.totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Order Summary & Addresses */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Order Summary */}
          <Card sx={{ bgcolor: "#111111", border: "1px solid #333" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" sx={{ color: "#999" }}>
                  Subtotal
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  ₱{order.subtotal.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" sx={{ color: "#999" }}>
                  Shipping
                </Typography>
                <Typography variant="body2" sx={{ color: order.shippingAmount === 0 ? "#10b981" : "white" }}>
                  {order.shippingAmount === 0 ? "FREE" : `₱${order.shippingAmount.toFixed(2)}`}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2" sx={{ color: "#999" }}>
                  Tax (VAT 12%)
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  ₱{order.taxAmount.toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ bgcolor: "#333", my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#FF6B35" }}>
                  ₱{order.totalAmount.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Print />}
                sx={{
                  borderColor: "#333",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  "&:hover": {
                    borderColor: "#FF6B35",
                    bgcolor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                Print Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card sx={{ bgcolor: "#111111", border: "1px solid #333" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 3 }}>
                  Shipping Address
                </Typography>
                <Typography variant="body1" sx={{ color: "white", fontWeight: 600, mb: 1 }}>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: "#999", mb: 1 }}>
                  {order.shippingAddress.addressLine1}
                </Typography>
                {order.shippingAddress.addressLine2 && (
                  <Typography variant="body2" sx={{ color: "#999", mb: 1 }}>
                    {order.shippingAddress.addressLine2}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: "#999", mb: 1 }}>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Typography>
                <Typography variant="body2" sx={{ color: "#999" }}>
                  {order.shippingAddress.country}
                </Typography>
                {order.shippingAddress.phone && (
                  <Typography variant="body2" sx={{ color: "#999", mt: 1 }}>
                    Phone: {order.shippingAddress.phone}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {/* Back to Orders */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="outlined"
          component={Link}
          href="/account/orders"
          sx={{
            borderColor: "#333",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase",
            px: 4,
            py: 1.5,
            "&:hover": {
              borderColor: "#FF6B35",
              bgcolor: "rgba(255, 107, 53, 0.1)",
            },
          }}
        >
          Back to Orders
        </Button>
      </Box>
    </Box>
  )
}
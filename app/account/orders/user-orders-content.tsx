"use client"

import { Typography, Paper, Stack, Chip, Box, Divider } from "@mui/material"
import { ShoppingBag, LocalShipping, CheckCircle, Cancel } from "@mui/icons-material"
import { OrderStatus } from "@prisma/client"
import { Fragment } from "react"
import { UserOrder } from "@/lib/actions/user-actions"

interface UserOrdersContentProps {
  initialOrders: UserOrder[]
}

export default function UserOrdersContent({ initialOrders }: UserOrdersContentProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount)
  }

  const getStatusColor = (status: string): "warning" | "info" | "primary" | "success" | "error" | "default" => {
    switch (status) {
      case OrderStatus.PENDING:
        return "warning"
      case OrderStatus.PROCESSING:
        return "info"
      case OrderStatus.SHIPPED:
        return "primary"
      case OrderStatus.DELIVERED:
        return "success"
      case OrderStatus.CANCELLED:
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <ShoppingBag sx={{ color: "#ff9800" }} />
      case OrderStatus.PROCESSING:
        return <ShoppingBag sx={{ color: "#2196f3" }} />
      case OrderStatus.SHIPPED:
        return <LocalShipping sx={{ color: "#9c27b0" }} />
      case OrderStatus.DELIVERED:
        return <CheckCircle sx={{ color: "#4caf50" }} />
      case OrderStatus.CANCELLED:
        return <Cancel sx={{ color: "#f44336" }} />
      default:
        return <ShoppingBag sx={{ color: "#666" }} />
    }
  }

  return (
    <Fragment>
      <Typography variant="h4" gutterBottom sx={{ color: "#333", mb: 4, fontWeight: 600 }}>
        My Orders
      </Typography>

      {initialOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <ShoppingBag sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
            No Orders Yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#999" }}>
            When you place your first order, it will appear here.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {initialOrders.map((order) => (
            <Paper key={order.id} sx={{ p: 3, bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                alignItems={{ xs: "flex-start", md: "center" }}
                divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />}
              >
                {/* Left side: Order details */}
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    {getStatusIcon(order.status)}
                    <Box>
                      <Typography variant="h6" sx={{ color: "#333", fontWeight: 600 }}>
                        Order #{order.id.slice(-8)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <Stack spacing={1}>
                    {order.items.map((item, index) => (
                      <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: "#333", fontWeight: 500 }}>
                            {item.productVariant.product.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#333", fontWeight: 500 }}>
                          {formatCurrency(item.totalPrice)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
                
                {/* Right side: Status and Total */}
                <Stack
                  spacing={2}
                  alignItems={{ xs: "flex-start", md: "flex-end" }}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="medium"
                    sx={{ fontWeight: 600 }}
                  />
                  <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Total Amount
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#DC143C", fontWeight: 600 }}>
                      {formatCurrency(order.totalAmount)}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Fragment>
  )
}
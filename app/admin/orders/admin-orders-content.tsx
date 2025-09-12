"use client"

import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
} from "@mui/material"
import { Search } from "@mui/icons-material"
import { useState, useTransition } from "react"
import { updateOrderStatus } from "@/lib/actions/admin-actions"
import { OrderStatus } from "@prisma/client"

interface Order {
  id: string
  totalAmount: number
  status: OrderStatus
  createdAt: Date
  user: {
    firstName: string | null
    lastName: string | null
    email: string | null
  } | null
  items: Array<{
    quantity: number
    productVariant: {
      price: number
      product: { name: string }
    }
  }>
}

interface AdminOrdersContentProps {
  initialOrders: Order[]
}

export default function AdminOrdersContent({ initialOrders }: AdminOrdersContentProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount)
  }

  const getStatusColor = (status: OrderStatus): "warning" | "info" | "primary" | "success" | "error" | "default" => {
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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter
    const matchesSearch =
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ color: "#333", mb: 4, fontWeight: 600 }}>
        Order Management
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ddd" },
                "&:hover fieldset": { borderColor: "#DC143C" },
                "&.Mui-focused fieldset": { borderColor: "#DC143C" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "ALL")}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ddd" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#DC143C" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#DC143C" },
              }}
            >
              <MenuItem value="ALL">All Orders</MenuItem>
              <MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
              <MenuItem value={OrderStatus.PROCESSING}>Processing</MenuItem>
              <MenuItem value={OrderStatus.SHIPPED}>Shipped</MenuItem>
              <MenuItem value={OrderStatus.DELIVERED}>Delivered</MenuItem>
              <MenuItem value={OrderStatus.CANCELLED}>Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Items</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} sx={{ "&:hover": { bgcolor: "#f8f9fa" } }}>
                  <TableCell sx={{ color: "#333", fontWeight: 500 }}>#{order.id.slice(-8)}</TableCell>
                  <TableCell sx={{ color: "#333" }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {order.user
                          ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() || "N/A"
                          : "Guest"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        {order.user?.email || "No email"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#666" }}>
                    <Box>
                      {order.items.slice(0, 2).map((item, index) => (
                        <Typography key={index} variant="caption" sx={{ display: "block" }}>
                          {item.quantity}x {item.productVariant.product.name}
                        </Typography>
                      ))}
                      {order.items.length > 2 && (
                        <Typography variant="caption" sx={{ color: "#999" }}>
                          +{order.items.length - 2} more items
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#333", fontWeight: 500 }}>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                  </TableCell>
                  <TableCell sx={{ color: "#666" }}>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        disabled={isPending}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ddd" },
                          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#DC143C" },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#DC143C" },
                        }}
                      >
                        <MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
                        <MenuItem value={OrderStatus.PROCESSING}>Processing</MenuItem>
                        <MenuItem value={OrderStatus.SHIPPED}>Shipped</MenuItem>
                        <MenuItem value={OrderStatus.DELIVERED}>Delivered</MenuItem>
                        <MenuItem value={OrderStatus.CANCELLED}>Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredOrders.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "#666" }}>
              No orders found matching your criteria.
            </Typography>
          </Box>
        )}
      </Paper>
    </>
  )
}

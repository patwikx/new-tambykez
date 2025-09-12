"use client"

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material"
import { TrendingUp, ShoppingCart, People, Inventory, Warning, Edit } from "@mui/icons-material"
import { useState, useTransition } from "react"
import { updateProductStock, updateOrderStatus } from "@/lib/actions/admin-actions"
import { OrderStatus } from "@prisma/client"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    total: number
    status: OrderStatus
    createdAt: Date
    user: { name: string | null; email: string | null }
    orderItems: Array<{ product: { name: string } }>
  }>
  lowStockProducts: Array<{
    id: string
    product: { name: string; id: string }
    price: number
    inventory: number
  }>
}

interface AdminDashboardProps {
  initialStats: DashboardStats
}

interface LowStockProduct {
  id: string
  product: { name: string; id: string }
  inventory: number
  price: number
}

export default function AdminDashboard({ initialStats }: AdminDashboardProps) {
  const [stats, setStats] = useState(initialStats)
  const [stockDialog, setStockDialog] = useState<{ open: boolean; product: LowStockProduct | null }>({
    open: false,
    product: null,
  })
  const [newStock, setNewStock] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleUpdateStock = () => {
    if (!stockDialog.product || !newStock) return

    startTransition(async () => {
      await updateProductStock(stockDialog.product!.product.id, Number.parseInt(newStock))
      // Refresh stats
      setStockDialog({ open: false, product: null })
      setNewStock("")
    })
  }

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, status)
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#333", mb: 4, fontWeight: 600 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1, bgcolor: "#DC143C", borderRadius: 1 }}>
              <Inventory sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: "#333", fontWeight: 600 }}>
                {stats.totalProducts}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Total Products
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, flex: 1, bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1, bgcolor: "#DC143C", borderRadius: 1 }}>
              <ShoppingCart sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: "#333", fontWeight: 600 }}>
                {stats.totalOrders}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Total Orders
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, flex: 1, bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1, bgcolor: "#DC143C", borderRadius: 1 }}>
              <People sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: "#333", fontWeight: 600 }}>
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Total Users
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, flex: 1, bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1, bgcolor: "#DC143C", borderRadius: 1 }}>
              <TrendingUp sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: "#333", fontWeight: 600 }}>
                {formatCurrency(stats.totalRevenue)}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Total Revenue
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
        {/* Recent Orders */}
        <Paper sx={{ flex: 2, p: 3, bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#333", fontWeight: 600 }}>
            Recent Orders
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#666", fontWeight: 600 }}>Order ID</TableCell>
                  <TableCell sx={{ color: "#666", fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ color: "#666", fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ color: "#666", fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: "#666", fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell sx={{ color: "#333" }}>#{order.id.slice(-8)}</TableCell>
                    <TableCell sx={{ color: "#333" }}>{order.user.name || order.user.email}</TableCell>
                    <TableCell sx={{ color: "#333" }}>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: "#DC143C",
                          color: "#DC143C",
                          "&:hover": {
                            borderColor: "#B91C3C",
                            bgcolor: "rgba(220, 20, 60, 0.04)",
                          },
                        }}
                        onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.PROCESSING)}
                        disabled={isPending || order.status === OrderStatus.DELIVERED}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Low Stock Alert */}
        <Paper sx={{ flex: 1, p: 3, bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Warning sx={{ color: "#DC143C" }} />
            <Typography variant="h6" sx={{ color: "#333", fontWeight: 600 }}>
              Low Stock Alert
            </Typography>
          </Stack>

          {stats.lowStockProducts.length === 0 ? (
            <Alert severity="success" sx={{ bgcolor: "#e8f5e8", color: "#2e7d32" }}>
              All products are well stocked!
            </Alert>
          ) : (
            <Stack spacing={2}>
              {stats.lowStockProducts.map((product) => (
                <Paper key={product.id} sx={{ p: 2, bgcolor: "#f8f9fa", border: "1px solid #e0e0e0" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" sx={{ color: "#333", fontWeight: 500 }}>
                        {product.product.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        Stock: {product.inventory} | {formatCurrency(product.price)}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      variant="outlined"
                      sx={{
                        borderColor: "#DC143C",
                        color: "#DC143C",
                        "&:hover": {
                          borderColor: "#B91C3C",
                          bgcolor: "rgba(220, 20, 60, 0.04)",
                        },
                      }}
                      onClick={() => {
                        setStockDialog({ open: true, product })
                        setNewStock(product.inventory.toString())
                      }}
                    >
                      Update
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>

      {/* Stock Update Dialog */}
      <Dialog
        open={stockDialog.open}
        onClose={() => setStockDialog({ open: false, product: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "white", color: "#333", borderBottom: "1px solid #e0e0e0" }}>
          Update Stock - {stockDialog.product?.product.name}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "white" }}>
          <TextField
            fullWidth
            label="New Stock Quantity"
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ddd" },
                "&:hover fieldset": { borderColor: "#DC143C" },
                "&.Mui-focused fieldset": { borderColor: "#DC143C" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#DC143C" },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: "white", borderTop: "1px solid #e0e0e0" }}>
          <Button onClick={() => setStockDialog({ open: false, product: null })}>Cancel</Button>
          <Button
            onClick={handleUpdateStock}
            variant="contained"
            disabled={isPending || !newStock}
            sx={{
              bgcolor: "#DC143C",
              "&:hover": { bgcolor: "#B91C3C" },
            }}
          >
            Update Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

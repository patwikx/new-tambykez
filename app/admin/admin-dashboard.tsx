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
      <Typography variant="h4" gutterBottom sx={{ color: "white", mb: 4 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, bgcolor: "grey.900" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1, bgcolor: "primary.main", borderRadius: 1 }}>
              <Inventory sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: "white" }}>
                {stats.totalProducts}
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.400" }}>
                Total Products
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, flex: 1, bgcolor: "grey.900" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1, bgcolor: "success.main", borderRadius: 1 }}>
              <ShoppingCart sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: "white" }}>
                {stats.totalOrders}
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.400" }}>
                Total Orders
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, flex: 1, bgcolor: "grey.900" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1, bgcolor: "info.main", borderRadius: 1 }}>
              <People sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: "white" }}>
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.400" }}>
                Total Users
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, flex: 1, bgcolor: "grey.900" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1, bgcolor: "warning.main", borderRadius: 1 }}>
              <TrendingUp sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: "white" }}>
                {formatCurrency(stats.totalRevenue)}
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.400" }}>
                Total Revenue
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
        {/* Recent Orders */}
        <Paper sx={{ flex: 2, p: 3, bgcolor: "grey.900" }}>
          <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
            Recent Orders
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "grey.400" }}>Order ID</TableCell>
                  <TableCell sx={{ color: "grey.400" }}>Customer</TableCell>
                  <TableCell sx={{ color: "grey.400" }}>Total</TableCell>
                  <TableCell sx={{ color: "grey.400" }}>Status</TableCell>
                  <TableCell sx={{ color: "grey.400" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell sx={{ color: "white" }}>#{order.id.slice(-8)}</TableCell>
                    <TableCell sx={{ color: "white" }}>{order.user.name || order.user.email}</TableCell>
                    <TableCell sx={{ color: "white" }}>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
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
        <Paper sx={{ flex: 1, p: 3, bgcolor: "grey.900" }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Warning sx={{ color: "warning.main" }} />
            <Typography variant="h6" sx={{ color: "white" }}>
              Low Stock Alert
            </Typography>
          </Stack>

          {stats.lowStockProducts.length === 0 ? (
            <Alert severity="success" sx={{ bgcolor: "success.dark" }}>
              All products are well stocked!
            </Alert>
          ) : (
            <Stack spacing={2}>
              {stats.lowStockProducts.map((product) => (
                <Paper key={product.id} sx={{ p: 2, bgcolor: "grey.800" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" sx={{ color: "white" }}>
                        {product.product.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "grey.400" }}>
                        Stock: {product.inventory} | {formatCurrency(product.price)}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<Edit />}
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
        <DialogTitle sx={{ bgcolor: "grey.900", color: "white" }}>
          Update Stock - {stockDialog.product?.product.name}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "grey.900" }}>
          <TextField
            fullWidth
            label="New Stock Quantity"
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            sx={{ mt: 2 }}
            InputLabelProps={{ sx: { color: "grey.400" } }}
            InputProps={{ sx: { color: "white" } }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: "grey.900" }}>
          <Button onClick={() => setStockDialog({ open: false, product: null })}>Cancel</Button>
          <Button onClick={handleUpdateStock} variant="contained" disabled={isPending || !newStock}>
            Update Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

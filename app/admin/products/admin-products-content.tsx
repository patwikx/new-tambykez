"use client"

import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"
import { useState, useTransition } from "react"
import { deleteProduct } from "@/lib/actions/admin-actions"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  brand: string
  status: string // Changed from isActive: boolean to status: string
}

interface AdminProductsContentProps {
  initialProducts: Product[]
}

export default function AdminProductsContent({ initialProducts }: AdminProductsContentProps) {
  const [products, setProducts] = useState(initialProducts)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  })
  const [isPending, startTransition] = useTransition()

  const handleDeleteProduct = () => {
    if (!deleteDialog.product) return

    startTransition(async () => {
      await deleteProduct(deleteDialog.product!.id)
      setProducts(products.filter((p) => p.id !== deleteDialog.product!.id))
      setDeleteDialog({ open: false, product: null })
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "error" as const }
    if (stock <= 10) return { label: "Low Stock", color: "warning" as const }
    return { label: "In Stock", color: "success" as const }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { label: "Active", color: "success" as const }
      case "INACTIVE":
        return { label: "Inactive", color: "default" as const }
      case "DRAFT":
        return { label: "Draft", color: "warning" as const }
      case "DISCONTINUED":
        return { label: "Discontinued", color: "error" as const }
      default:
        return { label: status, color: "default" as const }
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: "#333", fontWeight: 600 }}>
          Product Management
        </Typography>
        <Button
          component={Link}
          href="/admin/products/new"
          variant="contained"
          startIcon={<Add />}
          sx={{
            bgcolor: "#DC143C",
            "&:hover": { bgcolor: "#B91C3C" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add Product
        </Button>
      </Stack>

      <Paper sx={{ bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Brand</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Stock</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                return (
                  <TableRow key={product.id} sx={{ "&:hover": { bgcolor: "#f8f9fa" } }}>
                    <TableCell sx={{ color: "#333" }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#666" }}>{product.category}</TableCell>
                    <TableCell sx={{ color: "#666" }}>{product.brand}</TableCell>
                    <TableCell sx={{ color: "#333", fontWeight: 500 }}>{formatCurrency(product.price)}</TableCell>
                    <TableCell sx={{ color: "#333" }}>{product.stock}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Chip label={stockStatus.label} color={stockStatus.color} size="small" />
                        <Chip
                          label={getStatusDisplay(product.status).label}
                          color={getStatusDisplay(product.status).color}
                          size="small"
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          component={Link}
                          href={`/admin/products/${product.id}/edit`}
                          size="small"
                          sx={{
                            color: "#DC143C",
                            "&:hover": { bgcolor: "rgba(220, 20, 60, 0.04)" },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => setDeleteDialog({ open: true, product })}
                          size="small"
                          sx={{
                            color: "#f44336",
                            "&:hover": { bgcolor: "rgba(244, 67, 54, 0.04)" },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, product: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "white", color: "#333", borderBottom: "1px solid #e0e0e0" }}>
          Delete Product
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "white", pt: 3 }}>
          <Typography sx={{ color: "#333" }}>
            Are you sure you want to delete &quot;{deleteDialog.product?.name || "this product"}&quot;? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "white", borderTop: "1px solid #e0e0e0" }}>
          <Button onClick={() => setDeleteDialog({ open: false, product: null })}>Cancel</Button>
          <Button
            onClick={handleDeleteProduct}
            variant="contained"
            color="error"
            disabled={isPending}
            sx={{
              bgcolor: "#f44336",
              "&:hover": { bgcolor: "#d32f2f" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

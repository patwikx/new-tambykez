"use client"

import { useState, useEffect, useTransition } from "react"
import { Drawer, Box, Typography, IconButton, Button, List, ListItem, Avatar, TextField, Skeleton } from "@mui/material"
import { Close, Add, Remove, Delete, ShoppingBag } from "@mui/icons-material"
import Link from "next/link"
import { getCartItems, updateCartQuantity, removeFromCart, type CartItemWithDetails } from "@/lib/actions/cart-actions"
import { toast } from "sonner"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (open) {
      loadCartItems()
    }
  }, [open])

  const loadCartItems = async () => {
    setLoading(true)
    try {
      const items = await getCartItems()
      setCartItems(items)
    } catch (error) {
      console.error("Error loading cart items:", error)
      toast.error("Failed to load cart items")
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    startTransition(async () => {
      const result = await updateCartQuantity(cartItemId, newQuantity)
      if (result.success) {
        await loadCartItems()
      } else {
        toast.error(result.error || "Failed to update quantity")
      }
    })
  }

  const handleRemoveItem = (cartItemId: string) => {
    startTransition(async () => {
      const result = await removeFromCart(cartItemId)
      if (result.success) {
        await loadCartItems()
        toast.success("Item removed from cart")
      } else {
        toast.error(result.error || "Failed to remove item")
      }
    })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.productVariant.price * item.quantity, 0)
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          bgcolor: "#000000",
          color: "white",
          border: "none",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Shopping Cart ({itemCount})
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Skeleton variant="rectangular" width={80} height={80} sx={{ bgcolor: "#333", borderRadius: 1 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="80%" sx={{ bgcolor: "#333", mb: 1 }} />
                    <Skeleton variant="text" width="60%" sx={{ bgcolor: "#333", mb: 1 }} />
                    <Skeleton variant="text" width="40%" sx={{ bgcolor: "#333" }} />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : cartItems.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <ShoppingBag sx={{ fontSize: 64, color: "#666", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" sx={{ color: "#999", mb: 3 }}>
                Add some items to get started
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/"
                onClick={onClose}
                sx={{
                  bgcolor: "#FF6B35",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  "&:hover": {
                    bgcolor: "#E55A2B",
                  },
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {cartItems.map((item) => (
                <ListItem key={item.id} sx={{ p: 2, borderBottom: "1px solid #333" }}>
                  <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                    {/* Product Image */}
                    <Avatar
                      variant="rounded"
                      src={item.productVariant.product.images[0]?.url || "/motorcycle-gear.jpg"}
                      alt={item.productVariant.product.name}
                      sx={{ width: 80, height: 80 }}
                    />

                    {/* Product Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#FF6B35",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          mb: 0.5,
                        }}
                      >
                        {item.productVariant.product.brand.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "white",
                          mb: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.productVariant.product.name}
                      </Typography>

                      {/* Variant Info */}
                      {(item.productVariant.size || item.productVariant.color) && (
                        <Typography variant="body2" sx={{ color: "#999", mb: 1 }}>
                          {[item.productVariant.size, item.productVariant.color].filter(Boolean).join(" • ")}
                        </Typography>
                      )}

                      {/* Price and Quantity */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: "#FF6B35" }}>
                          ${item.productVariant.price}
                        </Typography>

                        {/* Quantity Controls */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={isPending || item.quantity <= 1}
                            sx={{
                              color: "white",
                              border: "1px solid #333",
                              width: 28,
                              height: 28,
                              "&:hover": {
                                borderColor: "#FF6B35",
                              },
                            }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => {
                              const val = Number.parseInt(e.target.value) || 1
                              handleQuantityChange(item.id, Math.max(1, Math.min(item.productVariant.inventory, val)))
                            }}
                            size="small"
                            disabled={isPending}
                            sx={{
                              width: 50,
                              "& .MuiOutlinedInput-root": {
                                height: 28,
                                "& fieldset": { borderColor: "#333" },
                                "&:hover fieldset": { borderColor: "#FF6B35" },
                                "&.Mui-focused fieldset": { borderColor: "#FF6B35" },
                                "& input": {
                                  textAlign: "center",
                                  color: "white",
                                  fontSize: "0.875rem",
                                  p: 0,
                                },
                              },
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={isPending || item.quantity >= item.productVariant.inventory}
                            sx={{
                              color: "white",
                              border: "1px solid #333",
                              width: 28,
                              height: 28,
                              "&:hover": {
                                borderColor: "#FF6B35",
                              },
                            }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isPending}
                            sx={{
                              color: "#ef4444",
                              ml: 1,
                              "&:hover": {
                                bgcolor: "rgba(239, 68, 68, 0.1)",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {cartItems.length > 0 && (
          <Box sx={{ p: 3, borderTop: "1px solid #333" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                Subtotal
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#FF6B35" }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                component={Link}
                href="/cart"
                onClick={onClose}
                sx={{
                  bgcolor: "#FF6B35",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#E55A2B",
                  },
                }}
              >
                View Cart
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/checkout"
                onClick={onClose}
                sx={{
                  borderColor: "#333",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#FF6B35",
                    bgcolor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}

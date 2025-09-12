"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Button, Card, CardContent, Divider, Skeleton, Container } from "@mui/material"
import { ShoppingBag, ArrowForward } from "@mui/icons-material"
import Link from "next/link"
import { getCartItems, type CartItemWithDetails } from "@/lib/actions/cart-actions"

import { toast } from "sonner"
import CartItem from "@/components/cart/cart-items"

export default function CartPageContent() {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCartItems()
  }, [])

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

  const subtotal = cartItems.reduce((sum, item) => sum + item.productVariant.price * item.quantity, 0)
  const estimatedTax = subtotal * 0.08 // 8% tax estimate
  const estimatedShipping = subtotal > 2500 ? 0 : 150 // Free shipping over ₱2500
  const total = subtotal + estimatedTax + estimatedShipping

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            mb: 6,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "#333",
          }}
        >
          SHOPPING CART
        </Typography>
        <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", lg: "row" } }}>
          <Box sx={{ flex: 2 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} sx={{ bgcolor: "white", border: "1px solid #e0e0e0", mb: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Skeleton
                      variant="rectangular"
                      width={120}
                      height={120}
                      sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="40%" sx={{ bgcolor: "#f5f5f5", mb: 1 }} />
                      <Skeleton variant="text" width="80%" sx={{ bgcolor: "#f5f5f5", mb: 2 }} />
                      <Skeleton variant="text" width="60%" sx={{ bgcolor: "#f5f5f5", mb: 2 }} />
                      <Skeleton variant="text" width="50%" sx={{ bgcolor: "#f5f5f5" }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ bgcolor: "white", border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" width="60%" sx={{ bgcolor: "#f5f5f5", mb: 2 }} />
                <Skeleton variant="text" width="100%" sx={{ bgcolor: "#f5f5f5", mb: 1 }} />
                <Skeleton variant="text" width="100%" sx={{ bgcolor: "#f5f5f5", mb: 1 }} />
                <Skeleton variant="text" width="100%" sx={{ bgcolor: "#f5f5f5", mb: 3 }} />
                <Skeleton variant="rectangular" height={48} sx={{ bgcolor: "#f5f5f5" }} />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            mb: 6,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "#333",
          }}
        >
          SHOPPING CART
        </Typography>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <ShoppingBag sx={{ fontSize: 120, color: "#ccc", mb: 4 }} />
          <Typography variant="h4" sx={{ color: "#666", mb: 2, fontWeight: 700 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" sx={{ color: "#999", mb: 4, maxWidth: 400, mx: "auto" }}>
            Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/"
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: "#DC143C",
              color: "white",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "#B91C3C",
              },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          mb: 6,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          color: "#333",
        }}
      >
        SHOPPING CART
      </Typography>
      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", lg: "row" } }}>
        {/* Cart Items */}
        <Box sx={{ flex: 2 }}>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} onUpdate={loadCartItems} />
          ))}
        </Box>

        {/* Order Summary */}
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              bgcolor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              position: "sticky",
              top: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  mb: 3,
                  color: "#333",
                }}
              >
                Order Summary
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "#333" }}>
                  ₱{subtotal.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Estimated Tax
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "#333" }}>
                  ₱{estimatedTax.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Shipping
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: estimatedShipping === 0 ? "#4ade80" : "#333" }}
                >
                  {estimatedShipping === 0 ? "FREE" : `₱${estimatedShipping.toFixed(2)}`}
                </Typography>
              </Box>

              {subtotal < 2500 && (
                <Typography variant="body2" sx={{ color: "#DC143C", mb: 2, textAlign: "center", fontWeight: 500 }}>
                  Add ₱{(2500 - subtotal).toFixed(2)} more for free shipping
                </Typography>
              )}

              <Divider sx={{ bgcolor: "#e0e0e0", my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#DC143C" }}>
                  ₱{total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                component={Link}
                href="/checkout"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: "#DC143C",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  py: 1.5,
                  mb: 2,
                  "&:hover": {
                    bgcolor: "#B91C3C",
                  },
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/"
                sx={{
                  borderColor: "#e0e0e0",
                  color: "#666",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  "&:hover": {
                    borderColor: "#DC143C",
                    color: "#DC143C",
                    bgcolor: "rgba(220, 20, 60, 0.05)",
                  },
                }}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}

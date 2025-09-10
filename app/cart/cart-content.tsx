"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Button, Card, CardContent, Divider, Skeleton } from "@mui/material"
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
  const estimatedShipping = subtotal > 99 ? 0 : 15 // Free shipping over $99
  const total = subtotal + estimatedTax + estimatedShipping

  if (loading) {
    return (
      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", lg: "row" } }}>
        <Box sx={{ flex: 2 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} sx={{ bgcolor: "#111111", border: "1px solid #333", mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Skeleton variant="rectangular" width={120} height={120} sx={{ bgcolor: "#333", borderRadius: 1 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="40%" sx={{ bgcolor: "#333", mb: 1 }} />
                    <Skeleton variant="text" width="80%" sx={{ bgcolor: "#333", mb: 2 }} />
                    <Skeleton variant="text" width="60%" sx={{ bgcolor: "#333", mb: 2 }} />
                    <Skeleton variant="text" width="50%" sx={{ bgcolor: "#333" }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card sx={{ bgcolor: "#111111", border: "1px solid #333" }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" sx={{ bgcolor: "#333", mb: 2 }} />
              <Skeleton variant="text" width="100%" sx={{ bgcolor: "#333", mb: 1 }} />
              <Skeleton variant="text" width="100%" sx={{ bgcolor: "#333", mb: 1 }} />
              <Skeleton variant="text" width="100%" sx={{ bgcolor: "#333", mb: 3 }} />
              <Skeleton variant="rectangular" height={48} sx={{ bgcolor: "#333" }} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <ShoppingBag sx={{ fontSize: 120, color: "#666", mb: 4 }} />
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
            bgcolor: "#FF6B35",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            px: 4,
            py: 1.5,
            "&:hover": {
              bgcolor: "#E55A2B",
            },
          }}
        >
          Continue Shopping
        </Button>
      </Box>
    )
  }

  return (
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
            bgcolor: "#111111",
            border: "1px solid #333",
            borderRadius: 2,
            position: "sticky",
            top: 20,
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
              }}
            >
              Order Summary
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body1">
                Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body1">Estimated Tax</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                ${estimatedTax.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body1">Shipping</Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: estimatedShipping === 0 ? "#4ade80" : "white" }}
              >
                {estimatedShipping === 0 ? "FREE" : `$${estimatedShipping.toFixed(2)}`}
              </Typography>
            </Box>

            {subtotal < 99 && (
              <Typography variant="body2" sx={{ color: "#999", mb: 2, textAlign: "center" }}>
                Add ${(99 - subtotal).toFixed(2)} more for free shipping
              </Typography>
            )}

            <Divider sx={{ bgcolor: "#333", my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#FF6B35" }}>
                ${total.toFixed(2)}
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
                bgcolor: "#FF6B35",
                color: "white",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                py: 1.5,
                mb: 2,
                "&:hover": {
                  bgcolor: "#E55A2B",
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
                borderColor: "#333",
                color: "white",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                "&:hover": {
                  borderColor: "#FF6B35",
                  bgcolor: "rgba(255, 107, 53, 0.1)",
                },
              }}
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

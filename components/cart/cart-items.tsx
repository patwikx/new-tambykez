"use client"

import { useState, useTransition } from "react"
import { Box, Typography, IconButton, TextField, Avatar, Card, CardContent } from "@mui/material"
import { Add, Remove, Delete, Favorite, FavoriteBorder } from "@mui/icons-material"
import Link from "next/link"
import { updateCartQuantity, removeFromCart, type CartItemWithDetails } from "@/lib/actions/cart-actions"
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist-actions"
import { toast } from "sonner"

interface CartItemProps {
  item: CartItemWithDetails
  onUpdate: () => void
  isInWishlist?: boolean
}

export default function CartItem({ item, onUpdate, isInWishlist = false }: CartItemProps) {
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist)
  const [isPending, startTransition] = useTransition()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return

    startTransition(async () => {
      const result = await updateCartQuantity(item.id, newQuantity)
      if (result.success) {
        onUpdate()
      } else {
        toast.error(result.error || "Failed to update quantity")
      }
    })
  }

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromCart(item.id)
      if (result.success) {
        onUpdate()
        toast.success("Item removed from cart")
      } else {
        toast.error(result.error || "Failed to remove item")
      }
    })
  }

  const handleWishlistToggle = () => {
    startTransition(async () => {
      const result = isWishlisted
        ? await removeFromWishlist(item.productVariant.product.id)
        : await addToWishlist(item.productVariant.product.id)

      if (result.success) {
        setIsWishlisted(!isWishlisted)
        toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
      } else {
        toast.error(result.error || "Failed to update wishlist")
      }
    })
  }

  const totalPrice = item.productVariant.price * item.quantity
  const hasDiscount =
    item.productVariant.compareAtPrice && item.productVariant.compareAtPrice > item.productVariant.price

  return (
    <Card
      sx={{
        bgcolor: "#111111",
        border: "1px solid #333",
        borderRadius: 2,
        mb: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Product Image */}
          <Link href={`/products/${item.productVariant.product.slug}`}>
            <Avatar
              variant="rounded"
              src={item.productVariant.product.images[0]?.url || "/motorcycle-gear.jpg"}
              alt={item.productVariant.product.name}
              sx={{
                width: { xs: 80, sm: 120 },
                height: { xs: 80, sm: 120 },
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            />
          </Link>

          {/* Product Details */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#FF6B35",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1,
              }}
            >
              {item.productVariant.product.brand.name}
            </Typography>

            <Link href={`/products/${item.productVariant.product.slug}`} style={{ textDecoration: "none" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "white",
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": {
                    color: "#FF6B35",
                  },
                }}
              >
                {item.productVariant.product.name}
              </Typography>
            </Link>

            {/* Variant Information */}
            {(item.productVariant.size || item.productVariant.color) && (
              <Typography variant="body2" sx={{ color: "#999", mb: 2 }}>
                {[item.productVariant.size, item.productVariant.color].filter(Boolean).join(" • ")}
              </Typography>
            )}

            {/* Stock Status */}
            <Box sx={{ mb: 2 }}>
              {item.productVariant.inventory > 0 ? (
                <Typography variant="body2" sx={{ color: "#4ade80" }}>
                  ✓ In Stock ({item.productVariant.inventory} available)
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: "#ef4444" }}>
                  ✗ Out of Stock
                </Typography>
              )}
            </Box>

            {/* Price and Actions */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
              }}
            >
              {/* Price */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#FF6B35" }}>
                    ${item.productVariant.price}
                  </Typography>
                  {hasDiscount && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        textDecoration: "line-through",
                      }}
                    >
                      ${item.productVariant.compareAtPrice}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "white" }}>
                  Total: ${totalPrice.toFixed(2)}
                </Typography>
              </Box>

              {/* Quantity and Actions */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Quantity Controls */}
                <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #333", borderRadius: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={isPending || item.quantity <= 1}
                    sx={{ color: "white" }}
                  >
                    <Remove />
                  </IconButton>
                  <TextField
                    value={item.quantity}
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value) || 1
                      handleQuantityChange(Math.max(1, Math.min(item.productVariant.inventory, val)))
                    }}
                    size="small"
                    disabled={isPending}
                    sx={{
                      width: 60,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" },
                        "& input": { textAlign: "center", color: "white" },
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isPending || item.quantity >= item.productVariant.inventory}
                    sx={{ color: "white" }}
                  >
                    <Add />
                  </IconButton>
                </Box>

                {/* Action Buttons */}
                <IconButton
                  onClick={handleWishlistToggle}
                  disabled={isPending}
                  sx={{
                    color: isWishlisted ? "#FF6B35" : "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 107, 53, 0.1)",
                    },
                  }}
                >
                  {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                </IconButton>

                <IconButton
                  onClick={handleRemove}
                  disabled={isPending}
                  sx={{
                    color: "#ef4444",
                    "&:hover": {
                      bgcolor: "rgba(239, 68, 68, 0.1)",
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

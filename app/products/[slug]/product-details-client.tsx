"use client"

import { useState, useTransition } from "react"
import { Box, Typography, Button, FormControl, Select, MenuItem, TextField, IconButton, Chip } from "@mui/material"
import { ShoppingCart, Favorite, FavoriteBorder, Add, Remove, Share } from "@mui/icons-material"
import { addToCart } from "@/lib/actions/cart-actions"
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist-actions"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface ProductVariant {
  id: string
  name: string
  price: number
  compareAtPrice: number | null
  inventory: number
  isDefault: boolean
  size: string | null
  color: string | null
  colorHex: string | null
}

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    variants: ProductVariant[]
  }
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { user } = useAuth()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants.find((v) => v.isDefault) || product.variants[0],
  )
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart")
      return
    }

    if (!selectedVariant) {
      toast.error("Please select a variant")
      return
    }

    startTransition(async () => {
      const result = await addToCart(selectedVariant.id, quantity)
      if (result.success) {
        toast.success("Added to cart!")
      } else {
        toast.error(result.error || "Failed to add to cart")
      }
    })
  }

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please sign in to manage wishlist")
      return
    }

    startTransition(async () => {
      const result = isWishlisted ? await removeFromWishlist(product.id) : await addToWishlist(product.id)

      if (result.success) {
        setIsWishlisted(!isWishlisted)
        toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
      } else {
        toast.error(result.error || "Failed to update wishlist")
      }
    })
  }

  const uniqueSizes = [...new Set(product.variants.map((v) => v.size).filter((s): s is string => s !== null))]
  const uniqueColors = [...new Set(product.variants.map((v) => v.color).filter((c): c is string => c !== null))]

  return (
    <Box>
      {/* Variant Selection */}
      {uniqueSizes.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: "#333", mb: 2, fontWeight: 600 }}>
            Kit Type
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={selectedVariant?.size || ""}
              onChange={(e) => {
                const variant = product.variants.find((v) => v.size === (e.target.value as string))
                if (variant) setSelectedVariant(variant)
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#DC143C",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#DC143C",
                },
              }}
            >
              {uniqueSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {uniqueColors.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: "#333", mb: 2, fontWeight: 600 }}>
            Color
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {uniqueColors.map((color) => {
              const colorVariant = product.variants.find((v) => v.color === color)
              return (
                <Button
                  key={color}
                  variant={selectedVariant?.color === color ? "contained" : "outlined"}
                  onClick={() => {
                    if (colorVariant) setSelectedVariant(colorVariant)
                  }}
                  sx={{
                    minWidth: "auto",
                    px: 3,
                    py: 1,
                    color: selectedVariant?.color === color ? "white" : "#666",
                    borderColor: selectedVariant?.color === color ? "#DC143C" : "#e0e0e0",
                    bgcolor: selectedVariant?.color === color ? "#DC143C" : "transparent",
                    "&:hover": {
                      borderColor: "#DC143C",
                      bgcolor: selectedVariant?.color === color ? "#B91C3C" : "rgba(220, 20, 60, 0.1)",
                    },
                  }}
                >
                  {color}
                </Button>
              )
            })}
          </Box>
        </Box>
      )}

      {/* Stock Status */}
      <Box sx={{ mb: 3 }}>
        {selectedVariant?.inventory > 0 ? (
          <Chip
            label={`✓ In Stock (${selectedVariant.inventory} available)`}
            sx={{
              bgcolor: "#4ade80",
              color: "white",
              fontWeight: 600,
            }}
          />
        ) : (
          <Chip
            label="✗ Out of Stock"
            sx={{
              bgcolor: "#ef4444",
              color: "white",
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      {/* Quantity Selector */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        <Typography variant="body1" sx={{ color: "#333", fontWeight: 600 }}>
          Quantity:
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            bgcolor: "#f8f9fa",
          }}
        >
          <IconButton
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            sx={{
              color: "#666",
              "&:hover": { color: "#DC143C" },
              "&:disabled": { color: "#ccc" },
            }}
          >
            <Remove />
          </IconButton>
          <TextField
            value={quantity}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value) || 1
              setQuantity(Math.max(1, Math.min(selectedVariant?.inventory || 1, val)))
            }}
            sx={{
              width: 80,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
                "& input": { textAlign: "center", color: "#333", fontWeight: 600 },
              },
            }}
          />
          <IconButton
            onClick={() => setQuantity(Math.min(selectedVariant?.inventory || 1, quantity + 1))}
            disabled={quantity >= (selectedVariant?.inventory || 1)}
            sx={{
              color: "#666",
              "&:hover": { color: "#DC143C" },
              "&:disabled": { color: "#ccc" },
            }}
          >
            <Add />
          </IconButton>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={isPending || !selectedVariant || selectedVariant.inventory <= 0}
          sx={{
            flex: 1,
            bgcolor: "#DC143C",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            py: 1.5,
            "&:hover": {
              bgcolor: "#B91C3C",
            },
            "&:disabled": {
              bgcolor: "#ccc",
              color: "#666",
            },
          }}
        >
          {!selectedVariant || selectedVariant.inventory <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
        </Button>
        <IconButton
          onClick={handleWishlistToggle}
          disabled={isPending}
          sx={{
            border: "1px solid #e0e0e0",
            color: isWishlisted ? "#DC143C" : "#666",
            "&:hover": {
              borderColor: "#DC143C",
              bgcolor: "rgba(220, 20, 60, 0.1)",
              color: "#DC143C",
            },
          }}
        >
          {isWishlisted ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <IconButton
          sx={{
            border: "1px solid #e0e0e0",
            color: "#666",
            "&:hover": {
              borderColor: "#DC143C",
              bgcolor: "rgba(220, 20, 60, 0.1)",
              color: "#DC143C",
            },
          }}
        >
          <Share />
        </IconButton>
      </Box>
    </Box>
  )
}

"use client"

import { useState, useTransition } from "react"
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  IconButton,
  Chip,
  Skeleton,
} from "@mui/material"
import { ShoppingCart, Favorite, FavoriteBorder, Visibility } from "@mui/icons-material"
import Link from "next/link"
import { addToCart } from "@/lib/actions/cart-actions"
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist-actions"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    description: string | null
    variants: {
      id: string
      price: number
      compareAtPrice: number | null
      inventory: number
      isDefault: boolean
    }[]
    images: string[]
    rating: number
    reviewCount: number
    brand: {
      name: string
    }
    categories: {
      name: string
    }[]
    isNew: boolean
  }
  isInWishlist?: boolean
  showQuickActions?: boolean
  size?: "small" | "medium" | "large"
}

export default function ProductCard({
  product,
  isInWishlist = false,
  showQuickActions = true,
  size = "medium",
}: ProductCardProps) {
  const { user } = useAuth()
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist)
  const [isPending, startTransition] = useTransition()

  const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0]
  const hasDiscount = defaultVariant?.compareAtPrice && defaultVariant.compareAtPrice > defaultVariant.price
  const discountPercentage = hasDiscount
    ? Math.round(((defaultVariant.compareAtPrice! - defaultVariant.price) / defaultVariant.compareAtPrice!) * 100)
    : 0

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart")
      return
    }

    if (!defaultVariant) {
      toast.error("Product variant not available")
      return
    }

    startTransition(async () => {
      const result = await addToCart(defaultVariant.id, 1)
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

  const cardHeight = size === "small" ? 380 : size === "large" ? 480 : 420
  const imageHeight = size === "small" ? 200 : size === "large" ? 280 : 240

  return (
    <Card
      sx={{
        height: cardHeight,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        bgcolor: "white",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: "#DC143C",
          boxShadow: "0 8px 25px rgba(220, 20, 60, 0.15)",
        },
      }}
    >
      {/* Product Image */}
      <Box sx={{ position: "relative" }}>
        <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
          <CardMedia
            component="img"
            height={imageHeight}
            image={product.images[0] || "/professional-equipment.jpg"}
            alt={product.name}
            sx={{ objectFit: "cover" }}
          />
        </Link>

        {/* Badges */}
        <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 1 }}>
          {product.isNew && (
            <Chip
              label="NEW"
              size="small"
              sx={{
                bgcolor: "#DC143C",
                color: "white",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            />
          )}
          {hasDiscount && (
            <Chip
              label={`-${discountPercentage}%`}
              size="small"
              sx={{
                bgcolor: "#e53e3e",
                color: "white",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            />
          )}
          {defaultVariant?.inventory <= 5 && defaultVariant?.inventory > 0 && (
            <Chip
              label="LOW STOCK"
              size="small"
              sx={{
                bgcolor: "#f56500",
                color: "white",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            />
          )}
        </Box>

        {/* Quick Actions */}
        {showQuickActions && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              opacity: 0,
              transition: "opacity 0.3s ease",
              ".MuiCard-root:hover &": {
                opacity: 1,
              },
            }}
          >
            <IconButton
              size="small"
              onClick={handleWishlistToggle}
              disabled={isPending}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.9)",
                color: isWishlisted ? "#DC143C" : "#666",
                "&:hover": {
                  bgcolor: "white",
                  color: "#DC143C",
                },
              }}
            >
              {isWishlisted ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton
              size="small"
              component={Link}
              href={`/products/${product.slug}`}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.9)",
                color: "#666",
                "&:hover": {
                  bgcolor: "white",
                  color: "#DC143C",
                },
              }}
            >
              <Visibility />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Product Info */}
      <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Brand */}
        <Typography
          variant="body2"
          sx={{
            color: "#DC143C",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            mb: 1,
          }}
        >
          {product.brand.name}
        </Typography>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#333",
              mb: 2,
              fontSize: size === "small" ? "0.9rem" : "0.95rem",
              lineHeight: 1.3,
              height: size === "small" ? "2.4rem" : "2.6rem",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              "&:hover": {
                color: "#DC143C",
              },
            }}
          >
            {product.name}
          </Typography>
        </Link>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Rating
            value={product.rating}
            precision={0.1}
            readOnly
            size="small"
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#DC143C",
              },
            }}
          />
          <Typography variant="body2" sx={{ color: "#666", ml: 1 }}>
            ({product.reviewCount})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#DC143C",
              fontSize: "1.1rem",
            }}
          >
            ₱{defaultVariant?.price || 0}
          </Typography>
          {hasDiscount && (
            <Typography
              variant="body2"
              sx={{
                color: "#999",
                textDecoration: "line-through",
              }}
            >
              ₱{defaultVariant?.compareAtPrice}
            </Typography>
          )}
        </Box>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={isPending || !defaultVariant || defaultVariant.inventory <= 0}
          sx={{
            mt: "auto",
            bgcolor: "#DC143C",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            "&:hover": {
              bgcolor: "#B91C3C",
            },
            "&:disabled": {
              bgcolor: "#ccc",
              color: "#666",
            },
          }}
        >
          {!defaultVariant || defaultVariant.inventory <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
        </Button>
      </CardContent>
    </Card>
  )
}

// Loading skeleton component
export function ProductCardSkeleton({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const cardHeight = size === "small" ? 380 : size === "large" ? 480 : 420
  const imageHeight = size === "small" ? 200 : size === "large" ? 280 : 240

  return (
    <Card
      sx={{
        height: cardHeight,
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
      }}
    >
      <Skeleton variant="rectangular" height={imageHeight} sx={{ bgcolor: "#f5f5f5" }} />
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Skeleton variant="text" width="40%" sx={{ bgcolor: "#f5f5f5", mb: 1 }} />
        <Skeleton variant="text" width="90%" sx={{ bgcolor: "#f5f5f5", mb: 2 }} />
        <Skeleton variant="text" width="60%" sx={{ bgcolor: "#f5f5f5", mb: 2 }} />
        <Skeleton variant="text" width="50%" sx={{ bgcolor: "#f5f5f5", mb: 2 }} />
        <Skeleton variant="rectangular" height={36} sx={{ bgcolor: "#f5f5f5", mt: "auto" }} />
      </CardContent>
    </Card>
  )
}

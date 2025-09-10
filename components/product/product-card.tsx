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

  const cardHeight = size === "small" ? 320 : size === "large" ? 480 : 400
  const imageHeight = size === "small" ? 180 : size === "large" ? 280 : 240

  return (
    <Card
      sx={{
        height: cardHeight,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        bgcolor: "#000000",
        border: "1px solid #333",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          borderColor: "#FF6B35",
          boxShadow: "0 20px 40px rgba(255, 107, 53, 0.2)",
        },
      }}
    >
      {/* Product Image */}
      <Box sx={{ position: "relative" }}>
        <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
          <CardMedia
            component="img"
            height={imageHeight}
            image={product.images[0] || "/motorcycle-gear.jpg"}
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
                bgcolor: "#FF6B35",
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
                bgcolor: "rgba(0, 0, 0, 0.7)",
                color: isWishlisted ? "#FF6B35" : "white",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.9)",
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
                bgcolor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.9)",
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
            color: "#FF6B35",
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
              color: "white",
              mb: 2,
              fontSize: size === "small" ? "0.9rem" : "0.95rem",
              lineHeight: 1.3,
              height: size === "small" ? "2.4rem" : "2.6rem",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              "&:hover": {
                color: "#FF6B35",
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
                color: "#FF6B35",
              },
            }}
          />
          <Typography variant="body2" sx={{ color: "#999", ml: 1 }}>
            ({product.reviewCount})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#FF6B35",
              fontSize: "1.1rem",
            }}
          >
            ${defaultVariant?.price || 0}
          </Typography>
          {hasDiscount && (
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                textDecoration: "line-through",
              }}
            >
              ${defaultVariant?.compareAtPrice}
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
            bgcolor: "#FF6B35",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            "&:hover": {
              bgcolor: "#E55A2B",
            },
            "&:disabled": {
              bgcolor: "#666",
              color: "#999",
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
  const cardHeight = size === "small" ? 320 : size === "large" ? 480 : 400
  const imageHeight = size === "small" ? 180 : size === "large" ? 280 : 240

  return (
    <Card
      sx={{
        height: cardHeight,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#111111",
        border: "1px solid #333",
        borderRadius: 2,
      }}
    >
      <Skeleton variant="rectangular" height={imageHeight} sx={{ bgcolor: "#222" }} />
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Skeleton variant="text" width="40%" sx={{ bgcolor: "#333", mb: 1 }} />
        <Skeleton variant="text" width="90%" sx={{ bgcolor: "#333", mb: 2 }} />
        <Skeleton variant="text" width="60%" sx={{ bgcolor: "#333", mb: 2 }} />
        <Skeleton variant="text" width="50%" sx={{ bgcolor: "#333", mb: 2 }} />
        <Skeleton variant="rectangular" height={36} sx={{ bgcolor: "#333", mt: "auto" }} />
      </CardContent>
    </Card>
  )
}

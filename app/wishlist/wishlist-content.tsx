"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Button } from "@mui/material"
import { Favorite, ArrowForward } from "@mui/icons-material"
import Link from "next/link"
import { getWishlistItems, type WishlistItemWithDetails } from "@/lib/actions/wishlist-actions"
import ProductGrid from "@/components/product/product-grid"
import { useAuth } from "@/hooks/use-auth"

export default function WishlistContent() {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItemWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadWishlist()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadWishlist = async () => {
    try {
      const items = await getWishlistItems()
      setWishlistItems(items)
    } catch (error) {
      console.error("Error loading wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Favorite sx={{ fontSize: 120, color: "#666", mb: 4 }} />
        <Typography variant="h4" sx={{ color: "#666", mb: 2, fontWeight: 700 }}>
          Sign in to view your wishlist
        </Typography>
        <Typography variant="body1" sx={{ color: "#999", mb: 4, maxWidth: 400, mx: "auto" }}>
          Save your favorite motorcycle gear and accessories for later by signing in to your account.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/auth/signin"
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
          Sign In
        </Button>
      </Box>
    )
  }

  if (loading) {
    return <ProductGrid products={[]} loading={true} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} />
  }

  if (wishlistItems.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Favorite sx={{ fontSize: 120, color: "#666", mb: 4 }} />
        <Typography variant="h4" sx={{ color: "#666", mb: 2, fontWeight: 700 }}>
          Your wishlist is empty
        </Typography>
        <Typography variant="body1" sx={{ color: "#999", mb: 4, maxWidth: 400, mx: "auto" }}>
          Start browsing our collection and save your favorite items to your wishlist.
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
          Start Shopping
        </Button>
      </Box>
    )
  }

  // Transform wishlist items to match ProductGrid expected format
  const products = wishlistItems.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    description: null,
    variants: item.product.variants,
    images: item.product.images.map((img) => img.url),
    rating: item.product.rating,
    reviewCount: item.product.reviewCount,
    brand: item.product.brand,
    categories: [],
    isNew: false,
  }))

  return (
    <ProductGrid products={products} loading={false} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} showQuickActions={true} />
  )
}

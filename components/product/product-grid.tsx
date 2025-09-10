"use client"

import { Box, Typography, Container } from "@mui/material"
import ProductCard, { ProductCardSkeleton } from "./product-card"

interface Product {
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

interface ProductGridProps {
  products: Product[]
  title?: string
  loading?: boolean
  columns?: { xs: number; sm: number; md: number; lg: number }
  showQuickActions?: boolean
  size?: "small" | "medium" | "large"
}

export default function ProductGrid({
  products,
  title,
  loading = false,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  showQuickActions = true,
  size = "medium",
}: ProductGridProps) {
  if (loading) {
    return (
      <Container maxWidth="lg">
        {title && (
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 900,
              textAlign: "center",
              mb: 6,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "white",
            }}
          >
            {title}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
          }}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: `1 1 calc(100% / ${columns.xs} - 12px)`,
                  sm: `1 1 calc(100% / ${columns.sm} - 12px)`,
                  md: `1 1 calc(100% / ${columns.md} - 12px)`,
                  lg: `1 1 calc(100% / ${columns.lg} - 12px)`,
                },
                minWidth: 280,
                maxWidth: 350,
              }}
            >
              <ProductCardSkeleton size={size} />
            </Box>
          ))}
        </Box>
      </Container>
    )
  }

  if (products.length === 0) {
    return (
      <Container maxWidth="lg">
        {title && (
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 900,
              textAlign: "center",
              mb: 6,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "white",
            }}
          >
            {title}
          </Typography>
        )}
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" sx={{ color: "#666", mb: 2 }}>
            No products found
          </Typography>
          <Typography variant="body1" sx={{ color: "#999" }}>
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      {title && (
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 900,
            textAlign: "center",
            mb: 6,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "white",
          }}
        >
          {title}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {products.map((product) => (
          <Box
            key={product.id}
            sx={{
              flex: {
                xs: `1 1 calc(100% / ${columns.xs} - 12px)`,
                sm: `1 1 calc(100% / ${columns.sm} - 12px)`,
                md: `1 1 calc(100% / ${columns.md} - 12px)`,
                lg: `1 1 calc(100% / ${columns.lg} - 12px)`,
              },
              minWidth: 280,
              maxWidth: 350,
            }}
          >
            <ProductCard product={product} showQuickActions={showQuickActions} size={size} />
          </Box>
        ))}
      </Box>
    </Container>
  )
}

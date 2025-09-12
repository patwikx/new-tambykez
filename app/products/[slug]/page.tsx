import { Container, Box, Typography, Button, Rating, Chip } from "@mui/material"
import { ArrowBack, LocalShipping, Security, Support } from "@mui/icons-material"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import ProductDetailClient from "./product-details-client"


// Mock function to get product by slug - replace with actual data fetching
async function getProductBySlug(slug: string) {
  // This would typically fetch from your database
  // For now, returning mock data
  const mockProduct = {
    id: slug,
    name: "Professional Power Drill Set",
    slug: slug,
    description:
      "High-performance professional power drill with comprehensive bit set. Perfect for construction, woodworking, and general maintenance tasks. Features variable speed control, LED work light, and ergonomic design for extended use.",
    shortDescription: "Professional-grade power drill with comprehensive accessories for all your drilling needs.",
    variants: [
      {
        id: `${slug}-variant-1`,
        name: "Standard Kit",
        price: 2499,
        compareAtPrice: 2999,
        inventory: 15,
        isDefault: true,
        size: "Standard",
        color: "Black",
        colorHex: "#000000",
      },
      {
        id: `${slug}-variant-2`,
        name: "Deluxe Kit",
        price: 3299,
        compareAtPrice: 3799,
        inventory: 8,
        isDefault: false,
        size: "Deluxe",
        color: "Black",
        colorHex: "#000000",
      },
    ],
    images: ["/professional-power-drill-set.jpg", "/power-drill-accessories.jpg", "/drill-bits-set.png"],
    rating: 4.8,
    reviewCount: 127,
    brand: {
      name: "ProTools",
    },
    categories: [
      {
        name: "Power Tools",
      },
    ],
    specifications: [
      { label: "Motor Power", value: "750W" },
      { label: "Chuck Size", value: "13mm" },
      { label: "Speed Range", value: "0-1500 RPM" },
      { label: "Weight", value: "1.8kg" },
      { label: "Warranty", value: "2 Years" },
    ],
    features: [
      "Variable speed trigger for precise control",
      "LED work light illuminates work area",
      "Ergonomic grip reduces fatigue",
      "Keyless chuck for quick bit changes",
      "Includes 50-piece drill bit set",
      "Heavy-duty carrying case included",
    ],
  }

  return mockProduct
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0]
  const hasDiscount = defaultVariant?.compareAtPrice && defaultVariant.compareAtPrice > defaultVariant.price
  const discountPercentage = hasDiscount
    ? Math.round(((defaultVariant.compareAtPrice! - defaultVariant.price) / defaultVariant.compareAtPrice!) * 100)
    : 0

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Button
            component={Link}
            href="/products"
            startIcon={<ArrowBack />}
            sx={{
              color: "#666",
              textTransform: "none",
              "&:hover": {
                color: "#DC143C",
                bgcolor: "transparent",
              },
            }}
          >
            Back to Products
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 6, flexDirection: { xs: "column", lg: "row" } }}>
          {/* Product Images */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ position: "relative", mb: 3 }}>
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                }}
              />
              {hasDiscount && (
                <Chip
                  label={`-${discountPercentage}%`}
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    bgcolor: "#DC143C",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                />
              )}
            </Box>
            {product.images.length > 1 && (
              <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      minWidth: 100,
                      height: 100,
                      cursor: "pointer",
                      border: "2px solid #e0e0e0",
                      borderRadius: 2,
                      overflow: "hidden",
                      "&:hover": {
                        borderColor: "#DC143C",
                      },
                    }}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={100}
                      height={100}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Product Details */}
          <Box sx={{ flex: 1 }}>
            {/* Brand */}
            <Typography
              variant="body1"
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
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#333",
                mb: 2,
                lineHeight: 1.2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              {product.name}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Rating
                value={product.rating}
                precision={0.1}
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#DC143C",
                  },
                }}
              />
              <Typography variant="body2" sx={{ color: "#666", ml: 2 }}>
                {product.rating} ({product.reviewCount} reviews)
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#DC143C",
                }}
              >
                ₱{defaultVariant?.price.toLocaleString()}
              </Typography>
              {hasDiscount && (
                <Typography
                  variant="h6"
                  sx={{
                    color: "#999",
                    textDecoration: "line-through",
                  }}
                >
                  ₱{defaultVariant?.compareAtPrice?.toLocaleString()}
                </Typography>
              )}
              {hasDiscount && (
                <Chip
                  label={`Save ₱${((defaultVariant?.compareAtPrice || 0) - defaultVariant.price).toLocaleString()}`}
                  sx={{
                    bgcolor: "#4ade80",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>

            {/* Description */}
            <Typography variant="body1" sx={{ color: "#666", mb: 4, lineHeight: 1.7 }}>
              {product.shortDescription}
            </Typography>

            {/* Interactive Components */}
            <ProductDetailClient product={product} />

            {/* Features */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#333", mb: 3 }}>
                Key Features
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {product.features.map((feature, index) => (
                  <Typography key={index} variant="body2" sx={{ color: "#666", display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        bgcolor: "#DC143C",
                        borderRadius: "50%",
                        mr: 2,
                        flexShrink: 0,
                      }}
                    />
                    {feature}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Specifications */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#333", mb: 3 }}>
                Specifications
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {product.specifications.map((spec, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                      {spec.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333", fontWeight: 600 }}>
                      {spec.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Trust Indicators */}
        <Box sx={{ mt: 8, py: 6, bgcolor: "white", borderRadius: 2, border: "1px solid #e0e0e0" }}>
          <Container maxWidth="md">
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
              <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 30%" } }}>
                <LocalShipping sx={{ fontSize: 48, color: "#DC143C", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#333" }}>
                  FREE SHIPPING
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  On orders over ₱2500
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 30%" } }}>
                <Security sx={{ fontSize: 48, color: "#DC143C", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#333" }}>
                  2 YEAR WARRANTY
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Full manufacturer warranty
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 30%" } }}>
                <Support sx={{ fontSize: 48, color: "#DC143C", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#333" }}>
                  EXPERT SUPPORT
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Professional customer service
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Container>
    </Box>
  )
}

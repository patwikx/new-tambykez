import { Box, Container, Typography, Button, Card, CardContent, CardMedia, Rating } from "@mui/material"
import { ArrowForward, LocalShipping, Security, Support, Star, Verified, Speed } from "@mui/icons-material"
import { getFeaturedProducts, getCategories } from "@/lib/actions/products"
import Link from "next/link"
import Image from "next/image"
import HeroSection from "@/components/home/hero-section"
import FeaturedCollections from "@/components/home/featured-collections"
import TrustIndicators from "@/components/home/trust-indicators"
import FeaturedBrands from "@/components/home/featured-brands"

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([getFeaturedProducts(), getCategories()])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#000000" }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Featured Collections */}
      <FeaturedCollections categories={categories} />

      {/* Featured Brands */}
      <FeaturedBrands />

      {/* Featured Products */}
      <Box sx={{ py: 8, bgcolor: "#111111" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 900,
              textAlign: "center",
              mb: 2,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            Featured Gear
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "#999",
              fontWeight: 400,
            }}
          >
            Premium motorcycle gear trusted by riders across the Philippines
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
            {featuredProducts.slice(0, 8).map((product) => (
              <Box key={product.id} sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
                <Card
                  sx={{
                    bgcolor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#FF6B35",
                      boxShadow: "0 12px 32px rgba(255, 107, 53, 0.25)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={product.images?.[0] || "https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg?auto=compress&cs=tinysrgb&w=400"}
                      alt={product.name}
                      sx={{ objectFit: "cover" }}
                    />
                    {product.isNew && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          bgcolor: "#FF6B35",
                          color: "white",
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        NEW
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FF6B35",
                        fontWeight: 600,
                        mb: 1,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {product.brand?.name || "Premium"}
                    </Typography>
                    <Typography
                      variant="h6"
                      component={Link}
                      href={`/products/${product.id}`}
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        mb: 2,
                        fontSize: "0.95rem",
                        lineHeight: 1.3,
                        height: "2.6rem",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        textDecoration: "none",
                        "&:hover": {
                          color: "#FF6B35",
                        },
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Rating
                        value={product.rating || 0}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#FF6B35",
                          fontSize: "1.1rem",
                        }}
                      >
                        ₱
                        {product.variants?.find((v) => v.isDefault)?.price.toLocaleString() ||
                          product.variants?.[0]?.price.toLocaleString() ||
                          0}
                      </Typography>
                      {product.variants?.find((v) => v.isDefault)?.compareAtPrice && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            textDecoration: "line-through",
                          }}
                        >
                          ₱{product.variants.find((v) => v.isDefault)?.compareAtPrice?.toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              component={Link}
              href="/products"
              sx={{
                borderColor: "#FF6B35",
                color: "#FF6B35",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#FF6B35",
                  bgcolor: "rgba(255, 107, 53, 0.1)",
                },
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box sx={{ py: 8, bgcolor: "#FF6B35" }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                fontWeight: 900,
                color: "white",
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              Ride Safe, Ride Smart
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                mb: 4,
                opacity: 0.9,
                fontWeight: 400,
              }}
            >
              Get the latest gear updates, safety tips, and exclusive offers for Filipino riders.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#000000",
                color: "white",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  bgcolor: "#111111",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Subscribe Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
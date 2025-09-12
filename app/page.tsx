import { Box, Container, Typography, Button, Card, CardContent, CardMedia, Rating, Grid } from "@mui/material"
import { ArrowForward, LocalShipping, Security, Support, Star, Phone, Email, LocationOn } from "@mui/icons-material"
import { getFeaturedProducts, getCategories } from "@/lib/actions/products"
import Link from "next/link"
import Image from "next/image"

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([getFeaturedProducts(), getCategories()])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff" }}>
      {/* Hero Section - Regina Style */}
      <Box
        sx={{
          position: "relative",
          height: "80vh",
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Box sx={{ flex: 1, color: "white" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  mb: 3,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Professional Equipment & Supplies
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  fontWeight: 400,
                  lineHeight: 1.5,
                  mb: 4,
                  opacity: 0.95,
                }}
              >
                Your trusted partner for quality industrial equipment, safety supplies, and professional tools. 
                Serving businesses with excellence since 1985.
              </Typography>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  component={Link}
                  href="/products"
                  sx={{
                    bgcolor: "#dc2626",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                    "&:hover": {
                      bgcolor: "#b91c1c",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(220, 38, 38, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/catalog"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: "#dc2626",
                      bgcolor: "#dc2626",
                      color: "white",
                    },
                  }}
                >
                  Request Quote
                </Button>
              </Box>
            </Box>
            <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
              <Image
                src="https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Professional Equipment"
                width={600}
                height={400}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Trust Indicators */}
      <Box sx={{ py: 6, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <LocalShipping sx={{ fontSize: 48, color: "#dc2626", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1f2937" }}>
                FREE SHIPPING
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                On orders over $500
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <Security sx={{ fontSize: 48, color: "#dc2626", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1f2937" }}>
                SECURE ORDERING
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                SSL encrypted checkout
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <Support sx={{ fontSize: 48, color: "#dc2626", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1f2937" }}>
                EXPERT SUPPORT
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Professional consultation
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <Star sx={{ fontSize: 48, color: "#dc2626", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1f2937" }}>
                QUALITY BRANDS
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Authorized distributor
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              textAlign: "center",
              mb: 2,
              color: "#1f2937",
            }}
          >
            Shop by Category
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "#6b7280",
              fontSize: "1.1rem",
            }}
          >
            Find exactly what you need from our comprehensive selection
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
            {categories.map((category) => (
              <Box key={category.id} sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 30%" } }}>
                <Card
                  component={Link}
                  href={`/categories/${category.id}`}
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    height: "100%",
                    textDecoration: "none",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#dc2626",
                      boxShadow: "0 12px 32px rgba(220, 38, 38, 0.15)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image || "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400"}
                    alt={category.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#1f2937",
                        mb: 1,
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
                      {category.description || "Professional grade equipment and supplies"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#dc2626", fontWeight: 600 }}>
                      {category.productCount} products →
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ py: 8, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              textAlign: "center",
              mb: 2,
              color: "#1f2937",
            }}
          >
            Featured Products
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "#6b7280",
              fontSize: "1.1rem",
            }}
          >
            Top-quality equipment trusted by professionals
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
            {featuredProducts.map((product) => (
              <Box key={product.id} sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
                <Card
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#dc2626",
                      boxShadow: "0 12px 32px rgba(220, 38, 38, 0.15)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={product.images?.[0] || "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400"}
                      alt={product.name}
                      sx={{ objectFit: "cover" }}
                    />
                    {product.isNew && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          bgcolor: "#dc2626",
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
                        color: "#dc2626",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {product.brand?.name || "Professional"}
                    </Typography>
                    <Typography
                      variant="h6"
                      component={Link}
                      href={`/products/${product.id}`}
                      sx={{
                        fontWeight: 600,
                        color: "#1f2937",
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
                          color: "#dc2626",
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
                            color: "#fbbf24",
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#6b7280", ml: 1 }}>
                        ({product.reviewCount})
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#dc2626",
                          fontSize: "1.1rem",
                        }}
                      >
                        $
                        {product.variants?.find((v) => v.isDefault)?.price ||
                          product.variants?.[0]?.price.toFixed(2) ||
                          0}
                      </Typography>
                      {product.variants?.find((v) => v.isDefault)?.compareAtPrice && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#9ca3af",
                            textDecoration: "line-through",
                          }}
                        >
                          ${product.variants.find((v) => v.isDefault)?.compareAtPrice}
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
                borderColor: "#dc2626",
                color: "#dc2626",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#dc2626",
                  bgcolor: "rgba(220, 38, 38, 0.1)",
                },
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Company Info Section */}
      <Box sx={{ py: 8, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 50%" } }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  fontWeight: 700,
                  color: "#1f2937",
                  mb: 3,
                }}
              >
                Trusted by Professionals Since 1985
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#6b7280",
                  mb: 4,
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                }}
              >
                For nearly four decades, we've been the go-to source for quality industrial equipment, 
                safety supplies, and professional tools. Our commitment to excellence and customer service 
                has made us a trusted partner for businesses across the region.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Phone sx={{ color: "#dc2626" }} />
                  <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 500 }}>
                    (555) 123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Email sx={{ color: "#dc2626" }} />
                  <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 500 }}>
                    info@professionalequipment.com
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocationOn sx={{ color: "#dc2626" }} />
                  <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 500 }}>
                    123 Industrial Blvd, Business City, ST 12345
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 50%" } }}>
              <Image
                src="https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Our Facility"
                width={600}
                height={400}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box sx={{ py: 8, bgcolor: "#1e3a8a" }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                fontWeight: 700,
                color: "white",
                mb: 2,
              }}
            >
              Stay Updated
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
              Get the latest product updates, industry insights, and exclusive offers delivered to your inbox.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#dc2626",
                color: "white",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                "&:hover": {
                  bgcolor: "#b91c1c",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(220, 38, 38, 0.4)",
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
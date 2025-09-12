import { Box, Container, Typography, Button, Card, CardContent, CardMedia, Rating } from "@mui/material"
import { ArrowForward, LocalShipping, Security, Support, Star } from "@mui/icons-material"
import { getFeaturedProducts, getCategories } from "@/lib/actions/products"
import Link from "next/link"

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([getFeaturedProducts(), getCategories()])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: "70vh",
          backgroundImage:
            "url(/placeholder.svg?height=800&width=1200&query=professional business equipment and tools)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ maxWidth: 600 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                mb: 3,
                color: "white",
                textTransform: "uppercase",
              }}
            >
              PROFESSIONAL EQUIPMENT
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                fontWeight: 400,
                lineHeight: 1.5,
                mb: 4,
                color: "white",
                opacity: 0.9,
              }}
            >
              Quality tools and equipment from trusted brands. Professional solutions for every industry need.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                component={Link}
                href="/products"
                sx={{
                  bgcolor: "#DC143C",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  "&:hover": {
                    bgcolor: "#B91C3C",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                SHOP NOW
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
                  "&:hover": {
                    borderColor: "#DC143C",
                    color: "#DC143C",
                    bgcolor: "rgba(220, 20, 60, 0.1)",
                  },
                }}
              >
                VIEW CATALOG
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <LocalShipping sx={{ fontSize: 48, color: "#DC143C", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textTransform: "uppercase", color: "#333" }}>
                FREE SHIPPING
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                On orders over ₱2500
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <Security sx={{ fontSize: 48, color: "#DC143C", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textTransform: "uppercase", color: "#333" }}>
                SECURE PAYMENT
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                100% secure checkout
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <Support sx={{ fontSize: 48, color: "#DC143C", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textTransform: "uppercase", color: "#333" }}>
                EXPERT SUPPORT
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Professional customer service
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <Star sx={{ fontSize: 48, color: "#DC143C", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textTransform: "uppercase", color: "#333" }}>
                QUALITY BRANDS
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Authorized dealer
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8, bgcolor: "#f8f9fa" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              textAlign: "center",
              mb: 6,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "#333",
            }}
          >
            SHOP BY CATEGORY
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
            {categories.map((category) => (
              <Box key={category.id} sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 30%" } }}>
                <Card
                  component={Link}
                  href={`/categories/${category.id}`}
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    height: "100%",
                    textDecoration: "none",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#DC143C",
                      boxShadow: "0 8px 25px rgba(220, 20, 60, 0.15)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image || "/placeholder-onpo7.png"}
                    alt={category.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 1,
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {category.productCount} products
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ py: 8, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              textAlign: "center",
              mb: 6,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "#333",
            }}
          >
            FEATURED PRODUCTS
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
            {featuredProducts.map((product) => (
              <Box key={product.id} sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
                <Card
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#DC143C",
                      boxShadow: "0 8px 25px rgba(220, 20, 60, 0.15)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={product.images?.[0] || "/placeholder-3qhpg.png"}
                      alt={product.name}
                      sx={{ objectFit: "cover" }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
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
                      {product.brand?.name || "Brand"}
                    </Typography>
                    <Typography
                      variant="h6"
                      component={Link}
                      href={`/products/${product.id}`}
                      sx={{
                        fontWeight: 600,
                        color: "#333",
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
                          color: "#DC143C",
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
                            color: "#DC143C",
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#666", ml: 1 }}>
                        ({product.reviewCount})
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#DC143C",
                          fontSize: "1.1rem",
                        }}
                      >
                        ₱
                        {product.variants?.find((v) => v.isDefault)?.price ||
                          product.variants?.[0]?.price.toFixed(2) ||
                          0}
                      </Typography>
                      {product.variants?.find((v) => v.isDefault)?.compareAtPrice && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#999",
                            textDecoration: "line-through",
                          }}
                        >
                          ₱{product.variants.find((v) => v.isDefault)?.compareAtPrice}
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
                borderColor: "#DC143C",
                color: "#DC143C",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                "&:hover": {
                  borderColor: "#DC143C",
                  bgcolor: "rgba(220, 20, 60, 0.1)",
                },
              }}
            >
              VIEW ALL PRODUCTS
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box sx={{ py: 8, bgcolor: "#DC143C" }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                fontWeight: 700,
                color: "white",
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              STAY UPDATED
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
              Get the latest product updates, exclusive deals, and industry insights delivered to your inbox.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "#DC143C",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              SUBSCRIBE NOW
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

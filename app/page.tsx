import { Box, Container, Typography, Button, Card, CardContent, CardMedia, Rating } from "@mui/material"
import { ArrowForward, LocalShipping, Security, Support, Star } from "@mui/icons-material"
import { getFeaturedProducts, getCategories } from "@/lib/actions/products"

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([getFeaturedProducts(), getCategories()])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#000000", color: "white" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: "80vh",
          backgroundImage: "url(/placeholder.svg?height=800&width=1200&query=motorcycle rider on dark road with gear)",
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
            backgroundColor: "rgba(0, 0, 0, 0.6)",
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
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                mb: 3,
                textTransform: "uppercase",
              }}
            >
              GEAR UP FOR THE RIDE
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                fontWeight: 400,
                lineHeight: 1.5,
                mb: 4,
                opacity: 0.9,
              }}
            >
              Premium motorcycle gear from the world&apos;s leading brands. Protection, performance, and style for every
              rider.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: "#FF6B35",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  "&:hover": {
                    bgcolor: "#E55A2B",
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
                    borderColor: "#FF6B35",
                    color: "#FF6B35",
                    bgcolor: "rgba(255, 107, 53, 0.1)",
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
      <Box sx={{ py: 6, bgcolor: "#111111" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <LocalShipping sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textTransform: "uppercase" }}>
                FREE SHIPPING
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                On orders over ₱99
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <Security sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textTransform: "uppercase" }}>
                SECURE PAYMENT
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                100% secure checkout
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <Support sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textTransform: "uppercase" }}>
                24/7 SUPPORT
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Expert customer service
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
              <Star sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textTransform: "uppercase" }}>
                PREMIUM BRANDS
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Authorized dealer
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 900,
              textAlign: "center",
              mb: 6,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            SHOP BY CATEGORY
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
            {categories.map((category) => (
              <Box key={category.id} sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 30%" } }}>
                <Card
                  sx={{
                    bgcolor: "#111111",
                    border: "1px solid #333",
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: "#FF6B35",
                      boxShadow: "0 20px 40px rgba(255, 107, 53, 0.2)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image || "/motorcycle-gear-category.jpg"}
                    alt={category.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "white",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 1,
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#999" }}>
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
      <Box sx={{ py: 8, bgcolor: "#111111" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 900,
              textAlign: "center",
              mb: 6,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            FEATURED PRODUCTS
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
            {featuredProducts.map((product) => (
              <Box key={product.id} sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
                <Card
                  sx={{
                    bgcolor: "#000000",
                    border: "1px solid #333",
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: "#FF6B35",
                      boxShadow: "0 20px 40px rgba(255, 107, 53, 0.2)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={product.images?.[0] || "/motorcycle-gear-product.jpg"}
                      alt={product.name}
                      sx={{ objectFit: "cover" }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
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
                      {product.brand?.name || "Brand"}
                    </Typography>
                    <Typography
                      variant="h6"
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
                        ₱{product.variants?.find((v) => v.isDefault)?.price || product.variants?.[0]?.price.toFixed(2) || 0}
                      </Typography>
                      {product.variants?.find((v) => v.isDefault)?.compareAtPrice && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
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
              sx={{
                borderColor: "#FF6B35",
                color: "#FF6B35",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                "&:hover": {
                  borderColor: "#FF6B35",
                  bgcolor: "rgba(255, 107, 53, 0.1)",
                },
              }}
            >
              VIEW ALL PRODUCTS
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
              STAY IN THE LOOP
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
              Get the latest gear updates, exclusive deals, and riding tips delivered to your inbox.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "#FF6B35",
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

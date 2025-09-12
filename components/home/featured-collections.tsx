"use client"

import { Box, Container, Typography, Card, CardContent, CardMedia } from "@mui/material"
import Link from "next/link"
import type { CategoryWithCount } from "@/lib/actions/products"

interface FeaturedCollectionsProps {
  categories: CategoryWithCount[]
}

export default function FeaturedCollections({ categories }: FeaturedCollectionsProps) {
  const categoryImages: Record<string, string> = {
    "Helmets": "https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg?auto=compress&cs=tinysrgb&w=400",
    "Jackets": "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=400",
    "Gloves": "https://images.pexels.com/photos/6386956/pexels-photo-6386956.jpeg?auto=compress&cs=tinysrgb&w=400",
    "Boots": "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400",
    "Pants": "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=400",
    "Protection": "https://images.pexels.com/photos/6386956/pexels-photo-6386956.jpeg?auto=compress&cs=tinysrgb&w=400",
    "Accessories": "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400",
  }

  return (
    <Box sx={{ py: 8, bgcolor: "#000000" }}>
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
          Shop by Category
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
          Find the perfect gear for every part of your ride
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
          {categories.slice(0, 6).map((category) => (
            <Box key={category.id} sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 30%" } }}>
              <Card
                component={Link}
                href={`/categories/${category.id}`}
                sx={{
                  bgcolor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  height: "100%",
                  textDecoration: "none",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "#FF6B35",
                    boxShadow: "0 12px 32px rgba(255, 107, 53, 0.25)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image || categoryImages[category.name] || "https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg?auto=compress&cs=tinysrgb&w=400"}
                  alt={category.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      mb: 1,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#999", mb: 2 }}>
                    {category.description || "Premium motorcycle gear for safety and performance"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#FF6B35", fontWeight: 600 }}>
                    {category.productCount} products →
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
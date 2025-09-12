"use client"

import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material"
import Link from "next/link"

const collections = [
  {
    id: "racing-collection",
    name: "Racing Collection",
    description: "Professional racing gear for track enthusiasts",
    image: "https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 45,
    slug: "racing"
  },
  {
    id: "touring-collection",
    name: "Touring Collection",
    description: "Comfort and protection for long-distance rides",
    image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 38,
    slug: "touring"
  },
  {
    id: "adventure-collection",
    name: "Adventure Collection",
    description: "Rugged gear for off-road adventures",
    image: "https://images.pexels.com/photos/6386956/pexels-photo-6386956.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 52,
    slug: "adventure"
  },
  {
    id: "urban-collection",
    name: "Urban Collection",
    description: "Stylish gear for city commuting",
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 29,
    slug: "urban"
  },
  {
    id: "vintage-collection",
    name: "Vintage Collection",
    description: "Classic style meets modern protection",
    image: "https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 24,
    slug: "vintage"
  },
  {
    id: "women-collection",
    name: "Women's Collection",
    description: "Gear designed specifically for female riders",
    image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 33,
    slug: "women"
  }
]

export default function CollectionsGrid() {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
      {collections.map((collection) => (
        <Box key={collection.id} sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 30%" } }}>
          <Card
            component={Link}
            href={`/collections/${collection.slug}`}
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
              height="250"
              image={collection.image}
              alt={collection.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  mb: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {collection.name}
              </Typography>
              <Typography variant="body1" sx={{ color: "#999", mb: 3, lineHeight: 1.6 }}>
                {collection.description}
              </Typography>
              <Typography variant="body2" sx={{ color: "#FF6B35", fontWeight: 600 }}>
                {collection.productCount} products →
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  )
}
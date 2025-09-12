"use client"

import { Box, Container, Typography, Card, CardContent } from "@mui/material"
import Link from "next/link"
import Image from "next/image"

const featuredBrands = [
  {
    name: "Shoei",
    description: "Premium Japanese helmets",
    logo: "https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg?auto=compress&cs=tinysrgb&w=200&h=100",
    slug: "shoei"
  },
  {
    name: "Alpinestars",
    description: "Racing gear & protection",
    logo: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=200&h=100",
    slug: "alpinestars"
  },
  {
    name: "Dainese",
    description: "Italian leather specialists",
    logo: "https://images.pexels.com/photos/6386956/pexels-photo-6386956.jpeg?auto=compress&cs=tinysrgb&w=200&h=100",
    slug: "dainese"
  },
  {
    name: "AGV",
    description: "MotoGP proven helmets",
    logo: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=200&h=100",
    slug: "agv"
  },
  {
    name: "REV'IT!",
    description: "Dutch engineering excellence",
    logo: "https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg?auto=compress&cs=tinysrgb&w=200&h=100",
    slug: "revit"
  },
  {
    name: "Klim",
    description: "Adventure riding gear",
    logo: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=200&h=100",
    slug: "klim"
  }
]

export default function FeaturedBrands() {
  return (
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
          Premium Brands
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
          Authorized dealer of the world's finest motorcycle gear brands
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
          {featuredBrands.map((brand) => (
            <Box key={brand.slug} sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 30%" } }}>
              <Card
                component={Link}
                href={`/brands/${brand.slug}`}
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
                <Box
                  sx={{
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#222",
                    borderBottom: "1px solid #333",
                  }}
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={120}
                    height={60}
                    style={{
                      maxWidth: "120px",
                      maxHeight: "60px",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
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
                    {brand.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#999" }}>
                    {brand.description}
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
"use client"

import { Box, Container, Typography, Button } from "@mui/material"
import { ArrowForward, Security, Speed, LocalShipping } from "@mui/icons-material"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        height: "90vh",
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg?auto=compress&cs=tinysrgb&w=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          zIndex: 1,
        }}
      />
      
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(26,26,26,0.6) 100%)",
          zIndex: 2,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Box sx={{ flex: 1, color: "white" }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4.5rem" },
                fontWeight: 900,
                lineHeight: 1.1,
                mb: 3,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              Premium Motorcycle Gear
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.4rem" },
                fontWeight: 400,
                lineHeight: 1.5,
                mb: 4,
                opacity: 0.95,
                color: "#e5e7eb",
              }}
            >
              Ride with confidence using the finest motorcycle gear and accessories. 
              From helmets to boots, we've got everything Filipino riders need for safety and style.
            </Typography>
            
            {/* Key Features */}
            <Box sx={{ display: "flex", gap: 4, mb: 6, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Security sx={{ color: "#FF6B35", fontSize: 24 }} />
                <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                  DOT Certified
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Speed sx={{ color: "#FF6B35", fontSize: 24 }} />
                <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                  Racing Grade
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShipping sx={{ color: "#FF6B35", fontSize: 24 }} />
                <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                  Nationwide Shipping
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                component={Link}
                href="/products"
                sx={{
                  bgcolor: "#FF6B35",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
                  "&:hover": {
                    bgcolor: "#E55A2B",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(255, 107, 53, 0.5)",
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
                href="/collections"
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
                    borderColor: "#FF6B35",
                    bgcolor: "#FF6B35",
                    color: "white",
                  },
                }}
              >
                View Collections
              </Button>
            </Box>
          </Box>
          <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
            <Image
              src="https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Motorcycle Gear"
              width={600}
              height={400}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(255, 107, 53, 0.3)",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
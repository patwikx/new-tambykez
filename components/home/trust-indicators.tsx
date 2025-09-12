"use client"

import { Box, Container, Typography } from "@mui/material"
import { LocalShipping, Security, Support, Star, Verified, Speed } from "@mui/icons-material"

export default function TrustIndicators() {
  return (
    <Box sx={{ py: 6, bgcolor: "#1a1a1a" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
          <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 16%" } }}>
            <LocalShipping sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "white", textTransform: "uppercase" }}>
              FREE SHIPPING
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              On orders over ₱2,500
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 16%" } }}>
            <Security sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "white", textTransform: "uppercase" }}>
              DOT CERTIFIED
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              Safety standards compliant
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 16%" } }}>
            <Support sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "white", textTransform: "uppercase" }}>
              EXPERT SUPPORT
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              Rider consultation available
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 16%" } }}>
            <Verified sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "white", textTransform: "uppercase" }}>
              AUTHENTIC GEAR
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              100% genuine products
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 16%" } }}>
            <Speed sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "white", textTransform: "uppercase" }}>
              FAST DELIVERY
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              Metro Manila same day
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 16%" } }}>
            <Star sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "white", textTransform: "uppercase" }}>
              TOP BRANDS
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              Authorized dealer
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
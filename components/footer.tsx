import { Box, Container, Typography, Link as MuiLink, IconButton, Divider } from "@mui/material"
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from "@mui/icons-material"
import Link from "next/link"

const footerLinks = {
  products: [
    { name: "Helmets", href: "/categories/helmets" },
    { name: "Jackets", href: "/categories/jackets" },
    { name: "Gloves", href: "/categories/gloves" },
    { name: "Boots", href: "/categories/boots" },
    { name: "Protection", href: "/categories/protection" },
    { name: "Accessories", href: "/categories/accessories" },
  ],
  brands: [
    { name: "Shoei", href: "/brands/shoei" },
    { name: "Alpinestars", href: "/brands/alpinestars" },
    { name: "Dainese", href: "/brands/dainese" },
    { name: "AGV", href: "/brands/agv" },
    { name: "REV'IT!", href: "/brands/revit" },
    { name: "Klim", href: "/brands/klim" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Warranty Info", href: "/warranty" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "FAQ", href: "/faq" },
    { name: "Track Order", href: "/track-order" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/story" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Reviews", href: "/reviews" },
    { name: "Store Locator", href: "/stores" },
  ],
}

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#000000", color: "white", pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {/* Company Info */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 33%" } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.02em",
                mb: 3,
                color: "#FF6B35",
                textTransform: "uppercase",
              }}
            >
              Tambykez
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6, color: "#999" }}>
              Your trusted partner for premium motorcycle gear and accessories in the Philippines. 
              Ride safe, ride in style with authentic gear from the world's top brands.
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Phone sx={{ color: "#FF6B35", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#999" }}>
                  +63 917 123 4567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Email sx={{ color: "#FF6B35", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#999" }}>
                  info@tambykez.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocationOn sx={{ color: "#FF6B35", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#999" }}>
                  Metro Manila, Philippines
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  color: "#666",
                  "&:hover": {
                    color: "#FF6B35",
                    bgcolor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{
                  color: "#666",
                  "&:hover": {
                    color: "#FF6B35",
                    bgcolor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{
                  color: "#666",
                  "&:hover": {
                    color: "#FF6B35",
                    bgcolor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{
                  color: "#666",
                  "&:hover": {
                    color: "#FF6B35",
                    bgcolor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>

          {/* Links Sections */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 66%" }, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {/* Products Links */}
            <Box sx={{ flex: { xs: "1 1 50%", md: "1 1 25%" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: "white",
                  textTransform: "uppercase",
                }}
              >
                Categories
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {footerLinks.products.map((link) => (
                  <MuiLink
                    key={link.name}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: "#999",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        color: "#FF6B35",
                      },
                      transition: "color 0.3s ease",
                    }}
                  >
                    {link.name}
                  </MuiLink>
                ))}
              </Box>
            </Box>

            {/* Brands Links */}
            <Box sx={{ flex: { xs: "1 1 50%", md: "1 1 25%" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: "white",
                  textTransform: "uppercase",
                }}
              >
                Brands
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {footerLinks.brands.map((link) => (
                  <MuiLink
                    key={link.name}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: "#999",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        color: "#FF6B35",
                      },
                      transition: "color 0.3s ease",
                    }}
                  >
                    {link.name}
                  </MuiLink>
                ))}
              </Box>
            </Box>

            {/* Support Links */}
            <Box sx={{ flex: { xs: "1 1 50%", md: "1 1 25%" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: "white",
                  textTransform: "uppercase",
                }}
              >
                Support
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {footerLinks.support.map((link) => (
                  <MuiLink
                    key={link.name}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: "#999",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        color: "#FF6B35",
                      },
                      transition: "color 0.3s ease",
                    }}
                  >
                    {link.name}
                  </MuiLink>
                ))}
              </Box>
            </Box>

            {/* Company Links */}
            <Box sx={{ flex: { xs: "1 1 50%", md: "1 1 25%" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: "white",
                  textTransform: "uppercase",
                }}
              >
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {footerLinks.company.map((link) => (
                  <MuiLink
                    key={link.name}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: "#999",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        color: "#FF6B35",
                      },
                      transition: "color 0.3s ease",
                    }}
                  >
                    {link.name}
                  </MuiLink>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: "#333" }} />

        {/* Bottom Bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="body2" sx={{ color: "#666" }}>
            © 2025 Tambykez. All rights reserved. Ride safe, ride smart.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <MuiLink
              component={Link}
              href="/privacy"
              sx={{
                color: "#666",
                textDecoration: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  color: "#FF6B35",
                },
              }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              component={Link}
              href="/terms"
              sx={{
                color: "#666",
                textDecoration: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  color: "#FF6B35",
                },
              }}
            >
              Terms of Service
            </MuiLink>
            <MuiLink
              component={Link}
              href="/shipping"
              sx={{
                color: "#666",
                textDecoration: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  color: "#FF6B35",
                },
              }}
            >
              Shipping Info
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
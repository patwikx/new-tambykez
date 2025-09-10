import { Box, Container, Typography, Link as MuiLink, IconButton, Divider } from "@mui/material"
import { Facebook, Twitter, Instagram, YouTube, Email, Phone, LocationOn } from "@mui/icons-material"
import Link from "next/link"

const footerLinks = {
  shop: [
    { name: "Helmets", href: "/categories/helmets" },
    { name: "Jackets", href: "/categories/jackets" },
    { name: "Pants", href: "/categories/pants" },
    { name: "Boots", href: "/categories/boots" },
    { name: "Gloves", href: "/categories/gloves" },
    { name: "Accessories", href: "/categories/accessories" },
  ],
  brands: [
    { name: "Alpinestars", href: "/brands/alpinestars" },
    { name: "Dainese", href: "/brands/dainese" },
    { name: "Shoei", href: "/brands/shoei" },
    { name: "Sidi", href: "/brands/sidi" },
    { name: "Rev'it", href: "/brands/revit" },
    { name: "Arai", href: "/brands/arai" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "FAQ", href: "/faq" },
    { name: "Track Order", href: "/track-order" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Reviews", href: "/reviews" },
    { name: "Affiliate Program", href: "/affiliate" },
  ],
}

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#111111", color: "white", pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {/* Company Info */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 33%" } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                mb: 3,
                color: "#FF6B35",
              }}
            >
              TAMBYKEZ
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6, color: "#ccc" }}>
              Your trusted partner for premium motorcycle gear. We provide top-quality safety equipment and accessories
              from the world&apos;s leading brands to keep you protected on every ride.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  color: "#999",
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
                  color: "#999",
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
                  color: "#999",
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
                  color: "#999",
                  "&:hover": {
                    color: "#FF6B35",
                    bgcolor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                <YouTube />
              </IconButton>
            </Box>
          </Box>

          {/* Links Sections */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 66%" }, display: "flex", flexWrap: "wrap", gap: 4 }}>
            {/* Shop Links */}
            <Box sx={{ flex: { xs: "1 1 50%", md: "1 1 25%" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  mb: 2,
                  color: "white",
                }}
              >
                SHOP
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {footerLinks.shop.map((link) => (
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
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  mb: 2,
                  color: "white",
                }}
              >
                BRANDS
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  mb: 2,
                  color: "white",
                }}
              >
                SUPPORT
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  mb: 2,
                  color: "white",
                }}
              >
                COMPANY
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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

        {/* Contact Info */}
        <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid #333" }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 33%" } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Email sx={{ color: "#FF6B35", mr: 2 }} />
                <Typography variant="body2" sx={{ color: "#ccc" }}>
                  support@tambykez.com
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 33%" } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Phone sx={{ color: "#FF6B35", mr: 2 }} />
                <Typography variant="body2" sx={{ color: "#ccc" }}>
                  1-800-TAMBYKEZ
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 33%" } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOn sx={{ color: "#FF6B35", mr: 2 }} />
                <Typography variant="body2" sx={{ color: "#ccc" }}>
                  General Santos City, Philippines
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: "#333" }} />

        {/* Bottom Bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="body2" sx={{ color: "#999" }}>
            © 2025 Tambykez - Gensan. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <MuiLink
              component={Link}
              href="/privacy"
              sx={{
                color: "#999",
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
                color: "#999",
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
              href="/cookies"
              sx={{
                color: "#999",
                textDecoration: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  color: "#FF6B35",
                },
              }}
            >
              Cookie Policy
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

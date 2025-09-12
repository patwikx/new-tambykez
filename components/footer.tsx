import { Box, Container, Typography, Link as MuiLink, IconButton, Divider } from "@mui/material"
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from "@mui/icons-material"
import Link from "next/link"

const footerLinks = {
  products: [
    { name: "Safety Equipment", href: "/categories/safety" },
    { name: "Power Tools", href: "/categories/power-tools" },
    { name: "Hand Tools", href: "/categories/hand-tools" },
    { name: "Industrial Supplies", href: "/categories/industrial" },
    { name: "Electrical", href: "/categories/electrical" },
    { name: "Plumbing", href: "/categories/plumbing" },
  ],
  services: [
    { name: "Equipment Rental", href: "/services/rental" },
    { name: "Bulk Orders", href: "/services/bulk" },
    { name: "Custom Solutions", href: "/services/custom" },
    { name: "Technical Support", href: "/services/support" },
    { name: "Training", href: "/services/training" },
    { name: "Maintenance", href: "/services/maintenance" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Product Manuals", href: "/manuals" },
    { name: "Warranty Info", href: "/warranty" },
    { name: "Returns", href: "/returns" },
    { name: "FAQ", href: "/faq" },
    { name: "Track Order", href: "/track-order" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "News", href: "/news" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Certifications", href: "/certifications" },
    { name: "Locations", href: "/locations" },
  ],
}

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#1f2937", color: "white", pt: 8, pb: 4 }}>
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
                color: "#3b82f6",
              }}
            >
              PROFESSIONAL EQUIPMENT
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6, color: "#d1d5db" }}>
              Your trusted partner for quality industrial equipment, safety supplies, and professional tools. 
              Serving businesses with excellence since 1985.
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Phone sx={{ color: "#dc2626", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#d1d5db" }}>
                  (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Email sx={{ color: "#dc2626", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#d1d5db" }}>
                  info@professionalequipment.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocationOn sx={{ color: "#dc2626", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#d1d5db" }}>
                  123 Industrial Blvd, Business City, ST 12345
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  color: "#9ca3af",
                  "&:hover": {
                    color: "#dc2626",
                    bgcolor: "rgba(220, 38, 38, 0.1)",
                  },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{
                  color: "#9ca3af",
                  "&:hover": {
                    color: "#dc2626",
                    bgcolor: "rgba(220, 38, 38, 0.1)",
                  },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{
                  color: "#9ca3af",
                  "&:hover": {
                    color: "#dc2626",
                    bgcolor: "rgba(220, 38, 38, 0.1)",
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{
                  color: "#9ca3af",
                  "&:hover": {
                    color: "#dc2626",
                    bgcolor: "rgba(220, 38, 38, 0.1)",
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
                }}
              >
                Products
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {footerLinks.products.map((link) => (
                  <MuiLink
                    key={link.name}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: "#d1d5db",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        color: "#dc2626",
                      },
                      transition: "color 0.3s ease",
                    }}
                  >
                    {link.name}
                  </MuiLink>
                ))}
              </Box>
            </Box>

            {/* Services Links */}
            <Box sx={{ flex: { xs: "1 1 50%", md: "1 1 25%" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: "white",
                }}
              >
                Services
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {footerLinks.services.map((link) => (
                  <MuiLink
                    key={link.name}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: "#d1d5db",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        color: "#dc2626",
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
                      color: "#d1d5db",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        color: "#dc2626",
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
                      color: "#d1d5db",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        color: "#dc2626",
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

        <Divider sx={{ my: 4, borderColor: "#374151" }} />

        {/* Bottom Bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="body2" sx={{ color: "#9ca3af" }}>
            © 2025 Professional Equipment Co. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <MuiLink
              component={Link}
              href="/privacy"
              sx={{
                color: "#9ca3af",
                textDecoration: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  color: "#dc2626",
                },
              }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              component={Link}
              href="/terms"
              sx={{
                color: "#9ca3af",
                textDecoration: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  color: "#dc2626",
                },
              }}
            >
              Terms of Service
            </MuiLink>
            <MuiLink
              component={Link}
              href="/accessibility"
              sx={{
                color: "#9ca3af",
                textDecoration: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  color: "#dc2626",
                },
              }}
            >
              Accessibility
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
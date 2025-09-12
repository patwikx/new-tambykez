"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  InputBase,
  alpha,
  Avatar,
  Divider,
  Paper,
} from "@mui/material"
import {
  Search,
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Close,
  Favorite,
  KeyboardArrowDown,
  Login,
  PersonAdd,
  Logout,
  AccountCircle,
  Dashboard,
  Phone,
  Email,
} from "@mui/icons-material"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import type { NavigationCategory, NavigationBrand } from "@/lib/actions/navigations"

interface HeaderProps {
  categories: NavigationCategory[]
  brands: NavigationBrand[]
}

export default function Header({ categories, brands }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesAnchor, setCategoriesAnchor] = useState<null | HTMLElement>(null)
  const [brandsAnchor, setBrandsAnchor] = useState<null | HTMLElement>(null)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const theme = useTheme()
  const isMobileQuery = useMediaQuery(theme.breakpoints.down("md"))
  const isMobile = isMounted ? isMobileQuery : false

  const { data: session, status } = useSession()
  const isAuthenticated = !!session
  const isLoading = status === "loading"

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCategoriesClick = (event: React.MouseEvent<HTMLElement>) => {
    setCategoriesAnchor(event.currentTarget)
  }

  const handleBrandsClick = (event: React.MouseEvent<HTMLElement>) => {
    setBrandsAnchor(event.currentTarget)
  }

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setCategoriesAnchor(null)
    setBrandsAnchor(null)
    setUserMenuAnchor(null)
  }

  const handleSignOut = async () => {
    handleClose()
    await signOut({ callbackUrl: "/" })
  }

  const getUserDisplayName = () => {
    if (!session?.user) return ""
    const { firstName, lastName, email } = session.user
    if (firstName && lastName) return `${firstName} ${lastName}`
    if (firstName) return firstName
    return email?.split("@")[0] || "User"
  }

  return (
    <>
      {/* Top Bar */}
      <Box sx={{ bgcolor: "#1e3a8a", color: "white", py: 1 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  info@professionalequipment.com
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                Free Shipping on Orders Over $500
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Header */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, sm: 2 }, py: 1 }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton edge="start" sx={{ color: "#1f2937", mr: 2 }} onClick={() => setMobileMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: "#1e3a8a",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#dc2626",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                PROFESSIONAL EQUIPMENT
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", ml: 4, gap: 1 }}>
                <Button
                  sx={{ color: "#1f2937" }}
                  onClick={handleCategoriesClick}
                  endIcon={<KeyboardArrowDown />}
                >
                  Categories
                </Button>
                <Button
                  sx={{ color: "#1f2937" }}
                  onClick={handleBrandsClick}
                  endIcon={<KeyboardArrowDown />}
                >
                  Brands
                </Button>
                <Button
                  component={Link}
                  href="/about"
                  sx={{ color: "#1f2937" }}
                >
                  About
                </Button>
                <Button
                  component={Link}
                  href="/contact"
                  sx={{ color: "#1f2937" }}
                >
                  Contact
                </Button>
              </Box>
            )}

            {/* Search Bar */}
            <Box
              sx={{
                position: "relative",
                borderRadius: 2,
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                "&:hover": {
                  borderColor: "#dc2626",
                },
                "&:focus-within": {
                  borderColor: "#dc2626",
                  boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
                },
                marginLeft: "auto",
                marginRight: 2,
                width: { xs: "100%", sm: "auto" },
                maxWidth: { xs: 200, sm: 350 },
              }}
            >
              <Box
                sx={{
                  padding: theme.spacing(0, 2),
                  height: "100%",
                  position: "absolute",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search sx={{ color: "#6b7280" }} />
              </Box>
              <InputBase
                placeholder="Search products..."
                sx={{
                  color: "#1f2937",
                  "& .MuiInputBase-input": {
                    padding: theme.spacing(1.5, 1, 1.5, 0),
                    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                    transition: theme.transitions.create("width"),
                    width: "100%",
                    fontSize: "0.9rem",
                  },
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Wishlist */}
              <IconButton
                component={Link}
                href="/wishlist"
                sx={{
                  color: "#6b7280",
                  "&:hover": {
                    color: "#dc2626",
                  },
                }}
              >
                <Badge badgeContent={3} sx={{ "& .MuiBadge-badge": { bgcolor: "#dc2626" } }}>
                  <Favorite />
                </Badge>
              </IconButton>

              {/* Cart */}
              <IconButton
                component={Link}
                href="/cart"
                sx={{
                  color: "#6b7280",
                  "&:hover": {
                    color: "#dc2626",
                  },
                }}
              >
                <Badge badgeContent={2} sx={{ "& .MuiBadge-badge": { bgcolor: "#dc2626" } }}>
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {isLoading ? (
                <IconButton disabled sx={{ color: "#9ca3af" }}>
                  <Person />
                </IconButton>
              ) : isAuthenticated ? (
                <IconButton
                  onClick={handleUserMenuClick}
                  sx={{
                    color: "#6b7280",
                    "&:hover": {
                      color: "#dc2626",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#dc2626",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {!isMobile && (
                    <Button
                      component={Link}
                      href="/auth/sign-in"
                      startIcon={<Login />}
                      sx={{
                        color: "#1f2937",
                        "&:hover": {
                          color: "#dc2626",
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                  <Button
                    component={Link}
                    href="/auth/sign-up"
                    variant="contained"
                    startIcon={!isMobile ? <PersonAdd /> : undefined}
                    sx={{
                      bgcolor: "#dc2626",
                      color: "white",
                      px: isMobile ? 2 : 3,
                      "&:hover": {
                        bgcolor: "#b91c1c",
                      },
                    }}
                  >
                    {isMobile ? <PersonAdd /> : "Sign Up"}
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Categories Dropdown Menu */}
      <Menu
        anchorEl={categoriesAnchor}
        open={Boolean(categoriesAnchor)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: "white",
            border: "1px solid #e5e7eb",
            mt: 1,
            minWidth: 250,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
        }}
      >
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            onClick={handleClose}
            component={Link}
            href={`/categories/${category.slug}`}
            sx={{
              color: "#1f2937",
              py: 1.5,
              "&:hover": {
                bgcolor: "#f3f4f6",
                color: "#dc2626",
              },
            }}
          >
            {category.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Brands Dropdown Menu */}
      <Menu
        anchorEl={brandsAnchor}
        open={Boolean(brandsAnchor)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: "white",
            border: "1px solid #e5e7eb",
            mt: 1,
            minWidth: 250,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
        }}
      >
        {brands.map((brand) => (
          <MenuItem
            key={brand.id}
            onClick={handleClose}
            component={Link}
            href={`/brands/${brand.slug}`}
            sx={{
              color: "#1f2937",
              py: 1.5,
              "&:hover": {
                bgcolor: "#f3f4f6",
                color: "#dc2626",
              },
            }}
          >
            {brand.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "white",
            color: "#1f2937",
            width: 280,
            border: "none",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e3a8a" }}>
              MENU
            </Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: "#6b7280" }}>
              <Close />
            </IconButton>
          </Box>
        </Box>
        <List>
          <ListItem>
            <ListItemText
              primary="CATEGORIES"
              primaryTypographyProps={{
                fontWeight: 700,
                color: "#dc2626",
              }}
            />
          </ListItem>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              component={Link}
              href={`/categories/${category.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                pl: 4,
                "&:hover": {
                  bgcolor: "#f3f4f6",
                },
              }}
            >
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
          <ListItem sx={{ mt: 2 }}>
            <ListItemText
              primary="BRANDS"
              primaryTypographyProps={{
                fontWeight: 700,
                color: "#dc2626",
              }}
            />
          </ListItem>
          {brands.map((brand) => (
            <ListItem
              key={brand.id}
              component={Link}
              href={`/brands/${brand.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                pl: 4,
                "&:hover": {
                  bgcolor: "#f3f4f6",
                },
              }}
            >
              <ListItemText primary={brand.name} />
            </ListItem>
          ))}
          {isAuthenticated && (
            <>
              <Divider sx={{ borderColor: "#e5e7eb", mt: 2 }} />
              <ListItem sx={{ mt: 2 }}>
                <ListItemText
                  primary="MY ACCOUNT"
                  primaryTypographyProps={{
                    fontWeight: 700,
                    color: "#dc2626",
                  }}
                />
              </ListItem>
              {session?.user?.role && ["ADMIN", "MODERATOR", "VENDOR"].includes(session.user.role) && (
                <ListItem
                  component={Link}
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    pl: 4,
                    "&:hover": {
                      bgcolor: "#f3f4f6",
                    },
                  }}
                >
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              )}
              <ListItem
                onClick={handleSignOut}
                sx={{
                  pl: 4,
                  "&:hover": {
                    bgcolor: "#f3f4f6",
                  },
                }}
              >
                <ListItemText primary="Sign Out" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: "white",
            border: "1px solid #e5e7eb",
            mt: 1,
            minWidth: 200,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #e5e7eb" }}>
          <Typography variant="subtitle2" sx={{ color: "#dc2626", fontWeight: 600 }}>
            {getUserDisplayName()}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            {session?.user?.email}
          </Typography>
        </Box>

        <MenuItem
          onClick={handleClose}
          component={Link}
          href="/account"
          sx={{
            color: "#1f2937",
            py: 1.5,
            "&:hover": {
              bgcolor: "#f3f4f6",
              color: "#dc2626",
            },
          }}
        >
          <AccountCircle sx={{ mr: 2 }} />
          My Account
        </MenuItem>

        {session?.user?.role && ["ADMIN", "MODERATOR", "VENDOR"].includes(session.user.role) && (
          <MenuItem
            onClick={handleClose}
            component={Link}
            href="/admin"
            sx={{
              color: "#1f2937",
              py: 1.5,
              "&:hover": {
                bgcolor: "#f3f4f6",
                color: "#dc2626",
              },
            }}
          >
            <Dashboard sx={{ mr: 2 }} />
            Admin Dashboard
          </MenuItem>
        )}

        <Divider sx={{ borderColor: "#e5e7eb" }} />

        <MenuItem
          onClick={handleSignOut}
          sx={{
            color: "#1f2937",
            py: 1.5,
            "&:hover": {
              bgcolor: "#f3f4f6",
              color: "#dc2626",
            },
          }}
        >
          <Logout sx={{ mr: 2 }} />
          Sign Out
        </MenuItem>
      </Menu>
    </>
  )
}
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
  Avatar,
  Divider,
} from "@mui/material"
import {
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
import SearchBar from "@/components/search/search-bar"
import CartDrawer from "@/components/cart/cart-drawer"
import { getCartCount } from "@/lib/actions/cart-actions"

interface HeaderProps {
  categories: NavigationCategory[]
  brands: NavigationBrand[]
}

export default function Header({ categories, brands }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [categoriesAnchor, setCategoriesAnchor] = useState<null | HTMLElement>(null)
  const [brandsAnchor, setBrandsAnchor] = useState<null | HTMLElement>(null)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [cartCount, setCartCount] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const theme = useTheme()
  const isMobileQuery = useMediaQuery(theme.breakpoints.down("md"))
  const isMobile = isMounted ? isMobileQuery : false

  const { data: session, status } = useSession()
  const isAuthenticated = !!session
  const isLoading = status === "loading"

  useEffect(() => {
    setIsMounted(true)
    if (session?.user) {
      loadCartCount()
    }
  }, [session])

  const loadCartCount = async () => {
    try {
      const count = await getCartCount()
      setCartCount(count)
    } catch (error) {
      console.error("Error loading cart count:", error)
    }
  }

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
      <Box sx={{ bgcolor: "#FF6B35", color: "white", py: 1 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  +63 917 123 4567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  info@tambykez.com
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                Free Shipping Metro Manila • Same Day Delivery Available
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Header */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#000000",
          borderBottom: "1px solid #333",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, sm: 2 }, py: 1 }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton edge="start" sx={{ color: "white", mr: 2 }} onClick={() => setMobileMenuOpen(true)}>
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
                  color: "white",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  "&:hover": {
                    color: "#FF6B35",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                Tambykez
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", ml: 4, gap: 1 }}>
                <Button
                  sx={{ 
                    color: "white",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    "&:hover": { color: "#FF6B35" }
                  }}
                  onClick={handleCategoriesClick}
                  endIcon={<KeyboardArrowDown />}
                >
                  Categories
                </Button>
                <Button
                  sx={{ 
                    color: "white",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    "&:hover": { color: "#FF6B35" }
                  }}
                  onClick={handleBrandsClick}
                  endIcon={<KeyboardArrowDown />}
                >
                  Brands
                </Button>
                <Button
                  component={Link}
                  href="/collections"
                  sx={{ 
                    color: "white",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    "&:hover": { color: "#FF6B35" }
                  }}
                >
                  Collections
                </Button>
                <Button
                  component={Link}
                  href="/about"
                  sx={{ 
                    color: "white",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    "&:hover": { color: "#FF6B35" }
                  }}
                >
                  About
                </Button>
              </Box>
            )}

            {/* Search Bar */}
            <Box sx={{ marginLeft: "auto", marginRight: 2, width: { xs: "100%", sm: "auto" }, maxWidth: { xs: 200, sm: 350 } }}>
              <SearchBar placeholder="Search motorcycle gear..." />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Wishlist */}
              <IconButton
                component={Link}
                href="/wishlist"
                sx={{
                  color: "white",
                  "&:hover": {
                    color: "#FF6B35",
                  },
                }}
              >
                <Badge badgeContent={0} sx={{ "& .MuiBadge-badge": { bgcolor: "#FF6B35" } }}>
                  <Favorite />
                </Badge>
              </IconButton>

              {/* Cart */}
              <IconButton
                onClick={() => setCartDrawerOpen(true)}
                sx={{
                  color: "white",
                  "&:hover": {
                    color: "#FF6B35",
                  },
                }}
              >
                <Badge badgeContent={cartCount} sx={{ "& .MuiBadge-badge": { bgcolor: "#FF6B35" } }}>
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {isLoading ? (
                <IconButton disabled sx={{ color: "#666" }}>
                  <Person />
                </IconButton>
              ) : isAuthenticated ? (
                <IconButton
                  onClick={handleUserMenuClick}
                  sx={{
                    color: "white",
                    "&:hover": {
                      color: "#FF6B35",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#FF6B35",
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
                        color: "white",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        "&:hover": {
                          color: "#FF6B35",
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
                      bgcolor: "#FF6B35",
                      color: "white",
                      px: isMobile ? 2 : 3,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      "&:hover": {
                        bgcolor: "#E55A2B",
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
            bgcolor: "#111111",
            border: "1px solid #333",
            mt: 1,
            minWidth: 250,
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
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
              color: "white",
              py: 1.5,
              "&:hover": {
                bgcolor: "rgba(255, 107, 53, 0.1)",
                color: "#FF6B35",
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
            bgcolor: "#111111",
            border: "1px solid #333",
            mt: 1,
            minWidth: 250,
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
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
              color: "white",
              py: 1.5,
              "&:hover": {
                bgcolor: "rgba(255, 107, 53, 0.1)",
                color: "#FF6B35",
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
            bgcolor: "#000000",
            color: "white",
            width: 280,
            border: "none",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #333" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: "#FF6B35", textTransform: "uppercase" }}>
              Tambykez
            </Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: "white" }}>
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
                color: "#FF6B35",
                textTransform: "uppercase",
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
                  bgcolor: "rgba(255, 107, 53, 0.1)",
                },
              }}
            >
              <ListItemText primary={category.name} sx={{ color: "white" }} />
            </ListItem>
          ))}
          <ListItem sx={{ mt: 2 }}>
            <ListItemText
              primary="BRANDS"
              primaryTypographyProps={{
                fontWeight: 700,
                color: "#FF6B35",
                textTransform: "uppercase",
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
                  bgcolor: "rgba(255, 107, 53, 0.1)",
                },
              }}
            >
              <ListItemText primary={brand.name} sx={{ color: "white" }} />
            </ListItem>
          ))}
          {isAuthenticated && (
            <>
              <Divider sx={{ borderColor: "#333", mt: 2 }} />
              <ListItem sx={{ mt: 2 }}>
                <ListItemText
                  primary="MY ACCOUNT"
                  primaryTypographyProps={{
                    fontWeight: 700,
                    color: "#FF6B35",
                    textTransform: "uppercase",
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
                      bgcolor: "rgba(255, 107, 53, 0.1)",
                    },
                  }}
                >
                  <ListItemText primary="Admin Dashboard" sx={{ color: "white" }} />
                </ListItem>
              )}
              <ListItem
                onClick={handleSignOut}
                sx={{
                  pl: 4,
                  "&:hover": {
                    bgcolor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                <ListItemText primary="Sign Out" sx={{ color: "white" }} />
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
            bgcolor: "#111111",
            border: "1px solid #333",
            mt: 1,
            minWidth: 200,
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          },
        }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #333" }}>
          <Typography variant="subtitle2" sx={{ color: "#FF6B35", fontWeight: 600 }}>
            {getUserDisplayName()}
          </Typography>
          <Typography variant="body2" sx={{ color: "#999" }}>
            {session?.user?.email}
          </Typography>
        </Box>

        <MenuItem
          onClick={handleClose}
          component={Link}
          href="/account"
          sx={{
            color: "white",
            py: 1.5,
            "&:hover": {
              bgcolor: "rgba(255, 107, 53, 0.1)",
              color: "#FF6B35",
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
              color: "white",
              py: 1.5,
              "&:hover": {
                bgcolor: "rgba(255, 107, 53, 0.1)",
                color: "#FF6B35",
              },
            }}
          >
            <Dashboard sx={{ mr: 2 }} />
            Admin Dashboard
          </MenuItem>
        )}

        <Divider sx={{ borderColor: "#333" }} />

        <MenuItem
          onClick={handleSignOut}
          sx={{
            color: "white",
            py: 1.5,
            "&:hover": {
              bgcolor: "rgba(255, 107, 53, 0.1)",
              color: "#FF6B35",
            },
          }}
        >
          <Logout sx={{ mr: 2 }} />
          Sign Out
        </MenuItem>
      </Menu>

      {/* Cart Drawer */}
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  )
}
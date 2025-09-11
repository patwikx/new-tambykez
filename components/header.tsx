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
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#000000",
          borderBottom: "1px solid #333",
          boxShadow: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton edge="start" color="inherit" onClick={() => setMobileMenuOpen(true)} sx={{ mr: 2 }}>
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
                  textTransform: "uppercase",
                  color: "white",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#FF6B35",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                TAMBYKEZ
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", ml: 4, gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={handleCategoriesClick}
                  endIcon={<KeyboardArrowDown />}
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    "&:hover": {
                      color: "#FF6B35",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Collections
                </Button>
                <Button
                  color="inherit"
                  onClick={handleBrandsClick}
                  endIcon={<KeyboardArrowDown />}
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    "&:hover": {
                      color: "#FF6B35",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Brands
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  href="/sale"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#FF6B35",
                    "&:hover": {
                      bgcolor: "rgba(255, 107, 53, 0.1)",
                    },
                  }}
                >
                  Sale
                </Button>
              </Box>
            )}

            {/* Search Bar */}
            <Box
              sx={{
                position: "relative",
                borderRadius: 1,
                backgroundColor: alpha("#ffffff", 0.1),
                "&:hover": {
                  backgroundColor: alpha("#ffffff", 0.15),
                },
                marginLeft: "auto",
                marginRight: 2,
                width: { xs: "100%", sm: "auto" },
                maxWidth: { xs: 200, sm: 300 },
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
                <Search sx={{ color: "#999" }} />
              </Box>
              <InputBase
                placeholder="Search gear..."
                sx={{
                  color: "inherit",
                  "& .MuiInputBase-input": {
                    padding: theme.spacing(1, 1, 1, 0),
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
                color="inherit"
                component={Link}
                href="/wishlist"
                sx={{
                  "&:hover": {
                    color: "#FF6B35",
                  },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Favorite />
                </Badge>
              </IconButton>

              {/* Cart */}
              <IconButton
                color="inherit"
                component={Link}
                href="/cart"
                sx={{
                  "&:hover": {
                    color: "#FF6B35",
                  },
                }}
              >
                <Badge badgeContent={2} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {isLoading ? (
                <IconButton disabled sx={{ color: "#666" }}>
                  <Person />
                </IconButton>
              ) : isAuthenticated ? (
                <IconButton
                  color="inherit"
                  onClick={handleUserMenuClick}
                  sx={{
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
                        letterSpacing: "0.5px",
                        "&:hover": {
                          color: "#FF6B35",
                          bgcolor: "transparent",
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
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      px: isMobile ? 2 : 3,
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
            minWidth: 200,
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
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
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
            minWidth: 200,
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
              fontWeight: 600,
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
            <Typography variant="h6" sx={{ fontWeight: 900, textTransform: "uppercase" }}>
              TAMBYKEZ
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
                letterSpacing: "0.5px",
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
              <ListItemText
                primary={category.name}
                primaryTypographyProps={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              />
            </ListItem>
          ))}
          <ListItem sx={{ mt: 2 }}>
            <ListItemText
              primary="BRANDS"
              primaryTypographyProps={{
                fontWeight: 700,
                color: "#FF6B35",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
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
              <ListItemText
                primary={brand.name}
                primaryTypographyProps={{
                  fontWeight: 600,
                }}
              />
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
                    letterSpacing: "0.5px",
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
                  <ListItemText
                    primary="Admin Dashboard"
                    primaryTypographyProps={{
                      fontWeight: 600,
                    }}
                  />
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
                <ListItemText
                  primary="Sign Out"
                  primaryTypographyProps={{
                    fontWeight: 600,
                  }}
                />
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
            fontWeight: 600,
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
              fontWeight: 600,
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
            fontWeight: 600,
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
    </>
  )
}

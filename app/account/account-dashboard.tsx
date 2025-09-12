"use client"

import { useState, useEffect } from "react"
import { Box, Card, CardContent, Typography, Button, Avatar, Chip, Skeleton } from "@mui/material"
import { LocationOn, ShoppingBag, Favorite, Settings, Security, ArrowForward } from "@mui/icons-material"
import Link from "next/link"
import { getUserProfile, getUserOrders, type UserProfile, UserOrder } from "@/lib/actions/user-actions"
import { getWishlistItems } from "@/lib/actions/wishlist-actions"
import { useAuth } from "@/hooks/use-auth"

export default function AccountDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [recentOrders, setRecentOrders] = useState<UserOrder[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      const [profileData, ordersData, wishlistData] = await Promise.all([
        getUserProfile(),
        getUserOrders(),
        getWishlistItems(),
      ])

      setProfile(profileData)
      setRecentOrders(ordersData.slice(0, 3)) // Show only recent 3 orders
      setWishlistCount(wishlistData.length)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#4ade80"
      case "shipped":
        return "#3b82f6"
      case "processing":
        return "#f59e0b"
      case "pending":
        return "#6b7280"
      case "cancelled":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Profile Card Skeleton */}
        <Card sx={{ bgcolor: "#111111", border: "1px solid #333" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Skeleton variant="circular" width={80} height={80} sx={{ bgcolor: "#333" }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" sx={{ bgcolor: "#333", mb: 1 }} />
                <Skeleton variant="text" width="40%" sx={{ bgcolor: "#333" }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions Skeleton */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} sx={{ flex: "1 1 250px", bgcolor: "#111111", border: "1px solid #333" }}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ bgcolor: "#333", mb: 2 }} />
                <Skeleton variant="text" width="80%" sx={{ bgcolor: "#333", mb: 1 }} />
                <Skeleton variant="text" width="60%" sx={{ bgcolor: "#333" }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    )
  }

  if (!profile) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" sx={{ color: "#666", mb: 2 }}>
          Please sign in to view your account
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/auth/signin"
          sx={{
            bgcolor: "#FF6B35",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase",
            "&:hover": {
              bgcolor: "#E55A2B",
            },
          }}
        >
          Sign In
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Profile Overview */}
      <Card
        sx={{
          bgcolor: "#111111",
          border: "1px solid #333",
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#FF6B35",
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              {profile.firstName?.[0] || profile.email[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "white", mb: 1 }}>
                {profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.email}
              </Typography>
              <Typography variant="body1" sx={{ color: "#999", mb: 1 }}>
                {profile.email}
              </Typography>
              <Chip
                label={profile.role}
                size="small"
                sx={{
                  bgcolor: "#FF6B35",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              />
            </Box>
            <Button
              variant="outlined"
              component={Link}
              href="/account/profile"
              startIcon={<Settings />}
              sx={{
                borderColor: "#333",
                color: "white",
                fontWeight: 600,
                textTransform: "uppercase",
                "&:hover": {
                  borderColor: "#FF6B35",
                  bgcolor: "rgba(255, 107, 53, 0.1)",
                },
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Card
          component={Link}
          href="/account/orders"
          sx={{
            flex: "1 1 250px",
            bgcolor: "#111111",
            border: "1px solid #333",
            borderRadius: 2,
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#FF6B35",
              transform: "translateY(-4px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <ShoppingBag sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 1 }}>
              Orders
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              {recentOrders.length} recent orders
            </Typography>
          </CardContent>
        </Card>

        <Card
          component={Link}
          href="/account/addresses"
          sx={{
            flex: "1 1 250px",
            bgcolor: "#111111",
            border: "1px solid #333",
            borderRadius: 2,
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#FF6B35",
              transform: "translateY(-4px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <LocationOn sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 1 }}>
              Addresses
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              Manage shipping addresses
            </Typography>
          </CardContent>
        </Card>

        <Card
          component={Link}
          href="/wishlist"
          sx={{
            flex: "1 1 250px",
            bgcolor: "#111111",
            border: "1px solid #333",
            borderRadius: 2,
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#FF6B35",
              transform: "translateY(-4px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Favorite sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 1 }}>
              Wishlist
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              {wishlistCount} saved items
            </Typography>
          </CardContent>
        </Card>

        <Card
          component={Link}
          href="/account/security"
          sx={{
            flex: "1 1 250px",
            bgcolor: "#111111",
            border: "1px solid #333",
            borderRadius: 2,
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#FF6B35",
              transform: "translateY(-4px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Security sx={{ fontSize: 48, color: "#FF6B35", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 1 }}>
              Security
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              Password & security settings
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <Card
          sx={{
            bgcolor: "#111111",
            border: "1px solid #333",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "white" }}>
                Recent Orders
              </Typography>
              <Button
                component={Link}
                href="/account/orders"
                endIcon={<ArrowForward />}
                sx={{
                  color: "#FF6B35",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  "&:hover": {
                    bgcolor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                View All
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentOrders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 3,
                    border: "1px solid #333",
                    borderRadius: 1,
                    "&:hover": {
                      borderColor: "#FF6B35",
                    },
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "white", mb: 1 }}>
                      Order #{order.orderNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#999", mb: 1 }}>
                      {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                    </Typography>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(order.status),
                        color: "white",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    />
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#FF6B35", mb: 1 }}>
                      ${order.totalAmount.toFixed(2)}
                    </Typography>
                    <Button
                      component={Link}
                      href={`/account/orders/${order.id}`}
                      size="small"
                      sx={{
                        color: "white",
                        borderColor: "#333",
                        "&:hover": {
                          borderColor: "#FF6B35",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

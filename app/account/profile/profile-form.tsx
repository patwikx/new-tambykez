"use client"

import { useState, useEffect, useActionState } from "react"
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Skeleton } from "@mui/material"
import { Save, ArrowBack } from "@mui/icons-material"
import Link from "next/link"
import { getUserProfile, type UserProfile } from "@/lib/actions/user-actions"
import { updateProfileAction } from "@/lib/actions/auth-actions"
import { useAuth } from "@/hooks/use-auth"

export default function ProfileForm() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [state, formAction, isPending] = useActionState(updateProfileAction, { success: false })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const profileData = await getUserProfile()
      setProfile(profileData)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card sx={{ bgcolor: "#111111", border: "1px solid #333", borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Skeleton variant="text" width="40%" sx={{ bgcolor: "#333", mb: 3 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={56} sx={{ bgcolor: "#333", borderRadius: 1 }} />
            ))}
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" sx={{ color: "#666", mb: 2 }}>
          Profile not found
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/account"
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
          Back to Account
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Button
        component={Link}
        href="/account"
        startIcon={<ArrowBack />}
        sx={{
          color: "white",
          mb: 3,
          "&:hover": {
            color: "#FF6B35",
          },
        }}
      >
        Back to Account
      </Button>

      <Card sx={{ bgcolor: "#111111", border: "1px solid #333", borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "white", mb: 3 }}>
            Personal Information
          </Typography>

          {state.success && (
            <Alert severity="success" sx={{ mb: 3, bgcolor: "#1b5e20", color: "white" }}>
              {state.message}
            </Alert>
          )}

          {!state.success && state.message && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: "#d32f2f", color: "white" }}>
              {state.message}
            </Alert>
          )}

          <form action={formAction}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                name="firstName"
                label="First Name"
                defaultValue={profile.firstName || ""}
                required
                disabled={isPending}
                error={!!state.errors?.firstName}
                helperText={state.errors?.firstName?.[0]}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "#333",
                    },
                    "&:hover fieldset": {
                      borderColor: "#FF6B35",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF6B35",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#999",
                    "&.Mui-focused": {
                      color: "#FF6B35",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#ef4444",
                  },
                }}
              />

              <TextField
                name="lastName"
                label="Last Name"
                defaultValue={profile.lastName || ""}
                required
                disabled={isPending}
                error={!!state.errors?.lastName}
                helperText={state.errors?.lastName?.[0]}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "#333",
                    },
                    "&:hover fieldset": {
                      borderColor: "#FF6B35",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF6B35",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#999",
                    "&.Mui-focused": {
                      color: "#FF6B35",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#ef4444",
                  },
                }}
              />

              <TextField
                name="email"
                label="Email Address"
                value={profile.email}
                disabled
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#666",
                    "& fieldset": {
                      borderColor: "#333",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666",
                  },
                }}
              />

              <TextField
                name="phone"
                label="Phone Number"
                defaultValue={profile.phone || ""}
                disabled={isPending}
                error={!!state.errors?.phone}
                helperText={state.errors?.phone?.[0]}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "#333",
                    },
                    "&:hover fieldset": {
                      borderColor: "#FF6B35",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF6B35",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#999",
                    "&.Mui-focused": {
                      color: "#FF6B35",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#ef4444",
                  },
                }}
              />

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={isPending}
                  sx={{
                    bgcolor: "#FF6B35",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      bgcolor: "#E55A2B",
                    },
                    "&:disabled": {
                      bgcolor: "#666",
                      color: "#999",
                    },
                  }}
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  component={Link}
                  href="/account"
                  variant="outlined"
                  disabled={isPending}
                  sx={{
                    borderColor: "#333",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "#FF6B35",
                      bgcolor: "rgba(255, 107, 53, 0.1)",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

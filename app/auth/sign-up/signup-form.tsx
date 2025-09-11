"use client"

import { useState, useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { Box, TextField, Button, Typography, Alert, Divider, InputAdornment, IconButton } from "@mui/material"
import { Google, Visibility, VisibilityOff, Email, Lock, Person, Phone } from "@mui/icons-material"
import Link from "next/link"
import { signUpAction, googleSignIn } from "@/lib/actions/auth-actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const [state, formAction, isPending] = useActionState(signUpAction, initialState)

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await googleSignIn(callbackUrl)
    } catch (error) {
      console.error("Google sign in error:", error)
      setIsGoogleLoading(false)
    }
  }

  return (
    <Box component="form" action={formAction} sx={{ width: "100%" }}>
      {state.message && (
        <Alert
          severity={state.success ? "success" : "error"}
          sx={{ mb: 3, bgcolor: state.success ? "#1B5E20" : "#B71C1C", color: "white" }}
        >
          {state.message}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          name="firstName"
          label="First Name"
          required
          error={!!state.errors?.firstName}
          helperText={state.errors?.firstName?.[0]}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#222",
              color: "white",
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#FF6B35" },
              "&.Mui-focused fieldset": { borderColor: "#FF6B35" },
            },
            "& .MuiInputLabel-root": { color: "#999" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#FF6B35" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: "#999" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          name="lastName"
          label="Last Name"
          required
          error={!!state.errors?.lastName}
          helperText={state.errors?.lastName?.[0]}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#222",
              color: "white",
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#FF6B35" },
              "&.Mui-focused fieldset": { borderColor: "#FF6B35" },
            },
            "& .MuiInputLabel-root": { color: "#999" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#FF6B35" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: "#999" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TextField
        fullWidth
        name="email"
        type="email"
        label="Email Address"
        required
        error={!!state.errors?.email}
        helperText={state.errors?.email?.[0]}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            bgcolor: "#222",
            color: "white",
            "& fieldset": { borderColor: "#444" },
            "&:hover fieldset": { borderColor: "#FF6B35" },
            "&.Mui-focused fieldset": { borderColor: "#FF6B35" },
          },
          "& .MuiInputLabel-root": { color: "#999" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#FF6B35" },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: "#999" }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        name="phone"
        label="Phone Number (Optional)"
        error={!!state.errors?.phone}
        helperText={state.errors?.phone?.[0]}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            bgcolor: "#222",
            color: "white",
            "& fieldset": { borderColor: "#444" },
            "&:hover fieldset": { borderColor: "#FF6B35" },
            "&.Mui-focused fieldset": { borderColor: "#FF6B35" },
          },
          "& .MuiInputLabel-root": { color: "#999" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#FF6B35" },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone sx={{ color: "#999" }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        name="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        required
        error={!!state.errors?.password}
        helperText={state.errors?.password?.[0]}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            bgcolor: "#222",
            color: "white",
            "& fieldset": { borderColor: "#444" },
            "&:hover fieldset": { borderColor: "#FF6B35" },
            "&.Mui-focused fieldset": { borderColor: "#FF6B35" },
          },
          "& .MuiInputLabel-root": { color: "#999" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#FF6B35" },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: "#999" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "#999" }}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isPending}
        sx={{
          bgcolor: "#FF6B35",
          color: "white",
          py: 1.5,
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          mb: 3,
          "&:hover": {
            bgcolor: "#E55A2B",
          },
          "&:disabled": {
            bgcolor: "#666",
          },
        }}
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </Button>

      <Divider sx={{ my: 3, borderColor: "#333" }}>
        <Typography variant="body2" sx={{ color: "#999", px: 2 }}>
          OR
        </Typography>
      </Divider>

      <Button
        fullWidth
        variant="outlined"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        startIcon={<Google />}
        sx={{
          borderColor: "#444",
          color: "white",
          py: 1.5,
          fontSize: "1rem",
          fontWeight: 600,
          mb: 3,
          "&:hover": {
            borderColor: "#FF6B35",
            bgcolor: "rgba(255, 107, 53, 0.1)",
          },
          "&:disabled": {
            borderColor: "#666",
            color: "#666",
          },
        }}
      >
        {isGoogleLoading ? "Connecting..." : "Continue with Google"}
      </Button>

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#999" }}>
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            style={{
              color: "#FF6B35",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Sign in here
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

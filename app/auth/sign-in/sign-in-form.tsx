"use client"

import { useState, useActionState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Box, TextField, Button, Typography, Alert, Divider, InputAdornment, IconButton } from "@mui/material"
import { Google, Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material"
import Link from "next/link"
import { credentialsSignIn, googleSignIn } from "@/lib/actions/auth-actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const router = useRouter()
  const { data: session, update } = useSession()

  const [state, formAction, isPending] = useActionState(credentialsSignIn, initialState)

  useEffect(() => {
    if (session) {
      router.push(callbackUrl)
    }
  }, [session, callbackUrl, router])

  useEffect(() => {
    if (state.success) {
      // Force session update after successful login
      update().then(() => {
        router.push(callbackUrl)
        router.refresh()
      })
    }
  }, [state.success, update, router, callbackUrl])

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await googleSignIn(callbackUrl)
      await update()
      router.refresh()
    } catch (error) {
      console.error("Google sign in error:", error)
      setIsGoogleLoading(false)
    }
  }

  return (
    <Box component="form" action={formAction} sx={{ width: "100%" }}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state.message && (
        <Alert
          severity={state.success ? "success" : "error"}
          sx={{ mb: 3, bgcolor: state.success ? "#1B5E20" : "#B71C1C", color: "white" }}
        >
          {state.message}
        </Alert>
      )}

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
        {isPending ? "Signing In..." : "Sign In"}
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
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            style={{
              color: "#FF6B35",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Sign up here
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

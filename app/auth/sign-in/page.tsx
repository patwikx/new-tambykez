import { Suspense } from "react"
import { Box, Container, Typography, Paper, CircularProgress } from "@mui/material"
import SignInForm from "./sign-in-form"

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000000",
        color: "white",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            bgcolor: "#111111",
            border: "1px solid #333",
            borderRadius: 2,
            p: 4,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                color: "white",
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: "#999" }}>
              Sign in to your Tambykez account
            </Typography>
          </Box>

          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#FF6B35" }} />
              </Box>
            }
          >
            <SignInForm />
          </Suspense>
        </Paper>
      </Container>
    </Box>
  )
}

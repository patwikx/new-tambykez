import { Suspense } from "react"
import { Box, Container, Typography, Paper, Button } from "@mui/material"
import { ErrorOutline } from "@mui/icons-material"
import Link from "next/link"
import ErrorContent from "./error-content"

export default function AuthErrorPage() {
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
            textAlign: "center",
          }}
        >
          <ErrorOutline sx={{ fontSize: 64, color: "#FF6B35", mb: 2 }} />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "white",
              mb: 2,
            }}
          >
            Authentication Error
          </Typography>

          <Suspense
            fallback={
              <Typography variant="body1" sx={{ color: "#999", mb: 4 }}>
                Loading error details...
              </Typography>
            }
          >
            <ErrorContent />
          </Suspense>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              href="/auth/signin"
              variant="contained"
              sx={{
                bgcolor: "#FF6B35",
                color: "white",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "uppercase",
                "&:hover": {
                  bgcolor: "#E55A2B",
                },
              }}
            >
              Try Again
            </Button>

            <Button
              component={Link}
              href="/"
              variant="outlined"
              sx={{
                borderColor: "#444",
                color: "white",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "uppercase",
                "&:hover": {
                  borderColor: "#FF6B35",
                  bgcolor: "rgba(255, 107, 53, 0.1)",
                },
              }}
            >
              Go Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

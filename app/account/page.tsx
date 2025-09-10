import { Suspense } from "react"
import { Box, Container, Typography } from "@mui/material"
import AccountDashboard from "./account-dashboard"

export const metadata = {
  title: "My Account - MotoGear Pro",
  description: "Manage your account, orders, and preferences",
}

export default function AccountPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#000000", color: "white", py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 900,
            textAlign: "center",
            mb: 6,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          My Account
        </Typography>

        <Suspense fallback={<div>Loading account...</div>}>
          <AccountDashboard />
        </Suspense>
      </Container>
    </Box>
  )
}

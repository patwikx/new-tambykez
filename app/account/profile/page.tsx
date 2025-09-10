import { Suspense } from "react"
import { Box, Container, Typography } from "@mui/material"
import ProfileForm from "./profile-form"

export const metadata = {
  title: "Profile Settings - MotoGear Pro",
  description: "Update your profile information and preferences",
}

export default function ProfilePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#000000", color: "white", py: 4 }}>
      <Container maxWidth="md">
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
          Profile Settings
        </Typography>

        <Suspense fallback={<div>Loading profile...</div>}>
          <ProfileForm />
        </Suspense>
      </Container>
    </Box>
  )
}

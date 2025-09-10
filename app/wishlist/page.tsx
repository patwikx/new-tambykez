import { Suspense } from "react"
import { Box, Container, Typography } from "@mui/material"
import WishlistContent from "./wishlist-content"

export const metadata = {
  title: "Wishlist - MotoGear Pro",
  description: "Your saved motorcycle gear and accessories",
}

export default function WishlistPage() {
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
          My Wishlist
        </Typography>

        <Suspense fallback={<div>Loading wishlist...</div>}>
          <WishlistContent />
        </Suspense>
      </Container>
    </Box>
  )
}

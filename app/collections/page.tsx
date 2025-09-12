import { Suspense } from "react"
import { Box, Container, Typography } from "@mui/material"
import CollectionsGrid from "./collections-grid"

export const metadata = {
  title: "Collections - Tambykez",
  description: "Explore our curated collections of premium motorcycle gear",
}

export default function CollectionsPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#000000", color: "white", py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 900,
            textAlign: "center",
            mb: 2,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          Collections
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            mb: 6,
            color: "#999",
            fontWeight: 400,
          }}
        >
          Curated gear collections for every type of rider
        </Typography>

        <Suspense fallback={<div>Loading collections...</div>}>
          <CollectionsGrid />
        </Suspense>
      </Container>
    </Box>
  )
}
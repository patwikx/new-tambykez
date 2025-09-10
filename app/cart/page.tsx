import { Suspense } from "react"
import { Box, Container, Typography } from "@mui/material"
import CartPageContent from "./cart-content"


export const metadata = {
  title: "Shopping Cart - MotoGear Pro",
  description: "Review and manage items in your shopping cart",
}

export default function CartPage() {
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
          Shopping Cart
        </Typography>

        <Suspense fallback={<div>Loading cart...</div>}>
          <CartPageContent />
        </Suspense>
      </Container>
    </Box>
  )
}

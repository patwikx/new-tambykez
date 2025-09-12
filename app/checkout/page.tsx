import { Suspense } from "react"
import { Box, Container, Typography } from "@mui/material"
import CheckoutForm from "./checkout-form"

export const metadata = {
  title: "Checkout - Tambykez",
  description: "Complete your motorcycle gear purchase",
}

export default function CheckoutPage() {
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
          Checkout
        </Typography>

        <Suspense fallback={<div>Loading checkout...</div>}>
          <CheckoutForm />
        </Suspense>
      </Container>
    </Box>
  )
}
import { notFound } from "next/navigation"
import { Box, Container, Typography } from "@mui/material"
import { getOrderById } from "@/lib/actions/order-actions"
import OrderDetails from "./order-details"

interface OrderPageProps {
  params: {
    id: string
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const order = await getOrderById(params.id)

  if (!order) {
    notFound()
  }

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
          Order Details
        </Typography>

        <OrderDetails order={order} />
      </Container>
    </Box>
  )
}
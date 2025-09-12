import { Container } from "@mui/material"
import { getUserOrders } from "@/lib/actions/user-actions"
import UserOrdersContent from "./user-orders-content"

export default async function UserOrdersPage() {
  const orders = await getUserOrders()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <UserOrdersContent initialOrders={orders} />
    </Container>
  )
}

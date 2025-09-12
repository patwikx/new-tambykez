import { Container } from "@mui/material"
import { getAdminOrders } from "@/lib/actions/admin-actions"
import AdminOrdersContent from "./admin-orders-content"

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders()

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <AdminOrdersContent initialOrders={orders} />
    </Container>
  )
}

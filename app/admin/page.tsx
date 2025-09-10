import { getDashboardStats } from "@/lib/actions/admin-actions"
import AdminDashboard from "./admin-dashboard"

export default async function AdminPage() {
  const stats = await getDashboardStats()

  return <AdminDashboard initialStats={stats} />
}

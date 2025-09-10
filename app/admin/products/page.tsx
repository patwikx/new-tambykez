import { getAllProducts } from "@/lib/actions/products"
import AdminProductsContent from "./admin-products-content"

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return <AdminProductsContent initialProducts={products} />
}

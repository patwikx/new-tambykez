import { getNavigationCategories, getNavigationBrands } from "@/lib/actions/navigations"
import Header from "./header"
import { SessionProvider } from "next-auth/react"

export default async function NavigationWrapper() {
  const [categories, brands] = await Promise.all([getNavigationCategories(), getNavigationBrands()])

  return (
    <SessionProvider>
      <Header categories={categories} brands={brands} />
    </SessionProvider>
  )
}

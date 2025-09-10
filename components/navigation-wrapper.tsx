import { getNavigationCategories, getNavigationBrands } from "@/lib/actions/navigations"
import Header from "./header"

export default async function NavigationWrapper() {
  const [categories, brands] = await Promise.all([getNavigationCategories(), getNavigationBrands()])

  return <Header categories={categories} brands={brands} />
}

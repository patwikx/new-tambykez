import { Container, Box, Typography } from "@mui/material"
import { getAllProducts } from "@/lib/actions/products"
import ProductGrid from "@/components/product/product-grid"

export default async function ProductsPage() {
  const products = await getAllProducts()

  // Transform the products to match the expected interface
  const transformedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.id, // Using ID as slug for now
    description: null,
    variants: [
      {
        id: `${product.id}-variant`,
        price: product.price,
        compareAtPrice: null,
        inventory: product.stock,
        isDefault: true,
      },
    ],
    images: ["/professional-equipment.jpg"],
    rating: 4.5,
    reviewCount: 0,
    brand: {
      name: product.brand,
    },
    categories: [
      {
        name: product.category,
      },
    ],
    isNew: false,
  }))

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 700,
            textAlign: "center",
            mb: 6,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "#333",
          }}
        >
          ALL PRODUCTS
        </Typography>
        <ProductGrid products={transformedProducts} />
      </Container>
    </Box>
  )
}

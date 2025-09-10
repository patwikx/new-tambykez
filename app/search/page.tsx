import { Suspense } from "react"
import { Box, Container, Typography } from "@mui/material"
import SearchResults from "./search-results"

export const metadata = {
  title: "Search Results - MotoGear Pro",
  description: "Find the perfect motorcycle gear and accessories",
}

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = typeof params.q === "string" ? params.q : ""

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#000000", color: "white", py: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 900,
            textAlign: "center",
            mb: 2,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          Search Results
        </Typography>

        {query && (
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "#999",
              fontWeight: 400,
            }}
          >
            Showing results for &quot;{query}&quot;
          </Typography>
        )}

        <Suspense fallback={<div>Loading search results...</div>}>
          <SearchResults initialQuery={query} />
        </Suspense>
      </Container>
    </Box>
  )
}

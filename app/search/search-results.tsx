"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Box, Typography, FormControl, Select, MenuItem, Pagination, Button, Skeleton } from "@mui/material"
import { Tune } from "@mui/icons-material"
import {
  searchProducts,
  type SearchResponse,
  type SearchFilters,
  type FilterCriteria,
} from "@/lib/actions/search-actions"
import SearchBar from "@/components/search/search-bar"
import SearchFiltersComponent from "@/components/search/search-filter"
import ProductGrid from "@/components/product/product-grid"

type SortOption = "relevance" | "price_asc" | "price_desc" | "newest" | "rating" | "name_asc" | "name_desc"

interface SearchResultsProps {
  initialQuery?: string
}

export default function SearchResults({ initialQuery = "" }: SearchResultsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    page: 1,
    limit: 12,
    sortBy: "relevance",
  })

  useEffect(() => {
    // Parse URL parameters
    const urlFilters: SearchFilters = {
      query: searchParams.get("q") || initialQuery,
      categories: searchParams.getAll("category"),
      brands: searchParams.getAll("brand"),
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      inStock: searchParams.get("inStock") === "true",
      onSale: searchParams.get("onSale") === "true",
      rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined,
      sortBy: (searchParams.get("sortBy") as SortOption) || "relevance",
      page: Number(searchParams.get("page")) || 1,
      limit: 12,
    }

    setFilters(urlFilters)
    performSearch(urlFilters)
  }, [searchParams, initialQuery])

  const performSearch = async (searchFilters: SearchFilters) => {
    setLoading(true)
    try {
      const response = await searchProducts(searchFilters)
      setSearchResponse(response)
    } catch (error) {
      console.error("Error performing search:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateURL = (newFilters: SearchFilters) => {
    const params = new URLSearchParams()

    if (newFilters.query) params.set("q", newFilters.query)
    if (newFilters.categories?.length) {
      newFilters.categories.forEach((cat: string) => params.append("category", cat))
    }
    if (newFilters.brands?.length) {
      newFilters.brands.forEach((brand: string) => params.append("brand", brand))
    }
    if (newFilters.minPrice !== undefined) params.set("minPrice", newFilters.minPrice.toString())
    if (newFilters.maxPrice !== undefined) params.set("maxPrice", newFilters.maxPrice.toString())
    if (newFilters.inStock) params.set("inStock", "true")
    if (newFilters.onSale) params.set("onSale", "true")
    if (newFilters.rating) params.set("rating", newFilters.rating.toString())
    if (newFilters.sortBy && newFilters.sortBy !== "relevance") params.set("sortBy", newFilters.sortBy)
    if (newFilters.page && newFilters.page > 1) params.set("page", newFilters.page.toString())

    const newURL = `/search${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newURL, { scroll: false })
  }

  const handleFiltersChange = (newFilters: FilterCriteria) => {
    const updatedFilters: SearchFilters = { ...newFilters, page: 1, limit: 12 } // Reset to first page when filters change
    setFilters(updatedFilters)
    updateURL(updatedFilters)
  }

  const handleSortChange = (sortBy: SortOption) => {
    const updatedFilters = { ...filters, sortBy, page: 1 }
    setFilters(updatedFilters)
    updateURL(updatedFilters)
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const updatedFilters = { ...filters, page }
    setFilters(updatedFilters)
    updateURL(updatedFilters)
  }

  const handleSearch = (query: string) => {
    const updatedFilters = { ...filters, query, page: 1 }
    setFilters(updatedFilters)
    updateURL(updatedFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: filters.query,
      page: 1,
      limit: 12,
      sortBy: "relevance",
    }
    setFilters(clearedFilters)
    updateURL(clearedFilters)
  }

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <SearchBar initialQuery={filters.query} onSearch={handleSearch} fullWidth />
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Filters Sidebar */}
        {showFilters && searchResponse && (
          <Box sx={{ width: 280, flexShrink: 0, display: { xs: "none", lg: "block" } }}>
            <SearchFiltersComponent
              filters={filters}
              availableFilters={searchResponse.filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </Box>
        )}

        {/* Main Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Results Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              {loading ? (
                <Skeleton variant="text" width={200} sx={{ bgcolor: "#333" }} />
              ) : (
                <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                  {searchResponse?.totalCount || 0} Results
                  {filters.query && ` for "${filters.query}"`}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Mobile Filter Toggle */}
              <Button
                variant="outlined"
                startIcon={<Tune />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  display: { xs: "flex", lg: "none" },
                  borderColor: "#333",
                  color: "white",
                  "&:hover": {
                    borderColor: "#FF6B35",
                  },
                }}
              >
                Filters
              </Button>

              {/* Sort Dropdown */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={filters.sortBy || "relevance"}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#333",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FF6B35",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FF6B35",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#111111",
                        border: "1px solid #333",
                        "& .MuiMenuItem-root": {
                          color: "white",
                          "&:hover": {
                            bgcolor: "rgba(255, 107, 53, 0.1)",
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                  <MenuItem value="name_asc">Name: A to Z</MenuItem>
                  <MenuItem value="name_desc">Name: Z to A</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Products Grid */}
          {loading ? (
            <ProductGrid products={[]} loading={true} columns={{ xs: 1, sm: 2, md: 2, lg: 3 }} />
          ) : searchResponse ? (
            <>
              <ProductGrid
                products={searchResponse.products.map((product) => ({
                  ...product,
                  categories: product.categories.map((cat: { name: string }) => ({ name: cat.name })),
                }))}
                loading={false}
                columns={{ xs: 1, sm: 2, md: 2, lg: 3 }}
              />

              {/* Pagination */}
              {searchResponse.totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                  <Pagination
                    count={searchResponse.totalPages}
                    page={searchResponse.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "white",
                        borderColor: "#333",
                        "&:hover": {
                          bgcolor: "rgba(255, 107, 53, 0.1)",
                          borderColor: "#FF6B35",
                        },
                        "&.Mui-selected": {
                          bgcolor: "#FF6B35",
                          color: "white",
                          "&:hover": {
                            bgcolor: "#E55A2B",
                          },
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h5" sx={{ color: "#666", mb: 2 }}>
                No results found
              </Typography>
              <Typography variant="body1" sx={{ color: "#999" }}>
                Try adjusting your search terms or filters
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

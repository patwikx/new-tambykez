"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Rating,
  Button,
  Chip,
  Divider,
} from "@mui/material"
import { ExpandMore, FilterList, Clear } from "@mui/icons-material"
import type { FilterCriteria } from "@/lib/actions/search-actions"

interface SearchFiltersProps {
  filters: FilterCriteria
  availableFilters: {
    categories: { id: string; name: string; slug: string; count: number }[]
    brands: { id: string; name: string; slug: string; count: number }[]
    priceRange: { min: number; max: number }
    avgRating: number
  }
  onFiltersChange: (filters: FilterCriteria) => void
  onClearFilters: () => void
}

export default function SearchFiltersComponent({
  filters,
  availableFilters,
  onFiltersChange,
  onClearFilters,
}: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice || availableFilters.priceRange.min,
    filters.maxPrice || availableFilters.priceRange.max,
  ])

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const currentCategories = filters.categories || []
    const newCategories = checked
      ? [...currentCategories, categorySlug]
      : currentCategories.filter((c) => c !== categorySlug)

    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    const currentBrands = filters.brands || []
    const newBrands = checked ? [...currentBrands, brandSlug] : currentBrands.filter((b) => b !== brandSlug)

    onFiltersChange({ ...filters, brands: newBrands })
  }

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number[]
    setPriceRange(value)
  }

  const handlePriceCommit = (event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const value = newValue as number[]
    onFiltersChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    })
  }

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    onFiltersChange({ ...filters, rating: newValue || undefined })
  }

  const handleStockChange = (checked: boolean) => {
    onFiltersChange({ ...filters, inStock: checked || undefined })
  }

  const handleSaleChange = (checked: boolean) => {
    onFiltersChange({ ...filters, onSale: checked || undefined })
  }

  const activeFiltersCount =
    (filters.categories?.length || 0) +
    (filters.brands?.length || 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0)

  return (
    <Box
      sx={{
        bgcolor: "#111111",
        border: "1px solid #333",
        borderRadius: 2,
        p: 3,
        position: "sticky",
        top: 20,
        maxHeight: "calc(100vh - 40px)",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterList sx={{ color: "#FF6B35" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
            Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              sx={{
                bgcolor: "#FF6B35",
                color: "white",
                fontWeight: 600,
                minWidth: 24,
                height: 24,
              }}
            />
          )}
        </Box>
        {activeFiltersCount > 0 && (
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={onClearFilters}
            sx={{
              color: "#999",
              fontSize: "0.75rem",
              "&:hover": {
                color: "#FF6B35",
                bgcolor: "rgba(255, 107, 53, 0.1)",
              },
            }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Categories */}
      {availableFilters.categories.length > 0 && (
        <Accordion
          defaultExpanded
          sx={{
            bgcolor: "transparent",
            boxShadow: "none",
            border: "none",
            "&:before": { display: "none" },
            mb: 2,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore sx={{ color: "white" }} />}
            sx={{
              px: 0,
              minHeight: "auto",
              "& .MuiAccordionSummary-content": {
                margin: "8px 0",
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "white" }}>
              Categories
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <FormGroup>
              {availableFilters.categories.map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      checked={filters.categories?.includes(category.slug) || false}
                      onChange={(e) => handleCategoryChange(category.slug, e.target.checked)}
                      sx={{
                        color: "#666",
                        "&.Mui-checked": {
                          color: "#FF6B35",
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography variant="body2" sx={{ color: "white" }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        ({category.count})
                      </Typography>
                    </Box>
                  }
                  sx={{ width: "100%", mx: 0 }}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      )}

      <Divider sx={{ bgcolor: "#333", my: 2 }} />

      {/* Brands */}
      {availableFilters.brands.length > 0 && (
        <Accordion
          defaultExpanded
          sx={{
            bgcolor: "transparent",
            boxShadow: "none",
            border: "none",
            "&:before": { display: "none" },
            mb: 2,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore sx={{ color: "white" }} />}
            sx={{
              px: 0,
              minHeight: "auto",
              "& .MuiAccordionSummary-content": {
                margin: "8px 0",
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "white" }}>
              Brands
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <FormGroup>
              {availableFilters.brands.map((brand) => (
                <FormControlLabel
                  key={brand.id}
                  control={
                    <Checkbox
                      checked={filters.brands?.includes(brand.slug) || false}
                      onChange={(e) => handleBrandChange(brand.slug, e.target.checked)}
                      sx={{
                        color: "#666",
                        "&.Mui-checked": {
                          color: "#FF6B35",
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography variant="body2" sx={{ color: "white" }}>
                        {brand.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        ({brand.count})
                      </Typography>
                    </Box>
                  }
                  sx={{ width: "100%", mx: 0 }}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      )}

      <Divider sx={{ bgcolor: "#333", my: 2 }} />

      {/* Price Range */}
      <Accordion
        defaultExpanded
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          border: "none",
          "&:before": { display: "none" },
          mb: 2,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "white" }} />}
          sx={{
            px: 0,
            minHeight: "auto",
            "& .MuiAccordionSummary-content": {
              margin: "8px 0",
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "white" }}>
            Price Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceCommit}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value}`}
              min={availableFilters.priceRange.min}
              max={availableFilters.priceRange.max}
              sx={{
                color: "#FF6B35",
                "& .MuiSlider-thumb": {
                  bgcolor: "#FF6B35",
                },
                "& .MuiSlider-track": {
                  bgcolor: "#FF6B35",
                },
                "& .MuiSlider-rail": {
                  bgcolor: "#333",
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="body2" sx={{ color: "#999" }}>
                ${priceRange[0]}
              </Typography>
              <Typography variant="body2" sx={{ color: "#999" }}>
                ${priceRange[1]}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ bgcolor: "#333", my: 2 }} />

      {/* Rating */}
      <Accordion
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          border: "none",
          "&:before": { display: "none" },
          mb: 2,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "white" }} />}
          sx={{
            px: 0,
            minHeight: "auto",
            "& .MuiAccordionSummary-content": {
              margin: "8px 0",
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "white" }}>
            Customer Rating
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[4, 3, 2, 1].map((rating) => (
              <FormControlLabel
                key={rating}
                control={
                  <Checkbox
                    checked={filters.rating === rating}
                    onChange={(e) => handleRatingChange(e, e.target.checked ? rating : null)}
                    sx={{
                      color: "#666",
                      "&.Mui-checked": {
                        color: "#FF6B35",
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating
                      value={rating}
                      readOnly
                      size="small"
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#FF6B35",
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ color: "white" }}>
                      & Up
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ bgcolor: "#333", my: 2 }} />

      {/* Availability & Special Offers */}
      <Accordion
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          border: "none",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "white" }} />}
          sx={{
            px: 0,
            minHeight: "auto",
            "& .MuiAccordionSummary-content": {
              margin: "8px 0",
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "white" }}>
            Availability
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.inStock || false}
                  onChange={(e) => handleStockChange(e.target.checked)}
                  sx={{
                    color: "#666",
                    "&.Mui-checked": {
                      color: "#FF6B35",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "white" }}>
                  In Stock Only
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onSale || false}
                  onChange={(e) => handleSaleChange(e.target.checked)}
                  sx={{
                    color: "#666",
                    "&.Mui-checked": {
                      color: "#FF6B35",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "white" }}>
                  On Sale
                </Typography>
              }
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

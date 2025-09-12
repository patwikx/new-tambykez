"use client"

import { useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Button,
  IconButton,
  Rating,
  Chip,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from "@mui/material"
import { Close, ShoppingCart, Favorite, FavoriteBorder, Add, Remove } from "@mui/icons-material"
import Image from "next/image"
import { addToCart } from "@/lib/actions/cart-actions"
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist-actions"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface ProductVariant {
  id: string
  name: string
  price: number
  compareAtPrice: number | null
  inventory: number
  isDefault: boolean
  size: string | null
  color: string | null
  colorHex: string | null
}

interface ProductQuickViewProps {
  open: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    slug: string
    description: string | null
    shortDescription: string | null
    variants: ProductVariant[]
    images: string[]
    rating: number
    reviewCount: number
    brand: {
      name: string
    }
  }
  isInWishlist?: boolean
}

export default function ProductQuickView({ open, onClose, product, isInWishlist = false }: ProductQuickViewProps) {
  const { user } = useAuth()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants.find((v) => v.isDefault) || product.variants[0],
  )
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist)
  const [isPending, startTransition] = useTransition()

  const hasDiscount = selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price
  const discountPercentage = hasDiscount
    ? Math.round(((selectedVariant.compareAtPrice! - selectedVariant.price) / selectedVariant.compareAtPrice!) * 100)
    : 0

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart")
      return
    }

    if (!selectedVariant) {
      toast.error("Please select a variant")
      return
    }

    startTransition(async () => {
      const result = await addToCart(selectedVariant.id, quantity)
      if (result.success) {
        toast.success("Added to cart!")
        onClose()
      } else {
        toast.error(result.error || "Failed to add to cart")
      }
    })
  }

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please sign in to manage wishlist")
      return
    }

    startTransition(async () => {
      const result = isWishlisted ? await removeFromWishlist(product.id) : await addToWishlist(product.id)

      if (result.success) {
        setIsWishlisted(!isWishlisted)
        toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
      } else {
        toast.error(result.error || "Failed to update wishlist")
      }
    })
  }

  const uniqueSizes = [...new Set(product.variants.map((v) => v.size).filter((s): s is string => s !== null))]
  const uniqueColors = [...new Set(product.variants.map((v) => v.color).filter((c): c is string => c !== null))]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "white",
          color: "#333",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
        },
      }}
    >
           {" "}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2 }}>
               {" "}
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>
                    Quick View        {" "}
        </Typography>
               {" "}
        <IconButton onClick={onClose} sx={{ color: "#666" }}>
                    <Close />       {" "}
        </IconButton>
             {" "}
      </DialogTitle>
           {" "}
      <DialogContent sx={{ p: 0 }}>
               {" "}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
                    {/* Product Images */}         {" "}
          <Box sx={{ flex: 1, p: 3 }}>
                       {" "}
            <Box sx={{ position: "relative", mb: 2 }}>
                           {" "}
              <Image
                src={
                  product.images[currentImageIndex] ||
                  "/placeholder.svg?height=400&width=400&query=professional equipment"
                }
                alt={product.name}
                width={400}
                height={400}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              />
                           {" "}
              {hasDiscount && (
                <Chip
                  label={`-${discountPercentage}%`}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    bgcolor: "#DC143C",
                    color: "white",
                    fontWeight: 700,
                  }}
                />
              )}
                         {" "}
            </Box>
                       {" "}
            {product.images.length > 1 && (
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
                               {" "}
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    sx={{
                      minWidth: 60,
                      height: 60,
                      cursor: "pointer",
                      border: currentImageIndex === index ? "2px solid #DC143C" : "2px solid #e0e0e0",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                                       {" "}
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={60}
                      height={60}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                                     {" "}
                  </Box>
                ))}
                             {" "}
              </Box>
            )}
                     {" "}
          </Box>
                    {/* Product Details */}         {" "}
          <Box sx={{ flex: 1, p: 3 }}>
                        {/* Brand */}           {" "}
            <Typography
              variant="body2"
              sx={{
                color: "#DC143C",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1,
              }}
            >
                            {product.brand.name}           {" "}
            </Typography>
                        {/* Product Name */}           {" "}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#333",
                mb: 2,
                lineHeight: 1.3,
              }}
            >
                            {product.name}           {" "}
            </Typography>
                        {/* Rating */}           {" "}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                           {" "}
              <Rating
                value={product.rating}
                precision={0.1}
                readOnly
                size="small"
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#DC143C",
                  },
                }}
              />
                           {" "}
              <Typography variant="body2" sx={{ color: "#666", ml: 1 }}>
                                ({product.reviewCount} reviews)              {" "}
              </Typography>
                         {" "}
            </Box>
                        {/* Price */}           {" "}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                           {" "}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#DC143C",
                }}
              >
                                ₱{selectedVariant?.price || 0}             {" "}
              </Typography>
                           {" "}
              {hasDiscount && (
                <Typography
                  variant="h6"
                  sx={{
                    color: "#999",
                    textDecoration: "line-through",
                  }}
                >
                                    ₱{selectedVariant?.compareAtPrice}               {" "}
                </Typography>
              )}
                         {" "}
            </Box>
                        {/* Description */}           {" "}
            {product.shortDescription && (
              <Typography variant="body2" sx={{ color: "#666", mb: 3, lineHeight: 1.6 }}>
                                {product.shortDescription}             {" "}
              </Typography>
            )}
                        {/* Variant Selection */}           {" "}
            {uniqueSizes.length > 0 && (
              <Box sx={{ mb: 2 }}>
                               {" "}
                <Typography variant="body2" sx={{ color: "#333", mb: 1, fontWeight: 600 }}>
                                    Size                {" "}
                </Typography>
                               {" "}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                                   {" "}
                  <Select
                    value={selectedVariant?.size || ""}
                    onChange={(e) => {
                      const variant = product.variants.find((v) => v.size === (e.target.value as string))
                      if (variant) setSelectedVariant(variant)
                    }}
                    sx={{
                      color: "#333",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#DC143C",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#DC143C",
                      },
                    }}
                  >
                                       {" "}
                    {uniqueSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                                                {size}                     {" "}
                      </MenuItem>
                    ))}
                                     {" "}
                  </Select>
                                 {" "}
                </FormControl>
                             {" "}
              </Box>
            )}
                       {" "}
            {uniqueColors.length > 0 && (
              <Box sx={{ mb: 2 }}>
                               {" "}
                <Typography variant="body2" sx={{ color: "#333", mb: 1, fontWeight: 600 }}>
                                    Color                {" "}
                </Typography>
                               {" "}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                   {" "}
                  {uniqueColors.map((color) => {
                    const colorVariant = product.variants.find((v) => v.color === color)
                    return (
                      <Button
                        key={color}
                        variant={selectedVariant?.color === color ? "contained" : "outlined"}
                        size="small"
                        onClick={() => {
                          if (colorVariant) setSelectedVariant(colorVariant)
                        }}
                        sx={{
                          minWidth: "auto",
                          px: 2,
                          color: selectedVariant?.color === color ? "white" : "#666",
                          borderColor: selectedVariant?.color === color ? "#DC143C" : "#e0e0e0",
                          bgcolor: selectedVariant?.color === color ? "#DC143C" : "transparent",
                          "&:hover": {
                            borderColor: "#DC143C",
                            bgcolor: selectedVariant?.color === color ? "#B91C3C" : "rgba(220, 20, 60, 0.1)",
                          },
                        }}
                      >
                                                {color}                     {" "}
                      </Button>
                    )
                  })}
                                 {" "}
                </Box>
                             {" "}
              </Box>
            )}
                        {/* Stock Status */}           {" "}
            <Box sx={{ mb: 3 }}>
                           {" "}
              {selectedVariant?.inventory > 0 ? (
                <Typography variant="body2" sx={{ color: "#4ade80", fontWeight: 500 }}>
                                    ✓ In Stock ({selectedVariant.inventory} available)                {" "}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: "#ef4444", fontWeight: 500 }}>
                                    ✗ Out of Stock                {" "}
                </Typography>
              )}
                         {" "}
            </Box>
                        {/* Quantity Selector */}           {" "}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                           {" "}
              <Typography variant="body2" sx={{ color: "#333", fontWeight: 600 }}>
                                Quantity:              {" "}
              </Typography>
                           {" "}
              <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: 1 }}>
                               {" "}
                <IconButton
                  size="small"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  sx={{ color: "#666" }}
                >
                                    <Remove />               {" "}
                </IconButton>
                               {" "}
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const val = Number.parseInt(e.target.value) || 1
                    setQuantity(Math.max(1, Math.min(selectedVariant?.inventory || 1, val)))
                  }}
                  size="small"
                  sx={{
                    width: 60,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { border: "none" },
                      "& input": { textAlign: "center", color: "#333" },
                    },
                  }}
                />
                               {" "}
                <IconButton
                  size="small"
                  onClick={() => setQuantity(Math.min(selectedVariant?.inventory || 1, quantity + 1))}
                  disabled={quantity >= (selectedVariant?.inventory || 1)}
                  sx={{ color: "#666" }}
                >
                                    <Add />               {" "}
                </IconButton>
                             {" "}
              </Box>
                         {" "}
            </Box>
                        {/* Action Buttons */}           {" "}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                           {" "}
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={isPending || !selectedVariant || selectedVariant.inventory <= 0}
                sx={{
                  bgcolor: "#DC143C",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#B91C3C",
                  },
                  "&:disabled": {
                    bgcolor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                                {!selectedVariant || selectedVariant.inventory <= 0 ? "OUT OF STOCK" : "ADD TO CART"}   
                         {" "}
              </Button>
                           {" "}
              <IconButton
                onClick={handleWishlistToggle}
                disabled={isPending}
                sx={{
                  border: "1px solid #e0e0e0",
                  color: isWishlisted ? "#DC143C" : "#666",
                  "&:hover": {
                    borderColor: "#DC143C",
                    bgcolor: "rgba(220, 20, 60, 0.1)",
                  },
                }}
              >
                                {isWishlisted ? <Favorite /> : <FavoriteBorder />}             {" "}
              </IconButton>
                         {" "}
            </Box>
                     {" "}
          </Box>
                 {" "}
        </Box>
             {" "}
      </DialogContent>
         {" "}
    </Dialog>
  )
}

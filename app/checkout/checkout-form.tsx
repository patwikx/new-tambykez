"use client"

import { useState, useEffect, useTransition } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  Skeleton,
} from "@mui/material"
import { CreditCard, LocalShipping, Security } from "@mui/icons-material"
import { getCartItems, type CartItemWithDetails } from "@/lib/actions/cart-actions"
import { getUserAddresses, type UserAddress } from "@/lib/actions/user-actions"
import { createOrder } from "@/lib/actions/order-actions"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CheckoutForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([])
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedShippingAddress, setSelectedShippingAddress] = useState("")
  const [selectedBillingAddress, setSelectedBillingAddress] = useState("")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (user) {
      loadCheckoutData()
    }
  }, [user])

  const loadCheckoutData = async () => {
    try {
      const [items, userAddresses] = await Promise.all([
        getCartItems(),
        getUserAddresses(),
      ])
      setCartItems(items)
      setAddresses(userAddresses)
      
      // Set default addresses
      const defaultAddress = userAddresses.find(addr => addr.isDefault)
      if (defaultAddress) {
        setSelectedShippingAddress(defaultAddress.id)
        setSelectedBillingAddress(defaultAddress.id)
      }
    } catch (error) {
      console.error("Error loading checkout data:", error)
      toast.error("Failed to load checkout data")
    } finally {
      setLoading(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.productVariant.price * item.quantity, 0)
  const shippingCost = shippingMethod === "express" ? 200 : subtotal > 2500 ? 0 : 150
  const tax = subtotal * 0.12 // 12% VAT
  const total = subtotal + shippingCost + tax

  const handlePlaceOrder = () => {
    if (!selectedShippingAddress || !selectedBillingAddress) {
      toast.error("Please select shipping and billing addresses")
      return
    }

    startTransition(async () => {
      try {
        const result = await createOrder({
          shippingAddressId: selectedShippingAddress,
          billingAddressId: selectedBillingAddress,
          shippingMethod,
          paymentMethod,
        })

        if (result.success) {
          toast.success("Order placed successfully!")
          router.push(`/orders/${result.orderId}`)
        } else {
          toast.error(result.error || "Failed to place order")
        }
      } catch (error) {
        console.error("Error placing order:", error)
        toast.error("Failed to place order")
      }
    })
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" sx={{ color: "#666", mb: 2 }}>
          Please sign in to checkout
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/auth/signin"
          sx={{
            bgcolor: "#FF6B35",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase",
            "&:hover": {
              bgcolor: "#E55A2B",
            },
          }}
        >
          Sign In
        </Button>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", lg: "row" } }}>
        <Box sx={{ flex: 2 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} sx={{ bgcolor: "#111111", border: "1px solid #333", mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" width="60%" sx={{ bgcolor: "#333", mb: 2 }} />
                <Skeleton variant="rectangular" height={100} sx={{ bgcolor: "#333" }} />
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card sx={{ bgcolor: "#111111", border: "1px solid #333" }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" sx={{ bgcolor: "#333", mb: 2 }} />
              <Skeleton variant="rectangular" height={200} sx={{ bgcolor: "#333" }} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" sx={{ color: "#666", mb: 2 }}>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/"
          sx={{
            bgcolor: "#FF6B35",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase",
            "&:hover": {
              bgcolor: "#E55A2B",
            },
          }}
        >
          Continue Shopping
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", lg: "row" } }}>
      {/* Checkout Form */}
      <Box sx={{ flex: 2 }}>
        {/* Shipping Address */}
        <Card sx={{ bgcolor: "#111111", border: "1px solid #333", mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <LocalShipping sx={{ color: "#FF6B35" }} />
              Shipping Address
            </Typography>
            
            {addresses.length === 0 ? (
              <Alert severity="warning" sx={{ bgcolor: "#d97706", color: "white" }}>
                No addresses found. Please add an address first.
              </Alert>
            ) : (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedShippingAddress}
                  onChange={(e) => setSelectedShippingAddress(e.target.value)}
                >
                  {addresses.map((address) => (
                    <FormControlLabel
                      key={address.id}
                      value={address.id}
                      control={<Radio sx={{ color: "#FF6B35", "&.Mui-checked": { color: "#FF6B35" } }} />}
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                            {address.firstName} {address.lastName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#999" }}>
                            {address.addressLine1}, {address.city}, {address.state} {address.zipCode}
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 2, alignItems: "flex-start" }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </CardContent>
        </Card>

        {/* Shipping Method */}
        <Card sx={{ bgcolor: "#111111", border: "1px solid #333", mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 3 }}>
              Shipping Method
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                <FormControlLabel
                  value="standard"
                  control={<Radio sx={{ color: "#FF6B35", "&.Mui-checked": { color: "#FF6B35" } }} />}
                  label={
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Box>
                        <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                          Standard Shipping
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#999" }}>
                          3-5 business days
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                        {subtotal > 2500 ? "FREE" : "₱150"}
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, alignItems: "flex-start", width: "100%" }}
                />
                <FormControlLabel
                  value="express"
                  control={<Radio sx={{ color: "#FF6B35", "&.Mui-checked": { color: "#FF6B35" } }} />}
                  label={
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Box>
                        <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                          Express Shipping
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#999" }}>
                          1-2 business days
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                        ₱200
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: "flex-start", width: "100%" }}
                />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card sx={{ bgcolor: "#111111", border: "1px solid #333", mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <CreditCard sx={{ color: "#FF6B35" }} />
              Payment Method
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio sx={{ color: "#FF6B35", "&.Mui-checked": { color: "#FF6B35" } }} />}
                  label={
                    <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                      Credit/Debit Card
                    </Typography>
                  }
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  value="gcash"
                  control={<Radio sx={{ color: "#FF6B35", "&.Mui-checked": { color: "#FF6B35" } }} />}
                  label={
                    <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                      GCash
                    </Typography>
                  }
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  value="paymaya"
                  control={<Radio sx={{ color: "#FF6B35", "&.Mui-checked": { color: "#FF6B35" } }} />}
                  label={
                    <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                      PayMaya
                    </Typography>
                  }
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  value="cod"
                  control={<Radio sx={{ color: "#FF6B35", "&.Mui-checked": { color: "#FF6B35" } }} />}
                  label={
                    <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                      Cash on Delivery
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      </Box>

      {/* Order Summary */}
      <Box sx={{ flex: 1 }}>
        <Card sx={{ bgcolor: "#111111", border: "1px solid #333", position: "sticky", top: 20 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 3 }}>
              Order Summary
            </Typography>

            {/* Cart Items */}
            <Box sx={{ mb: 3 }}>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                      {item.productVariant.product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#999" }}>
                      Qty: {item.quantity} × ₱{item.productVariant.price}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                    ₱{(item.productVariant.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ bgcolor: "#333", my: 2 }} />

            {/* Pricing Breakdown */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "#999" }}>
                Subtotal
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                ₱{subtotal.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "#999" }}>
                Shipping
              </Typography>
              <Typography variant="body2" sx={{ color: shippingCost === 0 ? "#10b981" : "white" }}>
                {shippingCost === 0 ? "FREE" : `₱${shippingCost.toFixed(2)}`}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" sx={{ color: "#999" }}>
                Tax (VAT 12%)
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                ₱{tax.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ bgcolor: "#333", my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#FF6B35" }}>
                ₱{total.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handlePlaceOrder}
              disabled={isPending || !selectedShippingAddress || !selectedBillingAddress}
              startIcon={<Security />}
              sx={{
                bgcolor: "#FF6B35",
                color: "white",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                py: 1.5,
                "&:hover": {
                  bgcolor: "#E55A2B",
                },
                "&:disabled": {
                  bgcolor: "#666",
                  color: "#999",
                },
              }}
            >
              {isPending ? "Processing..." : "Place Order"}
            </Button>

            <Typography variant="body2" sx={{ color: "#999", textAlign: "center", mt: 2 }}>
              Your payment information is secure and encrypted
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
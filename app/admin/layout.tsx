import type React from "react"
import { checkAdminAccess } from "@/lib/actions/admin-actions"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material"
import { Dashboard, Inventory, ShoppingCart, People, Settings } from "@mui/icons-material"
import Link from "next/link"

const drawerWidth = 240

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, href: "/admin" },
  { text: "Products", icon: <Inventory />, href: "/admin/products" },
  { text: "Orders", icon: <ShoppingCart />, href: "/admin/orders" },
  { text: "Users", icon: <People />, href: "/admin/users" },
  { text: "Settings", icon: <Settings />, href: "/admin/settings" },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await checkAdminAccess()

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "grey.900",
            borderRight: "1px solid",
            borderColor: "grey.800",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ color: "white" }}>
            Admin Panel
          </Typography>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} href={item.href}>
                <ListItemIcon sx={{ color: "grey.400" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ "& .MuiListItemText-primary": { color: "white" } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "grey.900", minHeight: "100vh" }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}

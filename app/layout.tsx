import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import MaterialUIProvider from "@/components/theme-provider"
import NavigationWrapper from "@/components/navigation-wrapper"
import Footer from "@/components/footer"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "MotoGear Pro - Premium Motorcycle Gear & Accessories",
  description:
    "Discover premium motorcycle gear, helmets, jackets, gloves, and accessories. Shop the latest in motorcycle safety and style with fast shipping and expert support.",
  keywords:
    "motorcycle gear, motorcycle helmets, motorcycle jackets, motorcycle gloves, motorcycle accessories, bike gear, riding gear",
  authors: [{ name: "MotoGear Pro" }],
  creator: "MotoGear Pro",
  publisher: "MotoGear Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://motogear-pro.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MotoGear Pro - Premium Motorcycle Gear & Accessories",
    description:
      "Discover premium motorcycle gear, helmets, jackets, gloves, and accessories. Shop the latest in motorcycle safety and style.",
    url: "https://motogear-pro.com",
    siteName: "MotoGear Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MotoGear Pro - Premium Motorcycle Gear & Accessories",
    description:
      "Discover premium motorcycle gear, helmets, jackets, gloves, and accessories. Shop the latest in motorcycle safety and style.",
    creator: "@motogear_pro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <MaterialUIProvider>
          <NavigationWrapper />
          <main>{children}</main>
          <Footer />
        </MaterialUIProvider>
      </body>
    </html>
  )
}

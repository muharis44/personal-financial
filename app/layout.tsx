import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { FinanceProvider } from "@/contexts/finance-context"
import { PrivacyProvider } from "@/contexts/privacy-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FPP - Financial Personal Planner | Kelola Keuangan Pribadi",
  description: "Aplikasi perencanaan keuangan pribadi lengkap untuk mengelola pemasukan, pengeluaran, investasi, utang piutang, dan target tabungan Anda dengan mudah dan aman.",
  keywords: [
    "financial planner",
    "perencanaan keuangan",
    "aplikasi keuangan",
    "pencatatan keuangan",
    "budget management",
    "investasi",
    "tabungan",
    "utang piutang",
    "pengelolaan keuangan pribadi",
  ],
  authors: [{ name: "FPP Team" }],
  creator: "FPP - Financial Personal Planner",
  publisher: "FPP",
  applicationName: "Financial Personal Planner",
  generator: "Next.js",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "FPP - Financial Personal Planner",
    description: "Aplikasi perencanaan keuangan pribadi lengkap untuk mengelola pemasukan, pengeluaran, investasi, dan target keuangan Anda.",
    siteName: "Financial Personal Planner",
    images: [
      {
        url: "/logo.svg",
        width: 200,
        height: 200,
        alt: "FPP - Financial Personal Planner Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FPP - Financial Personal Planner",
    description: "Aplikasi perencanaan keuangan pribadi lengkap untuk mengelola pemasukan, pengeluaran, dan investasi Anda.",
    images: ["/logo.svg"],
    creator: "@fpp_app",
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
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <FinanceProvider>
            <PrivacyProvider>{children}</PrivacyProvider>
          </FinanceProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BookmarkProvider } from "@/lib/bookmark-context"
import { AuthProvider } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { AuthWrapper } from "@/components/auth-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HR Performance Dashboard",
  description: "Advanced HR dashboard for managing employee performance and analytics",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} dark bg-black text-white`}>
        <AuthProvider>
          <BookmarkProvider>
            <AuthWrapper>
              <div className="min-h-screen bg-black">
                <Navbar />
                <main className="w-full">{children}</main>
              </div>
            </AuthWrapper>
          </BookmarkProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

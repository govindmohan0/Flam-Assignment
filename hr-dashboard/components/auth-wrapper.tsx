"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { Skeleton } from "@/components/ui/skeleton"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-800 mx-auto" />
          <Skeleton className="h-4 w-48 bg-gray-800" />
          <Skeleton className="h-4 w-32 bg-gray-800" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <>{children}</>
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { GoogleAuth } from "@/components/google-auth"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useGoogleAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return <GoogleAuth onSuccess={() => router.push("/dashboard")} />
}

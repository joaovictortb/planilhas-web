"use client"

import { useState, useEffect } from "react"
import type { GoogleUser } from "@/lib/types"

const TOKEN_KEY = "google_access_token"
const USER_KEY = "google_user"

export function useGoogleAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load from localStorage on mount
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)

    if (storedToken && storedUser) {
      setAccessToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (token: string, userData: GoogleUser) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setAccessToken(token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setAccessToken(null)
    setUser(null)
  }

  return {
    accessToken,
    user,
    isLoading,
    isAuthenticated: !!accessToken && !!user,
    login,
    logout,
  }
}

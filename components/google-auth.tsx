"use client"

import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from "react"

interface GoogleAuthProps {
  onSuccess?: () => void
}

const GOOGLE_CLIENT_ID = "161359966062-jbevurgqsa5ac906g9uanu1ko541jo7e.apps.googleusercontent.com"

function GoogleAuthContent({ onSuccess }: GoogleAuthProps) {
  const { login } = useGoogleAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("[v0] OAuth success, access token received")
      setIsLoading(true)
      setError(null)

      try {
        // Fetch user info using the access token
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })

        if (!userInfoResponse.ok) {
          throw new Error("Failed to fetch user info")
        }

        const userInfo = await userInfoResponse.json()
        console.log("[v0] User info fetched:", userInfo.email)

        // Store the access token and user info
        login(tokenResponse.access_token, {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          sub: userInfo.id,
        })

        onSuccess?.()
      } catch (err) {
        console.error("[v0] Error fetching user info:", err)
        setError("Falha ao obter informações do usuário. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    },
    onError: (error) => {
      console.error("[v0] Login Failed:", error)
      setError("Falha no login. Verifique suas credenciais e tente novamente.")
      setIsLoading(false)
    },
    scope: "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets",
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <FileSpreadsheet className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Painel de Planilhas</CardTitle>
            <CardDescription className="mt-2">
              Gerencie suas planilhas do Google Sheets com estatísticas e visualizações inteligentes
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-center">
            <Button onClick={() => handleLogin()} disabled={isLoading} size="lg" className="w-full">
              {isLoading ? "Conectando..." : "Entrar com Google"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Ao continuar, você concorda em compartilhar acesso às suas planilhas do Google Drive
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function GoogleAuth({ onSuccess }: GoogleAuthProps) {
  console.log("[v0] Using Google Client ID:", GOOGLE_CLIENT_ID)

  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-center text-destructive">Configuração Necessária</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Client ID não configurado</AlertTitle>
              <AlertDescription>Por favor, configure o Client ID do Google OAuth no código.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleAuthContent onSuccess={onSuccess} />
    </GoogleOAuthProvider>
  )
}

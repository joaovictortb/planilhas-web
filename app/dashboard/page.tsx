"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { useSheets } from "@/context/sheets-context"
import { Navbar } from "@/components/navbar"
import { DriveFilesList } from "@/components/drive-files-list"
import { SheetViewer } from "@/components/sheet-viewer"
import { StatsPanel } from "@/components/stats-panel"
import { ChartsPanel } from "@/components/charts-panel"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useGoogleAuth()
  const { setCurrentSheet } = useSheets()
  const [selectedView, setSelectedView] = useState<"table" | "stats" | "charts">("table")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  const handleSelectSheet = (id: string, name: string) => {
    setCurrentSheet({ id, name })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-6rem)]">
          {/* Sidebar - Files List */}
          <div className="lg:col-span-3 h-full">
            <DriveFilesList onSelectSheet={handleSelectSheet} />
          </div>

          {/* Main Content - Sheet Viewer */}
          <div className="lg:col-span-6 h-full">
            <SheetViewer />
          </div>

          {/* Right Panel - Stats and Charts */}
          <div className="lg:col-span-3 h-full space-y-4 overflow-y-auto">
            <StatsPanel />
            <ChartsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

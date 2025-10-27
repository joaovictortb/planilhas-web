"use client"

import { useState, useEffect } from "react"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { useSheets } from "@/context/sheets-context"
import { listSpreadsheets } from "@/lib/google-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileSpreadsheet, Loader2, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface DriveFilesListProps {
  onSelectSheet: (id: string, name: string) => void
}

export function DriveFilesList({ onSelectSheet }: DriveFilesListProps) {
  const { accessToken } = useGoogleAuth()
  const { currentSheet } = useSheets()
  const [files, setFiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFiles = async () => {
    if (!accessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const spreadsheets = await listSpreadsheets(accessToken)
      setFiles(spreadsheets)
    } catch (err) {
      setError("Erro ao carregar planilhas")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [accessToken])

  return (
    <Card className="h-full flex flex-col shadow-lg border-border/50">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Minhas Planilhas
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={loadFiles} disabled={isLoading} className="h-8 w-8">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          {isLoading && files.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-destructive">{error}</div>
          ) : files.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">Nenhuma planilha encontrada</div>
          ) : (
            <div className="p-2 space-y-1">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => onSelectSheet(file.id, file.name)}
                  className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-accent/50 ${
                    currentSheet?.id === file.id ? "bg-accent text-accent-foreground" : "text-foreground"
                  }`}
                >
                  <div className="font-medium text-sm truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(file.modifiedTime), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

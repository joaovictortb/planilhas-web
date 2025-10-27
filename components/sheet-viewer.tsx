"use client"

import { useState, useEffect } from "react"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { useSheets } from "@/context/sheets-context"
import { getSheetData, updateSheetData, getSpreadsheetMetadata } from "@/lib/google-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Save, TableIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SheetViewer() {
  const { accessToken } = useGoogleAuth()
  const { currentSheet, sheetData, setSheetData, calculateStats } = useSheets()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedData, setEditedData] = useState<string[][]>([])
  const [activeSheet, setActiveSheet] = useState<string>("Sheet1")
  const { toast } = useToast()

  useEffect(() => {
    if (currentSheet && accessToken) {
      loadSheetData()
    }
  }, [currentSheet, accessToken, activeSheet])

  const loadSheetData = async () => {
    if (!currentSheet || !accessToken) return

    setIsLoading(true)
    try {
      // Get metadata to find available sheets
      const metadata = await getSpreadsheetMetadata(accessToken, currentSheet.id)
      const sheets = metadata.sheets || []

      // Use first sheet if activeSheet doesn't exist
      const sheetName = sheets.length > 0 ? sheets[0].properties.title : "Sheet1"
      setActiveSheet(sheetName)

      const data = await getSheetData(accessToken, currentSheet.id, sheetName)
      setSheetData(data)
      setEditedData(data.values || [])
      calculateStats(data.values || [])
    } catch (err) {
      console.error(err)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da planilha",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...editedData]
    if (!newData[rowIndex]) {
      newData[rowIndex] = []
    }
    newData[rowIndex][colIndex] = value
    setEditedData(newData)
  }

  const handleSave = async () => {
    if (!currentSheet || !accessToken) return

    setIsSaving(true)
    try {
      await updateSheetData(accessToken, currentSheet.id, activeSheet, editedData)
      setSheetData({ range: activeSheet, values: editedData })
      calculateStats(editedData)
      toast({
        title: "Sucesso",
        description: "Alterações salvas com sucesso",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!currentSheet) {
    return (
      <Card className="h-full flex items-center justify-center shadow-lg border-border/50">
        <CardContent className="text-center text-muted-foreground">
          <TableIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Selecione uma planilha para visualizar</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center shadow-lg border-border/50">
        <CardContent>
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col shadow-lg border-border/50">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold truncate">{currentSheet.name}</CardTitle>
          <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {editedData.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex === 0 ? "bg-muted/50" : ""}>
                      {row.map((cell, colIndex) => (
                        <td key={`${rowIndex}-${colIndex}`} className="border-r border-b border-border last:border-r-0">
                          <Input
                            value={cell || ""}
                            onChange={(e) => handleCellEdit(rowIndex, colIndex, e.target.value)}
                            className={`border-0 rounded-none h-10 ${rowIndex === 0 ? "font-semibold" : ""}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

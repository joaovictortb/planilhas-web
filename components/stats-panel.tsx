"use client"

import { useSheets } from "@/context/sheets-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Hash, Activity } from "lucide-react"

export function StatsPanel() {
  const { stats, sheetData } = useSheets()

  if (!stats || !sheetData) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Nenhum dado disponível</CardContent>
      </Card>
    )
  }

  const headers = sheetData.values[0] || []

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Estatísticas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Visão Geral</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Hash className="w-4 h-4" />
                <span className="text-xs">Linhas</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalRows}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs">Colunas</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalColumns}</div>
            </div>
          </div>
        </div>

        {/* Column Stats */}
        {stats.numericColumns.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Colunas Numéricas</h3>
            <div className="space-y-3">
              {stats.numericColumns.map((colIndex) => {
                const colStats = stats.columnStats[colIndex]
                const columnName = headers[colIndex] || `Coluna ${colIndex + 1}`

                return (
                  <div key={colIndex} className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{columnName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {colStats.uniqueValues} únicos
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Soma:</span>
                        <span className="ml-2 font-mono font-semibold">{colStats.sum.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Média:</span>
                        <span className="ml-2 font-mono font-semibold">{colStats.average.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mín:</span>
                        <span className="ml-2 font-mono font-semibold">{colStats.min.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Máx:</span>
                        <span className="ml-2 font-mono font-semibold">{colStats.max.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

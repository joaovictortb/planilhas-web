"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { SheetData, SheetStats } from "@/lib/types"

interface SheetsContextType {
  currentSheet: { id: string; name: string } | null
  sheetData: SheetData | null
  stats: SheetStats | null
  setCurrentSheet: (sheet: { id: string; name: string } | null) => void
  setSheetData: (data: SheetData | null) => void
  calculateStats: (data: string[][]) => void
}

const SheetsContext = createContext<SheetsContextType | undefined>(undefined)

export function SheetsProvider({ children }: { children: ReactNode }) {
  const [currentSheet, setCurrentSheet] = useState<{ id: string; name: string } | null>(null)
  const [sheetData, setSheetData] = useState<SheetData | null>(null)
  const [stats, setStats] = useState<SheetStats | null>(null)

  const calculateStats = (values: string[][]) => {
    if (!values || values.length === 0) {
      setStats(null)
      return
    }

    const totalRows = values.length
    const totalColumns = values[0]?.length || 0
    const numericColumns: number[] = []
    const columnStats: SheetStats["columnStats"] = {}

    // Analyze each column
    for (let col = 0; col < totalColumns; col++) {
      const columnValues = values.slice(1).map((row) => row[col]) // Skip header
      const numericValues = columnValues.map((v) => Number.parseFloat(v)).filter((v) => !isNaN(v))

      if (numericValues.length > 0) {
        numericColumns.push(col)
        const sum = numericValues.reduce((a, b) => a + b, 0)
        const average = sum / numericValues.length
        const min = Math.min(...numericValues)
        const max = Math.max(...numericValues)
        const uniqueValues = new Set(columnValues).size

        columnStats[col] = {
          sum,
          average,
          min,
          max,
          uniqueValues,
        }
      }
    }

    setStats({
      totalRows,
      totalColumns,
      numericColumns,
      columnStats,
    })
  }

  return (
    <SheetsContext.Provider
      value={{
        currentSheet,
        sheetData,
        stats,
        setCurrentSheet,
        setSheetData,
        calculateStats,
      }}
    >
      {children}
    </SheetsContext.Provider>
  )
}

export function useSheets() {
  const context = useContext(SheetsContext)
  if (context === undefined) {
    throw new Error("useSheets must be used within a SheetsProvider")
  }
  return context
}

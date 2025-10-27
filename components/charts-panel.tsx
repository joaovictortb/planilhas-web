"use client"

import { useSheets } from "@/context/sheets-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function ChartsPanel() {
  const { stats, sheetData } = useSheets()

  if (!stats || !sheetData || stats.numericColumns.length === 0) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Gráficos
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Nenhum dado numérico disponível para visualização
        </CardContent>
      </Card>
    )
  }

  const headers = sheetData.values[0] || []
  const dataRows = sheetData.values.slice(1)

  // Prepare data for charts (use first numeric column)
  const firstNumericCol = stats.numericColumns[0]
  const columnName = headers[firstNumericCol] || `Coluna ${firstNumericCol + 1}`

  // Bar/Line chart data
  const chartData = dataRows.slice(0, 10).map((row, index) => ({
    name: row[0] || `Item ${index + 1}`,
    value: Number.parseFloat(row[firstNumericCol]) || 0,
  }))

  // Pie chart data (aggregate by unique values)
  const pieData = Object.entries(
    dataRows.reduce((acc: any, row) => {
      const key = row[0] || "Sem nome"
      const value = Number.parseFloat(row[firstNumericCol]) || 0
      acc[key] = (acc[key] || 0) + value
      return acc
    }, {}),
  )
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }))

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Gráficos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar">Barras</TabsTrigger>
            <TabsTrigger value="line">Linha</TabsTrigger>
            <TabsTrigger value="pie">Pizza</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="hsl(var(--primary))" name={columnName} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="line" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name={columnName}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="pie" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

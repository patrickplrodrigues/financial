"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, PiggyBank, TrendingUp, TrendingDown, Banknote } from "lucide-react"
import { type SavingsExtraEntry, MONTHS } from "@/lib/finance-types"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value)
}

export function SavingsOverview() {
  const [initialSavings, setInitialSavings] = useState(15415.68)
  const [motherLoan, setMotherLoan] = useState(700)
  const [monthlySavings, setMonthlySavings] = useState<number[]>(() => {
    const savings = new Array(12).fill(0)
    savings[0] = 782.08
    return savings
  })

  const [extraEntries, setExtraEntries] = useState<SavingsExtraEntry[]>([
    { id: "1", description: "Pirata", amount: 70, type: "saida" },
    { id: "2", description: "Marquise", amount: 500, type: "saida" },
  ])

  const totalMonthlySavings = monthlySavings.reduce((sum, value) => sum + value, 0)
  const totalEntradas = extraEntries.filter((e) => e.type === "entrada").reduce((sum, e) => sum + e.amount, 0)
  const totalSaidas = extraEntries.filter((e) => e.type === "saida").reduce((sum, e) => sum + e.amount, 0)

  const totalSavings = initialSavings + totalMonthlySavings + totalEntradas - totalSaidas
  const totalWithMother = totalSavings + motherLoan

  const addExtraEntry = () => {
    const newEntry: SavingsExtraEntry = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
      type: "saida",
    }
    setExtraEntries([...extraEntries, newEntry])
  }

  const updateExtraEntry = (id: string, field: keyof SavingsExtraEntry, value: string | number) => {
    setExtraEntries((entries) => entries.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const removeExtraEntry = (id: string) => {
    setExtraEntries((entries) => entries.filter((item) => item.id !== id))
  }

  const updateMonthlySaving = (index: number, value: number) => {
    setMonthlySavings((prev) => prev.map((v, i) => (i === index ? value : v)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Poupança</h2>
          <p className="text-muted-foreground">Visão geral da poupança anual</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <PiggyBank className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Poupança Inicial</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(initialSavings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-accent/20">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entradas</p>
                <p className="text-lg font-bold text-accent">{formatCurrency(totalEntradas)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/20">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Saídas</p>
                <p className="text-lg font-bold text-destructive">{formatCurrency(totalSaidas)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-chart-3/10 border-chart-3/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-chart-3/20">
                <Banknote className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Empréstimo Mãe</p>
                <p className="text-lg font-bold text-chart-3">{formatCurrency(motherLoan)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Savings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-primary" />
              Poupança Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MONTHS.map((month, index) => (
                <div key={index} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{month}</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={monthlySavings[index] || ""}
                    onChange={(e) => updateMonthlySaving(index, Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="font-medium">Total Mensal</span>
              <span className="font-bold text-primary">{formatCurrency(totalMonthlySavings)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Extra Entries */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Entradas/Saídas Extra</CardTitle>
              <Button size="sm" variant="outline" onClick={addExtraEntry}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {extraEntries.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Select
                  value={item.type}
                  onValueChange={(v) => updateExtraEntry(item.id, "type", v as "entrada" | "saida")}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Descrição"
                  value={item.description}
                  onChange={(e) => updateExtraEntry(item.id, "description", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={item.amount || ""}
                  onChange={(e) => updateExtraEntry(item.id, "amount", Number.parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeExtraEntry(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {extraEntries.length === 0 && <p className="text-center text-muted-foreground py-4">Sem entradas extra</p>}
          </CardContent>
        </Card>
      </div>

      {/* Initial Values */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Valores Iniciais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Poupança Inicial</Label>
              <Input
                type="number"
                value={initialSavings || ""}
                onChange={(e) => setInitialSavings(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Empréstimo Mãe</Label>
              <Input
                type="number"
                value={motherLoan || ""}
                onChange={(e) => setMotherLoan(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-6 text-center">
            <div>
              <Label className="text-muted-foreground">Total Poupança</Label>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalSavings)}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Total c/ Mãe</Label>
              <p className="text-3xl font-bold text-accent">{formatCurrency(totalWithMother)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

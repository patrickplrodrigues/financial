"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Wallet, Receipt } from "lucide-react"
import { type PersonalExpense, type PersonalMonthData, MONTHS } from "@/lib/finance-types"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value)
}

interface PersonalFinancesProps {
  person: string
  initialPreviousBalance: number
}

export function PersonalFinances({ person, initialPreviousBalance }: PersonalFinancesProps) {
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [monthsData, setMonthsData] = useState<PersonalMonthData[]>(() => {
    return MONTHS.map((_, index) => ({
      previousBalance: index === 0 ? initialPreviousBalance : 0,
      monthlyValue: 100,
      expenses:
        index === 0 && person === "Patrick"
          ? [
              { id: "1", description: "Café nina", amount: 2.3 },
              { id: "2", description: "Água pais", amount: 1.68 },
            ]
          : [],
    }))
  })

  const currentData = monthsData[selectedMonth]
  const totalExpenses = currentData.expenses.reduce((sum, item) => sum + item.amount, 0)
  const netExpenses = currentData.previousBalance + totalExpenses
  const currentValue = currentData.monthlyValue - netExpenses

  // Calculate running totals for all months
  const monthlySobras = monthsData.map((data, index) => {
    const monthTotal = data.expenses.reduce((sum, item) => sum + item.amount, 0)
    const monthNet = data.previousBalance + monthTotal
    return data.monthlyValue - monthNet
  })

  const totalSobra = monthlySobras.reduce((sum, value) => sum + value, 0)

  const updateMonthData = (newData: Partial<PersonalMonthData>) => {
    setMonthsData((prev) => prev.map((data, index) => (index === selectedMonth ? { ...data, ...newData } : data)))
  }

  const addExpense = () => {
    const newEntry: PersonalExpense = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
    }
    updateMonthData({ expenses: [...currentData.expenses, newEntry] })
  }

  const updateExpense = (id: string, field: keyof PersonalExpense, value: string | number) => {
    updateMonthData({
      expenses: currentData.expenses.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    })
  }

  const removeExpense = (id: string) => {
    updateMonthData({ expenses: currentData.expenses.filter((item) => item.id !== id) })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{person}</h2>
          <p className="text-muted-foreground">Gastos pessoais mensais</p>
        </div>
        <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(Number.parseInt(v))}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month} 2026
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Expenses Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-destructive" />
                Gastos - {MONTHS[selectedMonth]}
              </CardTitle>
              <Button size="sm" variant="outline" onClick={addExpense}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentData.previousBalance !== 0 && (
              <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                <span className="flex-1 text-sm text-muted-foreground">
                  Sobra {selectedMonth === 0 ? "Dezembro" : MONTHS[selectedMonth - 1]}
                </span>
                <Input
                  type="number"
                  value={currentData.previousBalance || ""}
                  onChange={(e) => updateMonthData({ previousBalance: Number.parseFloat(e.target.value) || 0 })}
                  className="w-24 text-center"
                />
              </div>
            )}
            {currentData.expenses.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Input
                  placeholder="Descrição"
                  value={item.description}
                  onChange={(e) => updateExpense(item.id, "description", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={item.amount || ""}
                  onChange={(e) => updateExpense(item.id, "amount", Number.parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeExpense(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {currentData.expenses.length === 0 && currentData.previousBalance === 0 && (
              <p className="text-center text-muted-foreground py-4">Sem gastos registados</p>
            )}
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Resumo - {MONTHS[selectedMonth]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor Mensal</span>
                <span>{formatCurrency(currentData.monthlyValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gasto Total</span>
                <span className="text-destructive">{formatCurrency(netExpenses)}</span>
              </div>
              <div className="pt-2 border-t flex justify-between">
                <span className="font-medium">Valor Atual</span>
                <span className={`font-bold ${currentValue >= 0 ? "text-accent" : "text-destructive"}`}>
                  {formatCurrency(currentValue)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sobra Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {MONTHS.map((month, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-center ${
                  index === selectedMonth ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-xs truncate">{month}</p>
                <p
                  className={`font-semibold text-sm ${
                    index === selectedMonth
                      ? "text-primary-foreground"
                      : monthlySobras[index] >= 0
                        ? "text-accent"
                        : "text-destructive"
                  }`}
                >
                  {formatCurrency(monthlySobras[index])}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="font-medium">Total Anual</span>
            <span className={`text-xl font-bold ${totalSobra >= 0 ? "text-accent" : "text-destructive"}`}>
              {formatCurrency(totalSobra)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

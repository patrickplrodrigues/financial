"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, TrendingUp, TrendingDown, Euro, ShoppingBag } from "lucide-react"
import {
  type IncomeEntry,
  type ExpenseEntry,
  type ExtraEntry,
  type MonthData,
  MONTHS,
  DEFAULT_INCOME,
  DEFAULT_EXPENSES,
  DEFAULT_EXTRAS,
} from "@/lib/finance-types"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value)
}

export function MainFinances() {
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [monthsData, setMonthsData] = useState<MonthData[]>(() => {
    return MONTHS.map((_, index) => ({
      income: index === 0 ? [...DEFAULT_INCOME] : DEFAULT_INCOME.map((i) => ({ ...i, amount: 0 })),
      expenses: index === 0 ? [...DEFAULT_EXPENSES] : DEFAULT_EXPENSES.map((e) => ({ ...e, expected: 0, real: 0 })),
      extras: index === 0 ? [...DEFAULT_EXTRAS] : [],
    }))
  })

  const currentData = monthsData[selectedMonth]

  const totalIncome = currentData.income.reduce((sum, item) => sum + item.amount, 0)
  const totalExpensesExpected = currentData.expenses.reduce((sum, item) => sum + item.expected, 0)
  const totalExpensesReal = currentData.expenses.reduce((sum, item) => sum + item.real, 0)
  const totalExtras = currentData.extras.reduce((sum, item) => sum + item.amount, 0)
  const savingsExpected = totalIncome - totalExpensesExpected
  const savingsReal = totalIncome - totalExpensesReal

  const updateMonthData = (newData: Partial<MonthData>) => {
    setMonthsData((prev) => prev.map((data, index) => (index === selectedMonth ? { ...data, ...newData } : data)))
  }

  const addIncomeEntry = () => {
    const newEntry: IncomeEntry = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
    }
    updateMonthData({ income: [...currentData.income, newEntry] })
  }

  const updateIncomeEntry = (id: string, field: keyof IncomeEntry, value: string | number) => {
    updateMonthData({
      income: currentData.income.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    })
  }

  const removeIncomeEntry = (id: string) => {
    updateMonthData({ income: currentData.income.filter((item) => item.id !== id) })
  }

  const addExpenseEntry = () => {
    const newEntry: ExpenseEntry = {
      id: Date.now().toString(),
      description: "",
      expected: 0,
      real: 0,
    }
    updateMonthData({ expenses: [...currentData.expenses, newEntry] })
  }

  const updateExpenseEntry = (id: string, field: keyof ExpenseEntry, value: string | number) => {
    updateMonthData({
      expenses: currentData.expenses.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    })
  }

  const removeExpenseEntry = (id: string) => {
    updateMonthData({ expenses: currentData.expenses.filter((item) => item.id !== id) })
  }

  const addExtraEntry = () => {
    const newEntry: ExtraEntry = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
    }
    updateMonthData({ extras: [...currentData.extras, newEntry] })
  }

  const updateExtraEntry = (id: string, field: keyof ExtraEntry, value: string | number) => {
    updateMonthData({
      extras: currentData.extras.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    })
  }

  const removeExtraEntry = (id: string) => {
    updateMonthData({ extras: currentData.extras.filter((item) => item.id !== id) })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Entradas</p>
                  <p className="font-semibold text-accent">{formatCurrency(totalIncome)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">Despesas</p>
                  <p className="font-semibold text-destructive">{formatCurrency(totalExpensesReal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-chart-3/10 border-chart-3/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-chart-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Extras</p>
                  <p className="font-semibold text-chart-3">{formatCurrency(totalExtras)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Poupança</p>
                  <p className="font-semibold text-primary">{formatCurrency(savingsReal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Income Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Entradas
              </CardTitle>
              <Button size="sm" variant="outline" onClick={addIncomeEntry}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentData.income.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Input
                  placeholder="Descrição"
                  value={item.description}
                  onChange={(e) => updateIncomeEntry(item.id, "description", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={item.amount || ""}
                  onChange={(e) => updateIncomeEntry(item.id, "amount", Number.parseFloat(e.target.value) || 0)}
                  className="w-28"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeIncomeEntry(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="pt-3 border-t flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-bold text-accent">{formatCurrency(totalIncome)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
                Despesas
              </CardTitle>
              <Button size="sm" variant="outline" onClick={addExpenseEntry}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-[1fr_80px_80px_32px] gap-2 text-xs text-muted-foreground pb-1">
              <span>Descrição</span>
              <span className="text-center">Esperado</span>
              <span className="text-center">Real</span>
              <span></span>
            </div>
            {currentData.expenses.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_80px_80px_32px] gap-2 items-center">
                <Input
                  placeholder="Descrição"
                  value={item.description}
                  onChange={(e) => updateExpenseEntry(item.id, "description", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={item.expected || ""}
                  onChange={(e) => updateExpenseEntry(item.id, "expected", Number.parseFloat(e.target.value) || 0)}
                  className="text-center"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={item.real || ""}
                  onChange={(e) => updateExpenseEntry(item.id, "real", Number.parseFloat(e.target.value) || 0)}
                  className="text-center"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeExpenseEntry(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="pt-3 border-t space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span>Total Esperado</span>
                <span className="text-muted-foreground">{formatCurrency(totalExpensesExpected)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Real</span>
                <span className="font-bold text-destructive">{formatCurrency(totalExpensesReal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extras Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-chart-3" />
              Extras - {MONTHS[selectedMonth]}
            </CardTitle>
            <Button size="sm" variant="outline" onClick={addExtraEntry}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentData.extras.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
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
          </div>
          <div className="pt-4 border-t mt-4 flex justify-between items-center">
            <span className="font-medium">Total Extras</span>
            <span className="font-bold text-chart-3">{formatCurrency(totalExtras)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <Label className="text-muted-foreground text-xs">Poupança Esperada</Label>
              <p className="text-xl font-bold text-foreground">{formatCurrency(savingsExpected)}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Poupança Real</Label>
              <p className="text-xl font-bold text-primary">{formatCurrency(savingsReal)}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Diferença Despesas</Label>
              <p
                className={`text-xl font-bold ${totalExpensesExpected - totalExpensesReal >= 0 ? "text-accent" : "text-destructive"}`}
              >
                {formatCurrency(totalExpensesExpected - totalExpensesReal)}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Conta Ordem Atual</Label>
              <p className="text-xl font-bold text-foreground">{formatCurrency(223.5)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

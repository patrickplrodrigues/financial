"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

import { supabase } from "@/lib/supabase"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Plus, Trash2, Wallet, Receipt } from "lucide-react"

import {
  type PersonalExpense,
  type PersonalMonthData,
  MONTHS,
} from "@/lib/finance-types"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value)

interface PersonalFinancesProps {
  person: string
  initialPreviousBalance: number
}

export function PersonalFinances({
  person,
  initialPreviousBalance,
}: PersonalFinancesProps) {
  const { data: session } = useSession()

  const [selectedMonth, setSelectedMonth] = useState(0)
  const [coupleId, setCoupleId] = useState<string | null>(null)

  const [monthsData, setMonthsData] = useState<PersonalMonthData[]>(() =>
    MONTHS.map((_, index) => ({
      previousBalance: index === 0 ? initialPreviousBalance : 0,
      monthlyValue: 100,
      expenses: [],
    }))
  )

  const currentData = monthsData[selectedMonth]

  // ======================================================
  // 👫 OBTER COUPLE ID AUTOMATICAMENTE
  // ======================================================

  useEffect(() => {
    if (!session?.user?.email) return

    const loadCouple = async () => {
      const { data } = await supabase
        .from("couples")
        .select("id")
        .or(`email1.eq.${session.user.email},email2.eq.${session.user.email}`)
        .single()

      if (data) setCoupleId(data.id)
    }

    loadCouple()
  }, [session])

  // ======================================================
  // 🔥 BUSCAR DESPESAS DO SUPABASE
  // ======================================================

  useEffect(() => {
    if (!session?.user?.email || !coupleId) return

    const fetchExpenses = async () => {
      const start = new Date(2026, selectedMonth, 1)
      const end = new Date(2026, selectedMonth + 1, 1)

      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("couple_id", coupleId)
        .eq("user_email", session.user.email)
        .eq("is_shared", false)
        .gte("date", start.toISOString())
        .lt("date", end.toISOString())

      if (!data) return

      updateMonthData({
        expenses: data.map((item) => ({
          id: item.id,
          description: item.description || "",
          amount: Number(item.amount),
        })),
      })
    }

    fetchExpenses()
  }, [session, selectedMonth, coupleId])

  // ======================================================
  // 🔄 HELPERS
  // ======================================================

  const updateMonthData = (newData: Partial<PersonalMonthData>) => {
    setMonthsData((prev) =>
      prev.map((data, index) =>
        index === selectedMonth ? { ...data, ...newData } : data
      )
    )
  }

  // ======================================================
  // ➕ ADICIONAR DESPESA
  // ======================================================

  const addExpense = async () => {
    if (!session?.user?.email || !coupleId) return

    const date = new Date(2026, selectedMonth, 1)

    const { data } = await supabase
      .from("transactions")
      .insert({
        couple_id: coupleId,
        amount: 0,
        description: "",
        date,
        user_email: session.user.email,
        is_shared: false,
      })
      .select()
      .single()

    if (!data) return

    updateMonthData({
      expenses: [
        ...currentData.expenses,
        {
          id: data.id,
          description: "",
          amount: 0,
        },
      ],
    })
  }

  // ======================================================
  // ✏️ ATUALIZAR DESPESA
  // ======================================================

  const updateExpense = async (
    id: string,
    field: keyof PersonalExpense,
    value: string | number
  ) => {
    updateMonthData({
      expenses: currentData.expenses.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })

    await supabase
      .from("transactions")
      .update({ [field]: value })
      .eq("id", id)
  }

  // ======================================================
  // 🗑️ REMOVER DESPESA
  // ======================================================

  const removeExpense = async (id: string) => {
    await supabase.from("transactions").delete().eq("id", id)

    updateMonthData({
      expenses: currentData.expenses.filter((item) => item.id !== id),
    })
  }

  // ======================================================
  // 📊 CÁLCULOS (mantidos)
  // ======================================================

  const totalExpenses = currentData.expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  )

  const netExpenses = currentData.previousBalance + totalExpenses
  const currentValue = currentData.monthlyValue - netExpenses

  const monthlySobras = monthsData.map((data) => {
    const monthTotal = data.expenses.reduce(
      (sum, item) => sum + item.amount,
      0
    )
    const monthNet = data.previousBalance + monthTotal
    return data.monthlyValue - monthNet
  })

  const totalSobra = monthlySobras.reduce((sum, v) => sum + v, 0)

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{person}</h2>
          <p className="text-muted-foreground">
            Gastos pessoais mensais
          </p>
        </div>

        <Select
          value={selectedMonth.toString()}
          onValueChange={(v) => setSelectedMonth(Number(v))}
        >
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

      {/* CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* EXPENSES */}
        <Card>
          <CardHeader className="pb-3 flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-destructive" />
              Gastos - {MONTHS[selectedMonth]}
            </CardTitle>

            <Button size="sm" variant="outline" onClick={addExpense}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {currentData.expenses.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Input
                  placeholder="Descrição"
                  value={item.description}
                  onChange={(e) =>
                    updateExpense(item.id, "description", e.target.value)
                  }
                  className="flex-1"
                />

                <Input
                  type="number"
                  placeholder="0.00"
                  value={item.amount || ""}
                  onChange={(e) =>
                    updateExpense(
                      item.id,
                      "amount",
                      Number.parseFloat(e.target.value) || 0
                    )
                  }
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

            {currentData.expenses.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Sem gastos registados
              </p>
            )}
          </CardContent>
        </Card>

        {/* SUMMARY */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Resumo - {MONTHS[selectedMonth]}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Valor Mensal</span>
              <span>{formatCurrency(currentData.monthlyValue)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Gasto Total</span>
              <span className="text-destructive">
                {formatCurrency(netExpenses)}
              </span>
            </div>

            <div className="pt-2 border-t flex justify-between font-bold">
              <span>Valor Atual</span>
              <span
                className={
                  currentValue >= 0 ? "text-accent" : "text-destructive"
                }
              >
                {formatCurrency(currentValue)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OVERVIEW */}
      <Card>
        <CardHeader>
          <CardTitle>Sobra Mensal</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {MONTHS.map((month, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-center ${
                  index === selectedMonth
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-xs truncate">{month}</p>

                <p
                  className={`font-semibold text-sm ${
                    monthlySobras[index] >= 0
                      ? "text-accent"
                      : "text-destructive"
                  }`}
                >
                  {formatCurrency(monthlySobras[index])}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between">
            <span className="font-medium">Total Anual</span>
            <span
              className={`text-xl font-bold ${
                totalSobra >= 0
                  ? "text-accent"
                  : "text-destructive"
              }`}
            >
              {formatCurrency(totalSobra)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
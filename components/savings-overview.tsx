"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { PiggyBank, TrendingUp, TrendingDown, Banknote } from "lucide-react"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value)

export function SavingsOverview() {
  const { data: session } = useSession()

  const [coupleId, setCoupleId] = useState<string | null>(null)
  const [assets, setAssets] = useState<any[]>([])
  const [liabilities, setLiabilities] = useState<any[]>([])

  // ======================================================
  // 👫 OBTER COUPLE ID
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
  // 🔥 BUSCAR ATIVOS E DÍVIDAS
  // ======================================================

  useEffect(() => {
    if (!coupleId) return

    const fetchData = async () => {
      const { data } = await supabase
        .from("assets_liabilities")
        .select("*")
        .eq("couple_id", coupleId)

      if (!data) return

      setAssets(data.filter((a) => a.type === "asset"))
      setLiabilities(data.filter((l) => l.type === "liability"))
    }

    fetchData()
  }, [coupleId])

  // ======================================================
  // ➕ ADICIONAR ITEM
  // ======================================================

  const addItem = async (type: "asset" | "liability") => {
    if (!coupleId) return

    const { data } = await supabase
      .from("assets_liabilities")
      .insert({
        couple_id: coupleId,
        name: "",
        amount: 0,
        type,
      })
      .select()
      .single()

    if (!data) return

    type === "asset"
      ? setAssets([...assets, data])
      : setLiabilities([...liabilities, data])
  }

  // ======================================================
  // ✏️ UPDATE
  // ======================================================

  const updateItem = async (id: string, field: string, value: any) => {
    await supabase
      .from("assets_liabilities")
      .update({ [field]: value })
      .eq("id", id)

    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    )

    setLiabilities((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  // ======================================================
  // 🗑️ DELETE
  // ======================================================

  const removeItem = async (id: string) => {
    await supabase.from("assets_liabilities").delete().eq("id", id)

    setAssets((prev) => prev.filter((a) => a.id !== id))
    setLiabilities((prev) => prev.filter((l) => l.id !== id))
  }

  // ======================================================
  // 📊 CÁLCULOS
  // ======================================================

  const totalAssets = assets.reduce((sum, a) => sum + Number(a.amount), 0)
  const totalLiabilities = liabilities.reduce(
    (sum, l) => sum + Number(l.amount),
    0
  )

  const netWorth = totalAssets - totalLiabilities

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Património do Casal</h2>

      {/* ATIVOS */}
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-accent" /> Ativos
          </CardTitle>

          <Button size="sm" onClick={() => addItem("asset")}>
            Adicionar
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {assets.map((item) => (
            <div key={item.id} className="flex gap-2">
              <Input
                value={item.name || ""}
                placeholder="Descrição"
                onChange={(e) =>
                  updateItem(item.id, "name", e.target.value)
                }
              />

              <Input
                type="number"
                value={item.amount || ""}
                onChange={(e) =>
                  updateItem(item.id, "amount", Number(e.target.value))
                }
                className="w-32"
              />

              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeItem(item.id)}
              >
                ✕
              </Button>
            </div>
          ))}

          <div className="pt-3 border-t flex justify-between font-bold text-accent">
            <span>Total Ativos</span>
            <span>{formatCurrency(totalAssets)}</span>
          </div>
        </CardContent>
      </Card>

      {/* PASSIVOS */}
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="text-destructive" /> Dívidas
          </CardTitle>

          <Button size="sm" onClick={() => addItem("liability")}>
            Adicionar
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {liabilities.map((item) => (
            <div key={item.id} className="flex gap-2">
              <Input
                value={item.name || ""}
                placeholder="Descrição"
                onChange={(e) =>
                  updateItem(item.id, "name", e.target.value)
                }
              />

              <Input
                type="number"
                value={item.amount || ""}
                onChange={(e) =>
                  updateItem(item.id, "amount", Number(e.target.value))
                }
                className="w-32"
              />

              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeItem(item.id)}
              >
                ✕
              </Button>
            </div>
          ))}

          <div className="pt-3 border-t flex justify-between font-bold text-destructive">
            <span>Total Dívidas</span>
            <span>{formatCurrency(totalLiabilities)}</span>
          </div>
        </CardContent>
      </Card>

      {/* NET WORTH */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <Label>Património Líquido</Label>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(netWorth)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
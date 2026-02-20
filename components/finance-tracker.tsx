"use client"

import { useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { MainFinances } from "./main-finances"
import { PersonalFinances } from "./personal-finances"
import { SavingsOverview } from "./savings-overview"

import {
  Wallet,
  User,
  PiggyBank,
  LayoutDashboard,
} from "lucide-react"

export function FinanceTracker() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Finanças 2026
        </h1>
        <p className="text-muted-foreground">
          Gestão financeira do casal
        </p>
      </header>

      {/* TABS */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>

          <TabsTrigger value="main" className="gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Conta</span>
          </TabsTrigger>

          <TabsTrigger value="sofia" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Sofia</span>
          </TabsTrigger>

          <TabsTrigger value="patrick" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Patrick</span>
          </TabsTrigger>

          <TabsTrigger value="savings" className="gap-2">
            <PiggyBank className="h-4 w-4" />
            <span className="hidden sm:inline">Poupança</span>
          </TabsTrigger>
        </TabsList>

        {/* DASHBOARD ⭐ */}
        <TabsContent value="dashboard">
          <MainFinances />
        </TabsContent>

        {/* CONTA CONJUNTA */}
        <TabsContent value="main">
          <MainFinances />
        </TabsContent>

        {/* SOFIA */}
        <TabsContent value="sofia">
          <PersonalFinances
            person="Sofia"
            initialPreviousBalance={-12.41}
          />
        </TabsContent>

        {/* PATRICK */}
        <TabsContent value="patrick">
          <PersonalFinances
            person="Patrick"
            initialPreviousBalance={-4.86}
          />
        </TabsContent>

        {/* POUPANÇA */}
        <TabsContent value="savings">
          <SavingsOverview />
        </TabsContent>
      </Tabs>
    </div>
  )
}
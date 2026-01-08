export interface IncomeEntry {
  id: string
  description: string
  amount: number
}

export interface ExpenseEntry {
  id: string
  description: string
  expected: number
  real: number
}

export interface ExtraEntry {
  id: string
  description: string
  amount: number
}

export interface MonthData {
  income: IncomeEntry[]
  expenses: ExpenseEntry[]
  extras: ExtraEntry[]
}

export interface PersonalExpense {
  id: string
  description: string
  amount: number
}

export interface PersonalMonthData {
  previousBalance: number
  monthlyValue: number
  expenses: PersonalExpense[]
}

export interface SavingsEntry {
  month: string
  amount: number
}

export interface SavingsExtraEntry {
  id: string
  description: string
  amount: number
  type: "entrada" | "saida"
}

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export const DEFAULT_INCOME: IncomeEntry[] = [
  { id: "1", description: "Salário Sofia", amount: 993 },
  { id: "2", description: "Salário Patrick", amount: 1261 },
  { id: "3", description: "Cartão Refeição", amount: 182.4 },
]

export const DEFAULT_EXPENSES: ExpenseEntry[] = [
  { id: "1", description: "Prestação casa", expected: 755, real: 752.17 },
  { id: "2", description: "Seguros", expected: 35, real: 34.77 },
  { id: "3", description: "Luz", expected: 72.92, real: 72.92 },
  { id: "4", description: "Água", expected: 21, real: 23.53 },
  { id: "5", description: "Telecomunicações", expected: 33, real: 35.49 },
  { id: "6", description: "Gasolina", expected: 120, real: 30 },
  { id: "7", description: "Via verde", expected: 35, real: 11.28 },
  { id: "8", description: "Alimentação", expected: 182.4, real: 182.4 },
  { id: "9", description: "Extras", expected: 200, real: 88.26 },
  { id: "10", description: "Saída contas particulares", expected: 200, real: 200 },
]

export const DEFAULT_EXTRAS: ExtraEntry[] = [
  { id: "1", description: "Café", amount: 10 },
  { id: "2", description: "Pão", amount: 0.64 },
  { id: "3", description: "Prenda João", amount: 27 },
  { id: "4", description: "Loja dos 300", amount: 14.5 },
  { id: "5", description: "Cinema", amount: 8.35 },
  { id: "6", description: "Cakus", amount: 11.97 },
  { id: "7", description: "Francesinha", amount: 35.8 },
  { id: "8", description: "Acerto 2025", amount: -20 },
]

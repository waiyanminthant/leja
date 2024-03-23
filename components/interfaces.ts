export interface Expense {
  id: string,
  detail: string,
  type: string,
  amount: number,
  currency: string,
  date: Date,
  rate?: number;
}

export interface ProductionItem {
  id: string,
  name: string,
  amount: number,
  unit: string,
  date: Date,
  toStock: boolean
}
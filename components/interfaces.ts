export interface Expense {
  id: string;
  detail: string;
  type: string;
  amount: number;
  currency: string;
  date: Date;
  rate?: number;
}

export interface ProductionItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  date: Date;
  toStock: boolean;
}

export interface StockItem {
  id: string;
  name: string;
  amount: number;
  date: Date;
  price: number;
  currency: string;
  rate: number;
  sold: boolean;
}

export interface SaleItem {
  id: string;
  name: string;
  amount: number;
  date: Date;
  price: number;
  currency: string;
  rate: number;
  stock: number;
}

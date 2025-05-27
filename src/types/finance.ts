export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan' | 'retirement';
  balance: number;
  currency: string;
  institution: string;
  lastUpdated: Date;
  accountNumber?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  date: Date;
  category: string;
  subcategory?: string;
  merchant?: string;
  pending: boolean;
  confidence?: number; // ML categorization confidence
}

export interface Category {
  id?: string;
  name: string;
  icon: string;
  color: string;
  subcategories?: string[];
  target?: number; // Budget target for this category
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  spent: number;
}

export interface NetWorthData {
  assets: number;
  liabilities: number;
  netWorth: number;
}

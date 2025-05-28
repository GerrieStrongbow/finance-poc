'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Account, Category } from '@/types/finance';
import { accounts as defaultAccounts, transactions as defaultTransactions, categories as defaultCategories } from '@/data/mockData';

interface DataContextType {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  addTransactions: (newTransactions: Transaction[]) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  clearImportedData: () => void;
  clearAllData: () => void;
  getImportedCount: () => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [accounts] = useState<Account[]>(defaultAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Load from localStorage if available, otherwise start with empty array
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('finance-poc-transactions');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert date strings back to Date objects
          return parsed.map((t: any) => ({
            ...t,
            date: new Date(t.date)
          }));
        }
      } catch (error) {
        console.warn('Failed to load transactions from localStorage:', error);
      }
    }
    // Start with mock data initially, but this will be replaced by imported data
    return defaultTransactions;
  });
  const [categories] = useState<Category[]>(defaultCategories);
  const [importedTransactionIds, setImportedTransactionIds] = useState<Set<string>>(() => {
    // Load imported transaction IDs from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('finance-poc-imported-ids');
        if (stored) {
          return new Set(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Failed to load imported IDs from localStorage:', error);
      }
    }
    return new Set();
  });

  // Mark default transactions as non-imported for easy identification
  const defaultTransactionIds = new Set(defaultTransactions.map(t => t.id));

  // Save transactions to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('finance-poc-transactions', JSON.stringify(transactions));
      } catch (error) {
        console.warn('Failed to save transactions to localStorage:', error);
      }
    }
  }, [transactions]);

  // Save imported transaction IDs to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('finance-poc-imported-ids', JSON.stringify(Array.from(importedTransactionIds)));
      } catch (error) {
        console.warn('Failed to save imported IDs to localStorage:', error);
      }
    }
  }, [importedTransactionIds]);

  const addTransactions = (newTransactions: Transaction[]) => {
    const newIds = new Set<string>();
    
    setTransactions(prevTransactions => {
      const existingIds = new Set(prevTransactions.map(t => t.id));
      const uniqueNewTransactions = newTransactions.filter(t => {
        if (!existingIds.has(t.id)) {
          newIds.add(t.id);
          return true;
        }
        return false;
      });
      
      // Update imported transaction IDs
      setImportedTransactionIds(prev => {
        const updated = new Set(prev);
        newIds.forEach(id => updated.add(id));
        return updated;
      });
      
      return [...prevTransactions, ...uniqueNewTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(transaction =>
        transaction.id === id
          ? { ...transaction, ...updates }
          : transaction
      )
    );
  };

  const clearImportedData = () => {
    // Remove only imported transactions, keep any original mock data
    setTransactions(prevTransactions =>
      prevTransactions.filter(t => !importedTransactionIds.has(t.id))
    );
    setImportedTransactionIds(new Set());
    
    // Clear imported IDs from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('finance-poc-imported-ids');
        // Update transactions in localStorage will happen via useEffect
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
      }
    }
  };

  const clearAllData = () => {
    // Clear everything - reset to empty state
    setTransactions([]);
    setImportedTransactionIds(new Set());
    
    // Clear localStorage completely
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('finance-poc-transactions');
        localStorage.removeItem('finance-poc-imported-ids');
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
      }
    }
  };

  const getImportedCount = () => importedTransactionIds.size;

  return (
    <DataContext.Provider value={{
      accounts,
      transactions,
      categories,
      addTransactions,
      updateTransaction,
      clearImportedData,
      clearAllData,
      getImportedCount
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

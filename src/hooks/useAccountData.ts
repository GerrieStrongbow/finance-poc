// Hook for managing account data with bank integrations
import { useState, useEffect } from 'react';
import { Account, Transaction } from '@/types/finance';
import { accounts as mockAccounts, transactions as mockTransactions } from '@/data/mockData';
import { bankService } from '@/services/bankIntegration';

export function useAccountData() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isLoading, setIsLoading] = useState(false);

  // Merge connected bank accounts with existing mock data
  const refreshAccounts = () => {
    const connections = bankService.getConnections();
    const connectedAccounts: Account[] = [];
    
    connections.forEach(connection => {
      if (connection.status.connected) {
        connectedAccounts.push(...connection.accounts);
      }
    });

    // Merge with mock accounts, avoiding duplicates
    const allAccounts = [...mockAccounts];
    connectedAccounts.forEach(newAccount => {
      const exists = allAccounts.find(acc => acc.id === newAccount.id);
      if (!exists) {
        allAccounts.push(newAccount);
      }
    });

    setAccounts(allAccounts);
  };

  // Sync transactions from all connected banks
  const syncAllTransactions = async () => {
    setIsLoading(true);
    try {
      const connections = bankService.getConnections();
      const allNewTransactions: Transaction[] = [];

      for (const connection of connections) {
        if (connection.status.connected) {
          try {
            const newTransactions = await bankService.syncTransactions(connection.id);
            allNewTransactions.push(...newTransactions);
          } catch (error) {
            console.error(`Failed to sync ${connection.bankName}:`, error);
          }
        }
      }

      // Merge with existing transactions, avoiding duplicates
      const mergedTransactions = [...mockTransactions];
      allNewTransactions.forEach(newTxn => {
        const exists = mergedTransactions.find(txn => txn.id === newTxn.id);
        if (!exists) {
          mergedTransactions.push(newTxn);
        }
      });

      // Sort by date (newest first)
      mergedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setTransactions(mergedTransactions);
      refreshAccounts(); // Update accounts as well
    } finally {
      setIsLoading(false);
    }
  };

  return {
    accounts,
    transactions,
    isLoading,
    refreshAccounts,
    syncAllTransactions
  };
}

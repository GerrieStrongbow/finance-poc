'use client';

import { useState } from 'react';
import { mockTransactions, mockCategories, mockAccounts } from '@/data/mockData';
import { formatCurrency, formatDate, getCategoryForTransaction } from '@/utils/finance';
import { Transaction } from '@/types/finance';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const categoryMatch = selectedCategory === 'all' || transaction.category === selectedCategory;
    const accountMatch = selectedAccount === 'all' || transaction.accountId === selectedAccount;
    return categoryMatch && accountMatch;
  });

  const updateTransactionCategory = (transactionId: string, newCategory: string) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(transaction =>
        transaction.id === transactionId
          ? { ...transaction, category: newCategory, confidence: 1.0 }
          : transaction
      )
    );
  };

  const recategorizeTransaction = (transaction: Transaction) => {
    const { category, confidence } = getCategoryForTransaction(transaction.description);
    updateTransactionCategory(transaction.id, category);
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 text-gray-800';
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceText = (confidence?: number) => {
    if (!confidence) return 'Unknown';
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">Review and categorize your transactions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {mockCategories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="account-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Account
            </label>
            <select
              id="account-filter"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Accounts</option>
              {mockAccounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Transactions</div>
          <div className="text-xl font-bold text-gray-900">{filteredTransactions.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Spent</div>
          <div className="text-xl font-bold text-red-600">
            {formatCurrency(
              Math.abs(filteredTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + t.amount, 0))
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Income</div>
          <div className="text-xl font-bold text-green-600">
            {formatCurrency(
              filteredTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Uncategorized</div>
          <div className="text-xl font-bold text-orange-600">
            {filteredTransactions.filter(t => t.category === 'Uncategorized').length}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((transaction) => {
              const account = mockAccounts.find(a => a.id === transaction.accountId);
              const category = mockCategories.find(c => c.name === transaction.category);
              
              return (
                <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </h3>
                          <div className="mt-1 text-sm text-gray-500">
                            {account?.name} • {formatDate(transaction.date)}
                            {transaction.merchant && ` • ${transaction.merchant}`}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <select
                          value={transaction.category}
                          onChange={(e) => updateTransactionCategory(transaction.id, e.target.value)}
                          className="text-xs p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                          {mockCategories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                        {category && (
                          <span className="text-lg">{category.icon}</span>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(transaction.confidence)}`}>
                          {getConfidenceText(transaction.confidence)} Confidence
                        </span>
                        {transaction.confidence && transaction.confidence < 0.8 && (
                          <button
                            onClick={() => recategorizeTransaction(transaction)}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            Auto-categorize
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </div>
                      {transaction.pending && (
                        <div className="text-xs text-orange-600 font-medium">Pending</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

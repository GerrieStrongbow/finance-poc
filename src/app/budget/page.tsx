'use client';

import { useState } from 'react';
import { transactions as mockTransactions, categories as mockCategories } from '@/data/mockData';
import { formatCurrency, getSpendingByCategory, getTransactionsByDateRange, groupTransactionsByCategory } from '@/utils/finance';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export default function BudgetPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  
  const getCurrentPeriodDates = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'current':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'last':
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case 'last3':
        return { start: subMonths(now, 3), end: now };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start, end } = getCurrentPeriodDates();
  const periodTransactions = getTransactionsByDateRange(mockTransactions, start, end);
  const spendingByCategory = getSpendingByCategory(periodTransactions);
  const groupedTransactions = groupTransactionsByCategory(periodTransactions);

  const totalSpent = periodTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalIncome = periodTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'current':
        return `Current Month (${format(start, 'MMM yyyy')})`;
      case 'last':
        return `Last Month (${format(start, 'MMM yyyy')})`;
      case 'last3':
        return 'Last 3 Months';
      default:
        return 'Current Month';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Budget Overview</h1>
        <p className="text-gray-600 mt-1">Track your spending patterns by category</p>
      </div>

      {/* Personal Budget Notice */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-blue-800">
            <h3 className="text-sm font-medium">💼 Your 50/20/20/10 Budget Model</h3>
            <p className="text-sm mt-1">
              Based on your ~R75k monthly income: 50% Essentials (R37k) • 20% Investments (R15k) • 20% Wants (R15k) • 10% Giving (R7.5k)
            </p>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Select Time Period</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="last3">Last 3 Months</option>
          </select>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Viewing: {getPeriodLabel()}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Income</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {periodTransactions.filter(t => t.amount > 0).length} transactions
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Spent</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {formatCurrency(totalSpent)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {periodTransactions.filter(t => t.amount < 0).length} transactions
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Net Amount</h3>
          <p className={`text-2xl font-bold mt-2 ${(totalIncome - totalSpent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalIncome - totalSpent)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {totalIncome >= totalSpent ? 'Surplus' : 'Deficit'}
          </p>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Spending by Category</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {spendingByCategory.map((item, index) => {
              const category = mockCategories.find(c => c.name === item.category);
              const percentage = totalSpent > 0 ? (item.amount / totalSpent) * 100 : 0;
              
              return (
                <div key={item.category} className="flex items-center">
                  <div className="flex items-center flex-1">
                    <span className="text-2xl mr-3">{category?.icon || '❓'}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${category?.color || 'bg-gray-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {groupedTransactions[item.category]?.length || 0} transactions
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions by Category */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Transactions by Category</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {Object.entries(groupedTransactions)
            .sort(([, a], [, b]) => {
              const aTotal = Math.abs(a.reduce((sum, t) => sum + t.amount, 0));
              const bTotal = Math.abs(b.reduce((sum, t) => sum + t.amount, 0));
              return bTotal - aTotal;
            })
            .map(([categoryName, transactions]) => {
              const category = mockCategories.find(c => c.name === categoryName);
              const categoryTotal = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
              
              return (
                <div key={categoryName} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{category?.icon || '❓'}</span>
                      <h3 className="text-sm font-medium text-gray-900">{categoryName}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(categoryTotal)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transactions.length} transactions
                      </div>
                    </div>
                  </div>
                  <div className="ml-8 space-y-1">
                    {transactions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 3)
                      .map((transaction) => (
                        <div key={transaction.id} className="flex justify-between text-xs">
                          <span className="text-gray-600 truncate">{transaction.description}</span>
                          <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(Math.abs(transaction.amount))}
                          </span>
                        </div>
                      ))}
                    {transactions.length > 3 && (
                      <div className="text-xs text-gray-500">
                        ... and {transactions.length - 3} more transactions
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

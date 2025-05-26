'use client';

import { mockAccounts } from '@/data/mockData';
import { calculateNetWorth, formatCurrency, formatDate, getAccountTypeColor } from '@/utils/finance';

export default function AccountsPage() {
  const netWorth = calculateNetWorth(mockAccounts);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Overview</h1>
        <p className="text-gray-600 mt-1">Your complete financial picture</p>
      </div>

      {/* Net Worth Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Assets</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {formatCurrency(netWorth.assets)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Liabilities</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {formatCurrency(netWorth.liabilities)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Net Worth</h3>
          <p className={`text-2xl font-bold mt-2 ${netWorth.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netWorth.netWorth)}
          </p>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Accounts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockAccounts.map((account) => (
            <div key={account.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900">{account.name}</h3>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                      {account.type}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {account.institution} • {account.accountNumber}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(account.balance))}
                  </div>
                  <div className="text-sm text-gray-500">
                    Updated {formatDate(account.lastUpdated)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Accounts</div>
          <div className="text-xl font-bold text-gray-900">{mockAccounts.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Checking & Savings</div>
          <div className="text-xl font-bold text-blue-600">
            {formatCurrency(
              mockAccounts
                .filter(a => ['checking', 'savings'].includes(a.type))
                .reduce((sum, a) => sum + a.balance, 0)
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Investments</div>
          <div className="text-xl font-bold text-purple-600">
            {formatCurrency(
              mockAccounts
                .filter(a => a.type === 'investment')
                .reduce((sum, a) => sum + a.balance, 0)
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Credit Used</div>
          <div className="text-xl font-bold text-red-600">
            {formatCurrency(
              Math.abs(mockAccounts
                .filter(a => a.type === 'credit')
                .reduce((sum, a) => sum + a.balance, 0))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

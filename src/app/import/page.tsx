'use client';

import CSVImport from '@/components/CSVImport';
import { useData } from '@/contexts/DataContext';

export default function ImportPage() {
  const { clearAllData, transactions } = useData();
  const totalTransactions = transactions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Import Financial Data</h1>
            <p className="mt-1 text-sm text-gray-600">
              Import your Vault22 transaction data to enhance your financial overview
            </p>
            
            {/* Import Status */}
            <div className="mt-4 space-y-3">
              {/* Transaction Count Summary */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-800">
                        {totalTransactions > 0 ? (
                          <>Total transactions: {totalTransactions}</>
                        ) : (
                          <>No transactions loaded. Import your Vault22 data to get started.</>
                        )}
                      </p>
                    </div>
                  </div>
                  {totalTransactions > 0 && (
                    <div className="ml-3">
                      <button
                        onClick={clearAllData}
                        className="bg-red-50 text-red-800 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Clear All Data
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Success Message when data is imported */}
              {totalTransactions > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Your Vault22 data has been successfully imported! You can now explore your financial insights.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            <CSVImport />
          </div>
        </div>
      </div>
    </div>
  );
}

// CSV Import component for updating financial data
'use client';

import { useState } from 'react';
import { Account, Transaction } from '@/types/finance';

interface ImportResult {
  success: boolean;
  message: string;
  importedCount?: number;
  errors?: string[];
}

export default function CSVImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
    setImportResults([]);
  };

  const parseCSVContent = (content: string): any[] => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return data;
  };

  const processAccountsCSV = (data: any[]): ImportResult => {
    try {
      let accounts: Account[] = [];
      let importedCount = 0;

      data.forEach((row, index) => {
        try {
          // Expected format: Account, Type, Institution, Balance, Currency, etc.
          const account: Account = {
            id: `imported-${Date.now()}-${index}`,
            name: row['Account'] || row['Name'] || '',
            type: (row['Type'] || 'checking').toLowerCase() as 'checking' | 'savings' | 'credit' | 'investment' | 'retirement',
            balance: parseFloat(row['Balance'] || row['Amount'] || '0'),
            currency: row['Currency'] || 'ZAR',
            institution: row['Institution'] || row['Bank'] || 'Unknown',
            lastUpdated: new Date(),
            accountNumber: row['Account Number'] || `****${Math.random().toString().slice(-4)}`
          };

          if (account.name && !isNaN(account.balance)) {
            accounts.push(account);
            importedCount++;
          }
        } catch (error) {
          console.error('Error processing account row:', row, error);
        }
      });

      // In a real app, you would save to database/state management
      console.log('Imported accounts:', accounts);

      return {
        success: true,
        message: `Successfully imported ${importedCount} accounts`,
        importedCount
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to import accounts: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  const processTransactionsCSV = (data: any[]): ImportResult => {
    try {
      let transactions: Transaction[] = [];
      let importedCount = 0;

      data.forEach((row, index) => {
        try {
          // Expected format: Date, Description, Amount, Category, Account, etc.
          const transaction: Transaction = {
            id: `imported-txn-${Date.now()}-${index}`,
            accountId: row['Account ID'] || row['Account'] || 'default',
            amount: parseFloat(row['Amount'] || '0'),
            description: row['Description'] || row['Memo'] || '',
            date: new Date(row['Date'] || new Date()),
            category: row['Category'] || 'Uncategorized',
            merchant: row['Merchant'] || '',
            pending: false,
            confidence: 0.85
          };

          if (transaction.description && !isNaN(transaction.amount)) {
            transactions.push(transaction);
            importedCount++;
          }
        } catch (error) {
          console.error('Error processing transaction row:', row, error);
        }
      });

      // In a real app, you would save to database/state management
      console.log('Imported transactions:', transactions);

      return {
        success: true,
        message: `Successfully imported ${importedCount} transactions`,
        importedCount
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to import transactions: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  const processSpendingCSV = (data: any[]): ImportResult => {
    try {
      // Process spending analysis data
      let processedCount = 0;

      data.forEach((row) => {
        // Expected format: Category, Amount, Month, etc.
        const category = row['Category'] || row['Spending Category'];
        const amount = parseFloat(row['Amount'] || row['Total'] || '0');
        
        if (category && !isNaN(amount)) {
          processedCount++;
          // In a real app, you would update spending analytics
          console.log(`Spending: ${category} - R${amount}`);
        }
      });

      return {
        success: true,
        message: `Successfully processed ${processedCount} spending categories`,
        importedCount: processedCount
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to process spending data: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  const handleImport = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsImporting(true);
    const results: ImportResult[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      try {
        const content = await file.text();
        const data = parseCSVContent(content);

        if (data.length === 0) {
          results.push({
            success: false,
            message: `${file.name}: No valid data found`
          });
          continue;
        }

        // Determine file type based on filename or content
        const filename = file.name.toLowerCase();
        let result: ImportResult;

        if (filename.includes('account') || filename.includes('balance')) {
          result = processAccountsCSV(data);
          result.message = `${file.name}: ${result.message}`;
        } else if (filename.includes('transaction') || filename.includes('statement')) {
          result = processTransactionsCSV(data);
          result.message = `${file.name}: ${result.message}`;
        } else if (filename.includes('spending') || filename.includes('expense')) {
          result = processSpendingCSV(data);
          result.message = `${file.name}: ${result.message}`;
        } else {
          // Try to auto-detect based on headers
          const headers = Object.keys(data[0] || {}).map(h => h.toLowerCase());
          
          if (headers.some(h => h.includes('balance') || h.includes('account'))) {
            result = processAccountsCSV(data);
          } else if (headers.some(h => h.includes('amount') && h.includes('description'))) {
            result = processTransactionsCSV(data);
          } else {
            result = processSpendingCSV(data);
          }
          result.message = `${file.name}: ${result.message}`;
        }

        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          message: `${file.name}: Failed to process file - ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }

    setImportResults(results);
    setIsImporting(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">CSV Data Import</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Import your financial data from CSV files. Supported formats include account lists, 
          transaction statements, and spending analysis reports.
        </p>
        
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload CSV files</span>
              <span> or drag and drop</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">CSV files only</p>
          </label>
        </div>

        {/* Selected Files */}
        {selectedFiles && selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Files:</h4>
            <div className="space-y-1">
              {Array.from(selectedFiles).map((file, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📄</span>
                  <span>{file.name}</span>
                  <span className="ml-auto text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Import Button */}
      <div className="mb-6">
        <button
          onClick={handleImport}
          disabled={!selectedFiles || selectedFiles.length === 0 || isImporting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isImporting ? 'Importing...' : 'Import CSV Files'}
        </button>
      </div>

      {/* Expected Format Guide */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Expected CSV Formats:</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <strong>Accounts:</strong> Account, Type, Institution, Balance, Currency
          </div>
          <div>
            <strong>Transactions:</strong> Date, Description, Amount, Category, Account
          </div>
          <div>
            <strong>Spending:</strong> Category, Amount, Month, Total
          </div>
        </div>
      </div>

      {/* Import Results */}
      {importResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Import Results:</h4>
          {importResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${
                result.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center">
                <span className={`mr-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? '✓' : '✗'}
                </span>
                <span className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Development Note */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>Development Note:</strong> This is a demonstration component. In a production app, 
          imported data would be validated, processed, and saved to your database with proper error handling.
        </p>
      </div>
    </div>
  );
}

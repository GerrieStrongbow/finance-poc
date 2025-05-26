import { Account, Transaction, NetWorthData } from '@/types/finance';

export function calculateNetWorth(accounts: Account[]): NetWorthData {
  let assets = 0;
  let liabilities = 0;

  accounts.forEach(account => {
    if (account.balance > 0) {
      assets += account.balance;
    } else {
      liabilities += Math.abs(account.balance);
    }
  });

  return {
    assets,
    liabilities,
    netWorth: assets - liabilities
  };
}

export function formatCurrency(amount: number, currency: string = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function getAccountTypeColor(type: Account['type']): string {
  const colors = {
    checking: 'bg-blue-100 text-blue-800',
    savings: 'bg-green-100 text-green-800',
    credit: 'bg-red-100 text-red-800',
    investment: 'bg-purple-100 text-purple-800',
    loan: 'bg-orange-100 text-orange-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

export function getCategoryForTransaction(description: string): { category: string; confidence: number } {
  const patterns = [
    { pattern: /woolworths|pick.*pay|checkers|spar|shoprite/i, category: 'Groceries', confidence: 0.9 },
    { pattern: /uber|bolt|taxi|transport/i, category: 'Transport', confidence: 0.85 },
    { pattern: /shell|bp|engen|sasol|petrol|fuel/i, category: 'Transport', confidence: 0.9 },
    { pattern: /takealot|amazon|online.*shop|shop.*online/i, category: 'Shopping', confidence: 0.8 },
    { pattern: /restaurant|mcdonald|kfc|steers|nando/i, category: 'Food & Dining', confidence: 0.85 },
    { pattern: /salary|payroll|income|wage/i, category: 'Income', confidence: 0.95 },
    { pattern: /rent|mortgage|bond/i, category: 'Housing', confidence: 0.9 },
    { pattern: /medical.*aid|discovery|momentum.*health|gems/i, category: 'Healthcare', confidence: 0.9 },
    { pattern: /interest.*payment|bank.*interest/i, category: 'Income', confidence: 0.95 },
  ];

  for (const { pattern, category, confidence } of patterns) {
    if (pattern.test(description)) {
      return { category, confidence };
    }
  }

  return { category: 'Uncategorized', confidence: 0.3 };
}

export function getTransactionsByDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  return transactions.filter(
    transaction => transaction.date >= startDate && transaction.date <= endDate
  );
}

export function groupTransactionsByCategory(transactions: Transaction[]): Record<string, Transaction[]> {
  return transactions.reduce((groups, transaction) => {
    const category = transaction.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);
}

export function getSpendingByCategory(transactions: Transaction[]): Array<{ category: string; amount: number }> {
  const spending = groupTransactionsByCategory(
    transactions.filter(t => t.amount < 0) // Only expenses
  );

  return Object.entries(spending).map(([category, transactions]) => ({
    category,
    amount: Math.abs(transactions.reduce((sum, t) => sum + t.amount, 0))
  })).sort((a, b) => b.amount - a.amount);
}

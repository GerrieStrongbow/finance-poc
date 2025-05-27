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

// Enhanced ML-based transaction categorization system
interface CategoryRule {
  patterns: RegExp[];
  category: string;
  baseConfidence: number;
  keywords: string[];
  merchantTypes: string[];
  amountRanges?: { min?: number; max?: number; boost: number }[];
}

const CATEGORIZATION_RULES: CategoryRule[] = [
  {
    patterns: [
      /woolworths|ww\s|pick.*pay|checkers|spar|shoprite|ok.*foods|food.*lover|fruit.*veg/i,
      /grocery|supermarket|market|food.*store/i
    ],
    category: 'Groceries',
    baseConfidence: 0.92,
    keywords: ['grocery', 'food', 'supermarket', 'fresh', 'produce'],
    merchantTypes: ['grocery', 'supermarket'],
    amountRanges: [
      { min: 50, max: 500, boost: 0.05 },
      { min: 500, max: 1500, boost: 0.03 }
    ]
  },
  {
    patterns: [
      /uber|bolt|taxify|lyft|ride.*share|e.*hailing/i,
      /taxi|transport|metro|gautrain|bus/i
    ],
    category: 'Transport',
    baseConfidence: 0.88,
    keywords: ['ride', 'trip', 'transport', 'travel', 'journey'],
    merchantTypes: ['transport', 'ride_share'],
    amountRanges: [
      { min: 15, max: 200, boost: 0.08 }
    ]
  },
  {
    patterns: [
      /shell|bp|engen|sasol|caltex|total/i,
      /petrol|fuel|gas.*station|service.*station/i
    ],
    category: 'Transport',
    baseConfidence: 0.94,
    keywords: ['fuel', 'petrol', 'diesel', 'gas'],
    merchantTypes: ['fuel', 'gas_station'],
    amountRanges: [
      { min: 300, max: 1200, boost: 0.06 }
    ]
  },
  {
    patterns: [
      /takealot|amazon|online.*shop|shop.*online|konga|bid.*buy/i,
      /e.*commerce|web.*store|digital.*store/i
    ],
    category: 'Shopping',
    baseConfidence: 0.85,
    keywords: ['online', 'delivery', 'purchase', 'order'],
    merchantTypes: ['ecommerce', 'online_retail']
  },
  {
    patterns: [
      /restaurant|mcdonald|kfc|steers|nando|wimpy|spur|ocean.*basket/i,
      /dining|eatery|cafe|coffee.*shop|bistro|grill/i
    ],
    category: 'Food & Dining',
    baseConfidence: 0.89,
    keywords: ['meal', 'dining', 'restaurant', 'food', 'eat'],
    merchantTypes: ['restaurant', 'fast_food', 'cafe'],
    amountRanges: [
      { min: 80, max: 400, boost: 0.07 }
    ]
  },
  {
    patterns: [
      /salary|payroll|income|wage|bonus|commission/i,
      /payment.*received|deposit.*salary|emp.*payment/i
    ],
    category: 'Income',
    baseConfidence: 0.96,
    keywords: ['salary', 'wage', 'income', 'payment', 'earnings'],
    merchantTypes: ['employer', 'payroll']
  },
  {
    patterns: [
      /rent|rental|lease|mortgage|bond.*payment|property.*payment/i,
      /housing|accommodation|residential/i
    ],
    category: 'Housing',
    baseConfidence: 0.93,
    keywords: ['rent', 'property', 'housing', 'home', 'apartment'],
    merchantTypes: ['property', 'real_estate'],
    amountRanges: [
      { min: 5000, max: 25000, boost: 0.05 }
    ]
  },
  {
    patterns: [
      /medical.*aid|discovery.*health|momentum.*health|gems|bestmed|bonitas/i,
      /health.*insurance|medical.*scheme|clinic|hospital|pharmacy/i
    ],
    category: 'Healthcare',
    baseConfidence: 0.91,
    keywords: ['medical', 'health', 'clinic', 'pharmacy', 'doctor'],
    merchantTypes: ['healthcare', 'medical'],
    amountRanges: [
      { min: 1000, max: 5000, boost: 0.04 }
    ]
  },
  {
    patterns: [
      /interest.*payment|bank.*interest|investment.*return|dividend/i,
      /savings.*interest|fixed.*deposit.*interest/i
    ],
    category: 'Income',
    baseConfidence: 0.97,
    keywords: ['interest', 'dividend', 'return', 'investment'],
    merchantTypes: ['bank', 'investment']
  },
  {
    patterns: [
      /absa.*fee|fnb.*fee|standard.*bank.*fee|nedbank.*fee|capitec.*fee/i,
      /bank.*charge|account.*fee|service.*fee|atm.*fee|card.*fee/i
    ],
    category: 'Banking Fees',
    baseConfidence: 0.95,
    keywords: ['fee', 'charge', 'service', 'bank', 'account'],
    merchantTypes: ['bank'],
    amountRanges: [
      { min: 5, max: 100, boost: 0.08 }
    ]
  },
  {
    patterns: [
      /insurance|life.*cover|car.*insurance|home.*insurance|short.*term/i,
      /assurance|cover|premium|policy/i
    ],
    category: 'Insurance',
    baseConfidence: 0.90,
    keywords: ['insurance', 'premium', 'cover', 'policy'],
    merchantTypes: ['insurance'],
    amountRanges: [
      { min: 500, max: 3000, boost: 0.05 }
    ]
  },
  {
    patterns: [
      /utility|electricity|water.*bill|municipal|city.*council/i,
      /eskom|prepaid.*electricity|rates.*taxes/i
    ],
    category: 'Utilities',
    baseConfidence: 0.92,
    keywords: ['electricity', 'water', 'municipal', 'utility'],
    merchantTypes: ['utility'],
    amountRanges: [
      { min: 500, max: 2500, boost: 0.06 }
    ]
  },
  {
    patterns: [
      /telkom|vodacom|mtn|cell.*c|rain|webafrica/i,
      /internet|wifi|data|cellular|mobile.*data/i
    ],
    category: 'Communications',
    baseConfidence: 0.89,
    keywords: ['internet', 'mobile', 'data', 'cellular'],
    merchantTypes: ['telecom'],
    amountRanges: [
      { min: 200, max: 1000, boost: 0.06 }
    ]
  },
  {
    patterns: [
      /netflix|showmax|dstv|multichoice|amazon.*prime|spotify/i,
      /subscription|streaming|entertainment|music.*service/i
    ],
    category: 'Entertainment',
    baseConfidence: 0.87,
    keywords: ['subscription', 'streaming', 'entertainment', 'music'],
    merchantTypes: ['entertainment', 'streaming'],
    amountRanges: [
      { min: 50, max: 500, boost: 0.07 }
    ]
  }
];

export function getCategoryForTransaction(description: string, amount?: number): { category: string; confidence: number } {
  let bestMatch = { category: 'Uncategorized', confidence: 0.3 };
  
  for (const rule of CATEGORIZATION_RULES) {
    let confidence = rule.baseConfidence;
    let matchFound = false;
    
    // Check pattern matching
    for (const pattern of rule.patterns) {
      if (pattern.test(description)) {
        matchFound = true;
        break;
      }
    }
    
    if (!matchFound) {
      // Check keyword matching with partial confidence
      const descLower = description.toLowerCase();
      const keywordMatches = rule.keywords.filter(keyword => 
        descLower.includes(keyword.toLowerCase())
      ).length;
      
      if (keywordMatches > 0) {
        matchFound = true;
        confidence = Math.max(0.4, confidence - 0.3 + (keywordMatches * 0.1));
      }
    }
    
    if (matchFound) {
      // Apply amount-based confidence boosts
      if (amount && rule.amountRanges) {
        for (const range of rule.amountRanges) {
          const absAmount = Math.abs(amount);
          if ((!range.min || absAmount >= range.min) && 
              (!range.max || absAmount <= range.max)) {
            confidence += range.boost;
            break;
          }
        }
      }
      
      // Ensure confidence doesn't exceed 0.99
      confidence = Math.min(0.99, confidence);
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { category: rule.category, confidence };
      }
    }
  }
  
  return bestMatch;
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

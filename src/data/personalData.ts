// Personal finance data based on actual May 2025 figures
import { Account, Transaction, Category } from '@/types/finance';
import { getCategoryForTransaction } from '@/utils/finance';

// Real accounts based on your balance sheet (May 2025)
export const personalAccounts: Account[] = [
  // Banking Accounts
  {
    id: 'g-current',
    name: 'G Current Account',
    type: 'checking',
    balance: 1870.00,
    currency: 'ZAR',
    institution: 'Standard Bank', // Assumed
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****4567'
  },
  {
    id: 'a-current',
    name: 'A Current Account', 
    type: 'checking',
    balance: 24924.00,
    currency: 'ZAR',
    institution: 'FNB', // Assumed
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****8901'
  },
  {
    id: 'g-credit',
    name: 'G Credit Card',
    type: 'credit',
    balance: -9362.00,
    currency: 'ZAR',
    institution: 'Standard Bank',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****2345'
  },
  {
    id: 'a-credit',
    name: 'A Credit Card',
    type: 'credit', 
    balance: -2173.00,
    currency: 'ZAR',
    institution: 'FNB',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****6789'
  },
  
  // Savings & Emergency Funds
  {
    id: 'g-slush',
    name: 'G Slush Fund',
    type: 'savings',
    balance: 106419.00,
    currency: 'ZAR',
    institution: 'Standard Bank',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****1111'
  },
  {
    id: 'a-emergency',
    name: 'A Emergency Fund',
    type: 'savings',
    balance: 162786.00,
    currency: 'ZAR',
    institution: 'FNB',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****2222'
  },
  {
    id: 'a-vehicle',
    name: 'A Vehicle Fund',
    type: 'savings',
    balance: 100000.00,
    currency: 'ZAR',
    institution: 'FNB',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****3333'
  },
  {
    id: 'g-vacation',
    name: 'G Vacation Fund',
    type: 'savings',
    balance: 1028.00,
    currency: 'ZAR',
    institution: 'Standard Bank',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****4444'
  },

  // Investment Accounts
  {
    id: 'g-ee-zar',
    name: 'G EasyEquities ZAR',
    type: 'investment',
    balance: 5277.00,
    currency: 'ZAR',
    institution: 'EasyEquities',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****5555'
  },
  {
    id: 'g-ee-tfsa',
    name: 'G EasyEquities TFSA',
    type: 'investment',
    balance: 120630.00,
    currency: 'ZAR',
    institution: 'EasyEquities',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****6666'
  },
  {
    id: 'g-ee-usd',
    name: 'G EasyEquities USD',
    type: 'investment',
    balance: 19868.00,
    currency: 'ZAR',
    institution: 'EasyEquities',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****7777'
  },
  {
    id: 'g-cedarhill',
    name: 'G Cedarhill Investments',
    type: 'investment',
    balance: 111889.00,
    currency: 'ZAR',
    institution: 'Cedarhill',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****8888'
  },
  
  // Retirement Accounts
  {
    id: 'g-retirement',
    name: 'G Retirement Annuity',
    type: 'retirement',
    balance: 134379.00,
    currency: 'ZAR',
    institution: 'Old Mutual', // Assumed
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****9999'
  },
  {
    id: 'a-gepf',
    name: 'A GEPF',
    type: 'retirement',
    balance: 94082.00,
    currency: 'ZAR',
    institution: 'GEPF',
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****0000'
  },
  {
    id: 'a-preservation',
    name: 'A Preservation Fund',
    type: 'retirement',
    balance: 235826.00,
    currency: 'ZAR',
    institution: 'Liberty', // Assumed
    lastUpdated: new Date('2025-05-27'),
    accountNumber: '****1212'
  }
];

// Realistic transactions based on your spending categories
export const personalTransactions: Transaction[] = [
  // May 2025 Income
  {
    id: 'tx-income-g-may',
    accountId: 'g-current',
    amount: 50170.00,
    description: 'SALARY DEPOSIT - G',
    date: new Date('2025-05-25T09:00:00'),
    category: 'Income',
    subcategory: 'Salary',
    pending: false,
    confidence: 0.99
  },
  {
    id: 'tx-income-a-may',
    accountId: 'a-current',
    amount: 19376.00,
    description: 'SALARY DEPOSIT - A',
    date: new Date('2025-05-25T09:30:00'),
    category: 'Income',
    subcategory: 'Salary',
    pending: false,
    confidence: 0.99
  },
  {
    id: 'tx-income-med-may',
    accountId: 'a-current',
    amount: 3926.00,
    description: 'MEDICAL REPAYMENT',
    date: new Date('2025-05-25T10:00:00'),
    category: 'Income',
    subcategory: 'Medical Repayment',
    pending: false,
    confidence: 0.98
  },
  {
    id: 'tx-income-interest',
    accountId: 'g-slush',
    amount: 1409.00,
    description: 'INTEREST EARNED',
    date: new Date('2025-05-25T12:00:00'),
    category: 'Income',
    subcategory: 'Investment Returns',
    pending: false,
    confidence: 0.99
  },

  // Housing/Rent (Your largest expense)
  {
    id: 'tx-rent-may',
    accountId: 'g-current',
    amount: -14300.00,
    description: 'MONTHLY RENT PAYMENT',
    date: new Date('2025-05-01T08:00:00'),
    category: 'Housing',
    subcategory: 'Rent',
    pending: false,
    confidence: 0.99
  },

  // Giving (Your 10% category)
  {
    id: 'tx-tithing-may',
    accountId: 'g-current',
    amount: -5000.00,
    description: 'TITHING DONATION',
    date: new Date('2025-05-01T09:00:00'),
    category: 'Giving',
    subcategory: 'Tithing',
    pending: false,
    confidence: 0.99
  },
  {
    id: 'tx-donation-may',
    accountId: 'g-current',
    amount: -500.00,
    description: 'CHARITABLE DONATION',
    date: new Date('2025-05-15T10:00:00'),
    category: 'Giving',
    subcategory: 'Donations',
    pending: false,
    confidence: 0.95
  },

  // Investing/Saving (Your 20% category)
  {
    id: 'tx-retirement-may',
    accountId: 'g-current',
    amount: -4000.00,
    description: 'RETIREMENT CONTRIBUTION',
    date: new Date('2025-05-01T11:00:00'),
    category: 'Investment',
    subcategory: 'Retirement',
    pending: false,
    confidence: 0.99
  },
  {
    id: 'tx-tfsa-may',
    accountId: 'g-current',
    amount: -3000.00,
    description: 'TAX-FREE SAVINGS',
    date: new Date('2025-05-01T11:30:00'),
    category: 'Investment',
    subcategory: 'Tax-Free Savings',
    pending: false,
    confidence: 0.99
  },
  {
    id: 'tx-emergency-may',
    accountId: 'a-current',
    amount: -4000.00,
    description: 'EMERGENCY FUND TRANSFER',
    date: new Date('2025-05-01T12:00:00'),
    category: 'Saving',
    subcategory: 'Emergency Fund',
    pending: false,
    confidence: 0.99
  },

  // Groceries (Major spending category)
  {
    id: 'tx-woolworths-1',
    accountId: 'g-credit',
    amount: -1247.50,
    description: 'WOOLWORTHS SANDTON',
    date: new Date('2025-05-26T14:30:00'),
    category: 'Groceries',
    subcategory: 'Food & Beverages',
    merchant: 'Woolworths',
    pending: false,
    confidence: 0.95
  },
  {
    id: 'tx-woolworths-2',
    accountId: 'a-credit',
    amount: -678.25,
    description: 'WOOLWORTHS MENLYN',
    date: new Date('2025-05-20T16:20:00'),
    category: 'Groceries',
    subcategory: 'Food & Beverages',
    merchant: 'Woolworths',
    pending: false,
    confidence: 0.95
  },
  {
    id: 'tx-checkers-1',
    accountId: 'g-credit',
    amount: -892.40,
    description: 'CHECKERS HATFIELD',
    date: new Date('2025-05-18T11:15:00'),
    category: 'Groceries',
    subcategory: 'Food & Beverages',
    merchant: 'Checkers',
    pending: false,
    confidence: 0.92
  },
  {
    id: 'tx-pnp-1',
    accountId: 'a-credit',
    amount: -445.80,
    description: 'PICK N PAY BROOKLYN',
    date: new Date('2025-05-15T19:30:00'),
    category: 'Groceries',
    subcategory: 'Food & Beverages',
    merchant: 'Pick n Pay',
    pending: false,
    confidence: 0.93
  },

  // Transport & Fuel
  {
    id: 'tx-shell-1',
    accountId: 'g-credit',
    amount: -750.00,
    description: 'SHELL LYNNWOOD',
    date: new Date('2025-05-24T07:30:00'),
    category: 'Transport',
    subcategory: 'Fuel',
    merchant: 'Shell',
    pending: false,
    confidence: 0.96
  },
  {
    id: 'tx-sasol-1',
    accountId: 'a-credit',
    amount: -680.50,
    description: 'SASOL MENLYN',
    date: new Date('2025-05-20T08:15:00'),
    category: 'Transport',
    subcategory: 'Fuel',
    merchant: 'Sasol',
    pending: false,
    confidence: 0.94
  },
  {
    id: 'tx-uber-1',
    accountId: 'g-credit',
    amount: -45.00,
    description: 'UBER TRIP 27/05',
    date: new Date('2025-05-27T18:45:00'),
    category: 'Transport',
    subcategory: 'Ride Sharing',
    merchant: 'Uber',
    pending: false,
    confidence: 0.92
  },

  // Medical/Healthcare
  {
    id: 'tx-medical-aid',
    accountId: 'g-current',
    amount: -1820.00,
    description: 'DISCOVERY MEDICAL AID',
    date: new Date('2025-05-01T09:30:00'),
    category: 'Healthcare',
    subcategory: 'Medical Aid',
    pending: false,
    confidence: 0.99
  },
  {
    id: 'tx-pharmacy-1',
    accountId: 'a-credit',
    amount: -345.60,
    description: 'CLICKS PHARMACY',
    date: new Date('2025-05-22T14:20:00'),
    category: 'Healthcare',
    subcategory: 'Pharmacy',
    merchant: 'Clicks',
    pending: false,
    confidence: 0.94
  },

  // Education (Based on your budget)
  {
    id: 'tx-education-1',
    accountId: 'g-current',
    amount: -3058.00,
    description: 'EDUCATION PAYMENT',
    date: new Date('2025-05-01T10:30:00'),
    category: 'Education',
    subcategory: 'Course Fees',
    pending: false,
    confidence: 0.97
  },

  // Insurance
  {
    id: 'tx-insurance-may',
    accountId: 'g-current',
    amount: -1344.00,
    description: 'SANTAM INSURANCE',
    date: new Date('2025-05-01T11:00:00'),
    category: 'Insurance',
    subcategory: 'General Insurance',
    pending: false,
    confidence: 0.98
  },

  // Banking Fees
  {
    id: 'tx-banking-g',
    accountId: 'g-current',
    amount: -373.50,
    description: 'STANDARD BANK FEES',
    date: new Date('2025-05-01T00:01:00'),
    category: 'Banking',
    subcategory: 'Banking Fees',
    pending: false,
    confidence: 0.99
  },
  {
    id: 'tx-banking-a',
    accountId: 'a-current',
    amount: -373.50,
    description: 'FNB BANKING FEES',
    date: new Date('2025-05-01T00:01:00'),
    category: 'Banking',
    subcategory: 'Banking Fees',
    pending: false,
    confidence: 0.99
  },

  // Cellphone & Internet
  {
    id: 'tx-cellphone-g',
    accountId: 'g-current',
    amount: -336.50,
    description: 'VODACOM CONTRACT',
    date: new Date('2025-05-01T09:15:00'),
    category: 'Communications',
    subcategory: 'Cellphone',
    pending: false,
    confidence: 0.98
  },
  {
    id: 'tx-cellphone-a',
    accountId: 'a-current',
    amount: -336.50,
    description: 'MTN CONTRACT',
    date: new Date('2025-05-01T09:15:00'),
    category: 'Communications',
    subcategory: 'Cellphone',
    pending: false,
    confidence: 0.98
  },
  {
    id: 'tx-internet-may',
    accountId: 'g-current',
    amount: -109.00,
    description: 'TELKOM INTERNET',
    date: new Date('2025-05-01T08:30:00'),
    category: 'Communications',
    subcategory: 'Internet',
    pending: false,
    confidence: 0.99
  },

  // Entertainment & Wants
  {
    id: 'tx-gym-g',
    accountId: 'g-current',
    amount: -549.00,
    description: 'VIRGIN ACTIVE GYM',
    date: new Date('2025-05-01T10:00:00'),
    category: 'Health & Fitness',
    subcategory: 'Gym Membership',
    pending: false,
    confidence: 0.98
  },
  {
    id: 'tx-netflix',
    accountId: 'g-credit',
    amount: -100.00,
    description: 'NETFLIX SUBSCRIPTION',
    date: new Date('2025-05-15T12:00:00'),
    category: 'Entertainment',
    subcategory: 'Streaming Services',
    merchant: 'Netflix',
    pending: false,
    confidence: 0.99
  },
  {
    id: 'tx-psychologist',
    accountId: 'a-current',
    amount: -1245.00,
    description: 'PSYCHOLOGIST SESSION',
    date: new Date('2025-05-20T15:00:00'),
    category: 'Healthcare',
    subcategory: 'Mental Health',
    pending: false,
    confidence: 0.97
  },

  // Dining & Social
  {
    id: 'tx-restaurant-1',
    accountId: 'g-credit',
    amount: -413.00,
    description: 'TASHAS MENLYN',
    date: new Date('2025-05-23T19:15:00'),
    category: 'Food & Dining',
    subcategory: 'Restaurants',
    merchant: 'Tashas',
    pending: false,
    confidence: 0.85
  },
  {
    id: 'tx-coffee-1',
    accountId: 'a-credit',
    amount: -57.00,
    description: 'SEATTLE COFFEE COMPANY',
    date: new Date('2025-05-26T08:30:00'),
    category: 'Food & Dining',
    subcategory: 'Coffee',
    merchant: 'Seattle Coffee',
    pending: false,
    confidence: 0.88
  },
  {
    id: 'tx-uber-eats',
    accountId: 'g-credit',
    amount: -185.50,
    description: 'UBER EATS DELIVERY',
    date: new Date('2025-05-25T20:30:00'),
    category: 'Food & Dining',
    subcategory: 'Takeaway',
    merchant: 'Uber Eats',
    pending: false,
    confidence: 0.90
  },

  // Shopping & Exceptions (Based on your data)
  {
    id: 'tx-takealot-1',
    accountId: 'a-credit',
    amount: -850.00,
    description: 'TAKEALOT ONLINE PURCHASE',
    date: new Date('2025-05-18T16:20:00'),
    category: 'Shopping',
    subcategory: 'Online Shopping',
    merchant: 'Takealot',
    pending: false,
    confidence: 0.88
  },
  {
    id: 'tx-clothing-1',
    accountId: 'g-credit',
    amount: -1233.00,
    description: 'ZARA CLOTHING',
    date: new Date('2025-05-16T14:45:00'),
    category: 'Shopping',
    subcategory: 'Clothing',
    merchant: 'Zara',
    pending: false,
    confidence: 0.85
  },

  // Car-related expenses (Major exception category for you)
  {
    id: 'tx-car-service',
    accountId: 'g-current',
    amount: -3858.00,
    description: 'CAR SERVICE - MERCEDES',
    date: new Date('2025-05-10T09:00:00'),
    category: 'Transport',
    subcategory: 'Vehicle Maintenance',
    pending: false,
    confidence: 0.95
  }
];

// Enhanced categorization for existing transactions
export function enhanceTransactionCategorization(transactions: Transaction[]): Transaction[] {
  return transactions.map(transaction => {
    // Skip if already has high confidence
    if (transaction.confidence && transaction.confidence > 0.9) {
      return transaction;
    }

    // Get enhanced categorization
    const result = getCategoryForTransaction(transaction.description, transaction.amount);
    
    // Only update if the new categorization has higher confidence
    if (result.confidence > (transaction.confidence || 0)) {
      return {
        ...transaction,
        category: result.category,
        confidence: result.confidence
      };
    }

    return transaction;
  });
}

// Add some additional realistic transactions with ML categorization
export const additionalPersonalTransactions: Transaction[] = [
  // Banking fees
  {
    id: 'tx-bank-fee-1',
    accountId: 'g-current',
    amount: -75.00,
    description: 'ABSA MONTHLY ACCOUNT FEE',
    date: new Date('2025-05-02T08:00:00'),
    category: 'Banking Fees',
    subcategory: 'Account Fees',
    pending: false,
    confidence: 0.96
  },
  {
    id: 'tx-bank-fee-2',
    accountId: 'a-current',
    amount: -45.00,
    description: 'FNB CARD FEE',
    date: new Date('2025-05-02T08:15:00'),
    category: 'Banking Fees',
    subcategory: 'Card Fees',
    pending: false,
    confidence: 0.94
  },

  // Utilities
  {
    id: 'tx-electricity',
    accountId: 'g-current',
    amount: -850.00,
    description: 'ESKOM PREPAID ELECTRICITY',
    date: new Date('2025-05-05T10:00:00'),
    category: 'Utilities',
    subcategory: 'Electricity',
    pending: false,
    confidence: 0.98
  },
  {
    id: 'tx-water',
    accountId: 'g-current',
    amount: -420.00,
    description: 'CITY OF CAPE TOWN WATER',
    date: new Date('2025-05-05T10:30:00'),
    category: 'Utilities',
    subcategory: 'Water',
    pending: false,
    confidence: 0.97
  },

  // Communications
  {
    id: 'tx-internet',
    accountId: 'g-current',
    amount: -899.00,
    description: 'WEBAFRICA FIBER',
    date: new Date('2025-05-03T09:00:00'),
    category: 'Communications',
    subcategory: 'Internet',
    pending: false,
    confidence: 0.95
  },
  {
    id: 'tx-mobile-g',
    accountId: 'g-current',
    amount: -350.00,
    description: 'VODACOM CONTRACT',
    date: new Date('2025-05-03T09:15:00'),
    category: 'Communications',
    subcategory: 'Mobile',
    pending: false,
    confidence: 0.93
  },
  {
    id: 'tx-mobile-a',
    accountId: 'a-current',
    amount: -299.00,
    description: 'MTN MOBILE DATA',
    date: new Date('2025-05-03T09:30:00'),
    category: 'Communications',
    subcategory: 'Mobile',
    pending: false,
    confidence: 0.91
  },

  // Entertainment subscriptions
  {
    id: 'tx-streaming-1',
    accountId: 'g-current',
    amount: -199.00,
    description: 'NETFLIX SUBSCRIPTION',
    date: new Date('2025-05-06T12:00:00'),
    category: 'Entertainment',
    subcategory: 'Streaming',
    pending: false,
    confidence: 0.96
  },
  {
    id: 'tx-streaming-2',
    accountId: 'g-current',
    amount: -89.00,
    description: 'SHOWMAX MONTHLY',
    date: new Date('2025-05-06T12:15:00'),
    category: 'Entertainment',
    subcategory: 'Streaming',
    pending: false,
    confidence: 0.94
  },
  {
    id: 'tx-music',
    accountId: 'g-current',
    amount: -59.99,
    description: 'SPOTIFY PREMIUM',
    date: new Date('2025-05-06T12:30:00'),
    category: 'Entertainment',
    subcategory: 'Music',
    pending: false,
    confidence: 0.92
  },

  // Groceries with ML categorization
  {
    id: 'tx-grocery-1',
    accountId: 'g-current',
    amount: -1250.00,
    description: 'WOOLWORTHS CAPE QUARTER',
    date: new Date('2025-05-08T14:30:00'),
    category: 'Groceries',
    subcategory: 'Food & Beverages',
    pending: false,
    confidence: 0.97
  },
  {
    id: 'tx-grocery-2',
    accountId: 'g-current',
    amount: -890.50,
    description: 'PICK N PAY FAMILY',
    date: new Date('2025-05-12T16:45:00'),
    category: 'Groceries',
    subcategory: 'Food & Beverages',
    pending: false,
    confidence: 0.96
  },
  {
    id: 'tx-grocery-3',
    accountId: 'g-current',
    amount: -650.00,
    description: 'CHECKERS HYPER',
    date: new Date('2025-05-18T11:00:00'),
    category: 'Groceries',
    subcategory: 'Food & Beverages',
    pending: false,
    confidence: 0.95
  },

  // Transport
  {
    id: 'tx-fuel-1',
    accountId: 'g-credit',
    amount: -720.00,
    description: 'SHELL V-POWER',
    date: new Date('2025-05-10T07:30:00'),
    category: 'Transport',
    subcategory: 'Fuel',
    pending: false,
    confidence: 0.98
  },
  {
    id: 'tx-fuel-2',
    accountId: 'g-credit',
    amount: -680.00,
    description: 'BP ULTIMATE',
    date: new Date('2025-05-20T08:00:00'),
    category: 'Transport',
    subcategory: 'Fuel',
    pending: false,
    confidence: 0.97
  },
  {
    id: 'tx-uber-1',
    accountId: 'g-current',
    amount: -85.50,
    description: 'UBER TRIP',
    date: new Date('2025-05-14T18:30:00'),
    category: 'Transport',
    subcategory: 'Ride Sharing',
    pending: false,
    confidence: 0.89
  },
  {
    id: 'tx-parking',
    accountId: 'g-current',
    amount: -25.00,
    description: 'PARKADE PARKING',
    date: new Date('2025-05-16T09:00:00'),
    category: 'Transport',
    subcategory: 'Parking',
    pending: false,
    confidence: 0.85
  },

  // Restaurants and dining
  {
    id: 'tx-dining-1',
    accountId: 'g-credit',
    amount: -450.00,
    description: 'OCEAN BASKET V&A',
    date: new Date('2025-05-11T19:30:00'),
    category: 'Food & Dining',
    subcategory: 'Restaurants',
    pending: false,
    confidence: 0.92
  },
  {
    id: 'tx-dining-2',
    accountId: 'g-current',
    amount: -120.00,
    description: 'MCDONALD\'S CANAL WALK',
    date: new Date('2025-05-17T12:30:00'),
    category: 'Food & Dining',
    subcategory: 'Fast Food',
    pending: false,
    confidence: 0.94
  },
  {
    id: 'tx-coffee',
    accountId: 'g-current',
    amount: -55.00,
    description: 'VIDA E CAFFE',
    date: new Date('2025-05-19T08:30:00'),
    category: 'Food & Dining',
    subcategory: 'Coffee Shop',
    pending: false,
    confidence: 0.88
  },

  // Online shopping
  {
    id: 'tx-online-1',
    accountId: 'g-credit',
    amount: -1250.00,
    description: 'TAKEALOT.COM PURCHASE',
    date: new Date('2025-05-13T15:00:00'),
    category: 'Shopping',
    subcategory: 'Online Shopping',
    pending: false,
    confidence: 0.91
  },
  {
    id: 'tx-online-2',
    accountId: 'g-credit',
    amount: -350.00,
    description: 'AMAZON.COM ORDER',
    date: new Date('2025-05-21T10:30:00'),
    category: 'Shopping',
    subcategory: 'Online Shopping',
    pending: false,
    confidence: 0.89
  }
];

// Combine all transactions
export const allPersonalTransactions: Transaction[] = [
  ...personalTransactions,
  ...additionalPersonalTransactions
];

// Budget categories based on your 50/20/20/10 model
export const personalCategories: Category[] = [
  // Income
  { id: 'cat-income', name: 'Income', icon: '💰', color: 'bg-green-500', target: 75026 },
  
  // Giving (10%)
  { id: 'cat-giving', name: 'Giving', icon: '❤️', color: 'bg-purple-500', target: 7000 },
  
  // Investment/Saving (20%)
  { id: 'cat-investment', name: 'Investment', icon: '📈', color: 'bg-blue-500', target: 7500 },
  { id: 'cat-saving', name: 'Saving', icon: '🏦', color: 'bg-cyan-500', target: 4000 },
  
  // Essentials/Needs (50%)
  { id: 'cat-housing', name: 'Housing', icon: '🏠', color: 'bg-red-500', target: 14300 },
  { id: 'cat-groceries', name: 'Groceries', icon: '🛒', color: 'bg-green-600', target: 4964 },
  { id: 'cat-transport', name: 'Transport', icon: '🚗', color: 'bg-yellow-500', target: 2989 },
  { id: 'cat-healthcare', name: 'Healthcare', icon: '🏥', color: 'bg-pink-500', target: 2000 },
  { id: 'cat-communications', name: 'Communications', icon: '📱', color: 'bg-indigo-500', target: 800 },
  { id: 'cat-education', name: 'Education', icon: '📚', color: 'bg-orange-500', target: 3058 },
  { id: 'cat-insurance', name: 'Insurance', icon: '🛡️', color: 'bg-gray-500', target: 1344 },
  { id: 'cat-banking', name: 'Banking', icon: '🏛️', color: 'bg-slate-500', target: 747 },
  
  // Wants (20%)
  { id: 'cat-fitness', name: 'Health & Fitness', icon: '💪', color: 'bg-lime-500', target: 549 },
  { id: 'cat-entertainment', name: 'Entertainment', icon: '🎬', color: 'bg-rose-500', target: 300 },
  { id: 'cat-dining', name: 'Food & Dining', icon: '🍽️', color: 'bg-amber-500', target: 800 },
  { id: 'cat-shopping', name: 'Shopping', icon: '🛍️', color: 'bg-violet-500', target: 1000 },
  
  // Other
  { id: 'cat-other', name: 'Other', icon: '❓', color: 'bg-gray-400', target: 0 }
];

import { Account, Transaction, Category } from '@/types/finance';
import { personalAccounts, allPersonalTransactions, personalCategories } from './personalData';

const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Primary Checking',
    type: 'checking',
    balance: 15420.50,
    currency: 'ZAR',
    institution: 'Standard Bank',
    lastUpdated: new Date('2025-05-26T10:30:00'),
    accountNumber: '****1234'
  },
  {
    id: '2',
    name: 'Savings Account',
    type: 'savings',
    balance: 85000.00,
    currency: 'ZAR',
    institution: 'FNB',
    lastUpdated: new Date('2025-05-26T08:15:00'),
    accountNumber: '****5678'
  },
  {
    id: '3',
    name: 'Credit Card',
    type: 'credit',
    balance: -4250.75,
    currency: 'ZAR',
    institution: 'ABSA',
    lastUpdated: new Date('2025-05-26T09:45:00'),
    accountNumber: '****9012'
  },
  {
    id: '4',
    name: 'Investment Account',
    type: 'investment',
    balance: 125000.00,
    currency: 'ZAR',
    institution: 'Investec',
    lastUpdated: new Date('2025-05-25T16:00:00'),
    accountNumber: '****3456'
  },
  {
    id: '5',
    name: 'Home Loan',
    type: 'loan',
    balance: -450000.00,
    currency: 'ZAR',
    institution: 'Nedbank',
    lastUpdated: new Date('2025-05-25T12:00:00'),
    accountNumber: '****7890'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    accountId: '1',
    amount: -89.50,
    description: 'WOOLWORTHS GARDENS',
    date: new Date('2025-05-26T14:30:00'),
    category: 'Groceries',
    subcategory: 'Food & Beverages',
    merchant: 'Woolworths',
    pending: false,
    confidence: 0.95
  },
  {
    id: '2',
    accountId: '1',
    amount: -1200.00,
    description: 'RENT PAYMENT',
    date: new Date('2025-05-25T08:00:00'),
    category: 'Housing',
    subcategory: 'Rent',
    pending: false,
    confidence: 0.99
  },
  {
    id: '3',
    accountId: '3',
    amount: -45.00,
    description: 'UBER TRIP',
    date: new Date('2025-05-25T18:45:00'),
    category: 'Transport',
    subcategory: 'Ride Sharing',
    merchant: 'Uber',
    pending: false,
    confidence: 0.92
  },
  {
    id: '4',
    accountId: '1',
    amount: 25000.00,
    description: 'SALARY DEPOSIT',
    date: new Date('2025-05-25T09:00:00'),
    category: 'Income',
    subcategory: 'Salary',
    pending: false,
    confidence: 0.99
  },
  {
    id: '5',
    accountId: '3',
    amount: -150.00,
    description: 'TAKEALOT ONLINE',
    date: new Date('2025-05-24T16:20:00'),
    category: 'Shopping',
    subcategory: 'Online Shopping',
    merchant: 'Takealot',
    pending: false,
    confidence: 0.88
  },
  {
    id: '6',
    accountId: '1',
    amount: -65.00,
    description: 'SHELL PETROL STATION',
    date: new Date('2025-05-24T07:30:00'),
    category: 'Transport',
    subcategory: 'Fuel',
    merchant: 'Shell',
    pending: false,
    confidence: 0.96
  },
  {
    id: '7',
    accountId: '3',
    amount: -320.00,
    description: 'RESTAURANT MEAL',
    date: new Date('2025-05-23T19:15:00'),
    category: 'Food & Dining',
    subcategory: 'Restaurants',
    pending: false,
    confidence: 0.85
  },
  {
    id: '8',
    accountId: '1',
    amount: -890.00,
    description: 'MEDICAL AID PAYMENT',
    date: new Date('2025-05-23T10:00:00'),
    category: 'Healthcare',
    subcategory: 'Medical Aid',
    pending: false,
    confidence: 0.98
  },
  {
    id: '9',
    accountId: '2',
    amount: 500.00,
    description: 'INTEREST PAYMENT',
    date: new Date('2025-05-22T12:00:00'),
    category: 'Income',
    subcategory: 'Interest',
    pending: false,
    confidence: 0.99
  },
  {
    id: '10',
    accountId: '1',
    amount: -75.50,
    description: 'UNKNOWN MERCHANT',
    date: new Date('2025-05-22T15:30:00'),
    category: 'Uncategorized',
    pending: false,
    confidence: 0.45
  }
];

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Income',
    icon: '💰',
    color: 'bg-green-500',
    subcategories: ['Salary', 'Freelance', 'Interest', 'Dividends', 'Other Income']
  },
  {
    id: '2',
    name: 'Housing',
    icon: '🏠',
    color: 'bg-blue-500',
    subcategories: ['Rent', 'Mortgage', 'Property Tax', 'Utilities', 'Maintenance']
  },
  {
    id: '3',
    name: 'Transport',
    icon: '🚗',
    color: 'bg-yellow-500',
    subcategories: ['Fuel', 'Public Transport', 'Ride Sharing', 'Car Maintenance', 'Insurance']
  },
  {
    id: '4',
    name: 'Groceries',
    icon: '🛒',
    color: 'bg-green-600',
    subcategories: ['Food & Beverages', 'Household Items', 'Personal Care']
  },
  {
    id: '5',
    name: 'Food & Dining',
    icon: '🍽️',
    color: 'bg-orange-500',
    subcategories: ['Restaurants', 'Fast Food', 'Coffee', 'Takeaway']
  },
  {
    id: '6',
    name: 'Shopping',
    icon: '🛍️',
    color: 'bg-purple-500',
    subcategories: ['Clothing', 'Electronics', 'Online Shopping', 'Gifts']
  },
  {
    id: '7',
    name: 'Healthcare',
    icon: '🏥',
    color: 'bg-red-500',
    subcategories: ['Medical Aid', 'Doctor Visits', 'Pharmacy', 'Dental']
  },
  {
    id: '8',
    name: 'Entertainment',
    icon: '🎬',
    color: 'bg-pink-500',
    subcategories: ['Movies', 'Streaming', 'Games', 'Events', 'Sports']
  },
  {
    id: '9',
    name: 'Uncategorized',
    icon: '❓',
    color: 'bg-gray-500',
    subcategories: []
  }
];

// Toggle between mock data and personal data
const USE_PERSONAL_DATA = true; // Set to false to use demo data

// Main exports (dynamic based on USE_PERSONAL_DATA flag)
export const accounts: Account[] = USE_PERSONAL_DATA ? personalAccounts : mockAccounts;
export const transactions: Transaction[] = USE_PERSONAL_DATA ? allPersonalTransactions : mockTransactions;
export const categories: Category[] = USE_PERSONAL_DATA ? personalCategories : mockCategories;

// Utility to switch data source
export const setDataSource = (usePersonal: boolean) => {
  // Note: In a real app, this would trigger a state update/reload
  console.log(`Switching to ${usePersonal ? 'personal' : 'mock'} data`);
};

// Keep original exports for backward compatibility
export { mockAccounts, mockTransactions, mockCategories };

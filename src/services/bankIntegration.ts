// Bank Integration Service for South African Banks
// This simulates real banking API integrations for demo purposes

export interface BankProvider {
  id: string;
  name: string;
  logo: string;
  supported: boolean;
  connectionType: 'api' | 'screen_scraping' | 'manual';
  features: string[];
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync?: Date;
  accountCount?: number;
}

export interface BankConnection {
  id: string;
  bankId: string;
  accountId: string;
  accountName: string;
  accountType: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
  isActive: boolean;
}

export interface ConnectionResult {
  success: boolean;
  message: string;
  connectionId?: string;
  accounts?: BankConnection[];
  error?: string;
}

// South African Banking Providers
export const SOUTH_AFRICAN_BANKS: BankProvider[] = [
  {
    id: 'absa',
    name: 'ABSA Bank',
    logo: '/banks/absa.png',
    supported: true,
    connectionType: 'api',
    features: ['Real-time balances', 'Transaction history', 'Account details', 'Investment tracking'],
    status: 'connected',
    lastSync: new Date('2024-01-15T10:30:00'),
    accountCount: 8
  },
  {
    id: 'fnb',
    name: 'First National Bank',
    logo: '/banks/fnb.png',
    supported: true,
    connectionType: 'api',
    features: ['Real-time balances', 'Transaction history', 'Card controls'],
    status: 'disconnected',
    accountCount: 0
  },
  {
    id: 'standard_bank',
    name: 'Standard Bank',
    logo: '/banks/standard-bank.png',
    supported: true,
    connectionType: 'api',
    features: ['Account aggregation', 'Transaction categorization', 'Investment tracking'],
    status: 'disconnected',
    accountCount: 0
  },
  {
    id: 'nedbank',
    name: 'Nedbank',
    logo: '/banks/nedbank.png',
    supported: true,
    connectionType: 'api',
    features: ['Account balances', 'Transaction history', 'Goal tracking'],
    status: 'disconnected',
    accountCount: 0
  },
  {
    id: 'capitec',
    name: 'Capitec Bank',
    logo: '/banks/capitec.png',
    supported: true,
    connectionType: 'api',
    features: ['Real-time notifications', 'Spending insights', 'Save & invest'],
    status: 'disconnected',
    accountCount: 0
  },
  {
    id: 'discovery_bank',
    name: 'Discovery Bank',
    logo: '/banks/discovery.png',
    supported: true,
    connectionType: 'api',
    features: ['Behavioural insights', 'Rewards tracking', 'Health & wealth integration'],
    status: 'disconnected',
    accountCount: 0
  },
  {
    id: 'investec',
    name: 'Investec',
    logo: '/banks/investec.png',
    supported: false,
    connectionType: 'manual',
    features: ['Premium banking', 'Investment management', 'Private wealth'],
    status: 'disconnected',
    accountCount: 0
  },
  {
    id: 'african_bank',
    name: 'African Bank',
    logo: '/banks/african-bank.png',
    supported: false,
    connectionType: 'manual',
    features: ['Personal loans', 'Credit solutions'],
    status: 'disconnected',
    accountCount: 0
  }
];

class BankIntegrationService {
  private connections: BankConnection[] = [];
  private providers: BankProvider[] = [...SOUTH_AFRICAN_BANKS];

  // Get all available banking providers
  getProviders(): BankProvider[] {
    return this.providers;
  }

  // Get connected banks
  getConnectedBanks(): BankProvider[] {
    return this.providers.filter(bank => bank.status === 'connected');
  }

  // Get bank connections
  getConnections(): BankConnection[] {
    return this.connections;
  }

  // Connect to a bank (simulated)
  async connectBank(bankId: string, credentials: any): Promise<ConnectionResult> {
    const bank = this.providers.find(b => b.id === bankId);
    
    if (!bank) {
      return {
        success: false,
        message: 'Bank not found',
        error: 'Invalid bank ID'
      };
    }

    if (!bank.supported) {
      return {
        success: false,
        message: 'Bank integration not yet supported',
        error: 'This bank requires manual CSV import'
      };
    }

    // Simulate API connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate successful connection for ABSA (already connected in demo)
    if (bankId === 'absa') {
      const mockAccounts: BankConnection[] = [
        {
          id: 'absa-checking-001',
          bankId: 'absa',
          accountId: '4062-7123-4567',
          accountName: 'Cheque Account',
          accountType: 'checking',
          balance: 15420.50,
          currency: 'ZAR',
          lastUpdated: new Date(),
          isActive: true
        },
        {
          id: 'absa-savings-001',
          bankId: 'absa',
          accountId: '4062-7123-4568',
          accountName: 'Savings Account',
          accountType: 'savings',
          balance: 95000.00,
          currency: 'ZAR',
          lastUpdated: new Date(),
          isActive: true
        },
        {
          id: 'absa-credit-001',
          bankId: 'absa',
          accountId: '4062-7123-4569',
          accountName: 'Credit Card',
          accountType: 'credit',
          balance: -8500.00,
          currency: 'ZAR',
          lastUpdated: new Date(),
          isActive: true
        }
      ];

      this.connections.push(...mockAccounts);
      
      // Update bank status
      const bankIndex = this.providers.findIndex(b => b.id === bankId);
      this.providers[bankIndex] = {
        ...bank,
        status: 'connected',
        lastSync: new Date(),
        accountCount: mockAccounts.length
      };

      return {
        success: true,
        message: 'Successfully connected to ABSA Bank',
        connectionId: `connection-${bankId}-${Date.now()}`,
        accounts: mockAccounts
      };
    }

    // Simulate connection for other banks
    const mockAccount: BankConnection = {
      id: `${bankId}-checking-001`,
      bankId,
      accountId: `${bankId.toUpperCase()}-001`,
      accountName: 'Main Account',
      accountType: 'checking',
      balance: Math.random() * 50000,
      currency: 'ZAR',
      lastUpdated: new Date(),
      isActive: true
    };

    this.connections.push(mockAccount);

    // Update bank status
    const bankIndex = this.providers.findIndex(b => b.id === bankId);
    this.providers[bankIndex] = {
      ...bank,
      status: 'connected',
      lastSync: new Date(),
      accountCount: 1
    };

    return {
      success: true,
      message: `Successfully connected to ${bank.name}`,
      connectionId: `connection-${bankId}-${Date.now()}`,
      accounts: [mockAccount]
    };
  }

  // Disconnect from a bank
  async disconnectBank(bankId: string): Promise<ConnectionResult> {
    const bank = this.providers.find(b => b.id === bankId);
    
    if (!bank) {
      return {
        success: false,
        message: 'Bank not found',
        error: 'Invalid bank ID'
      };
    }

    // Remove connections for this bank
    this.connections = this.connections.filter(conn => conn.bankId !== bankId);

    // Update bank status
    const bankIndex = this.providers.findIndex(b => b.id === bankId);
    this.providers[bankIndex] = {
      ...bank,
      status: 'disconnected',
      lastSync: undefined,
      accountCount: 0
    };

    return {
      success: true,
      message: `Successfully disconnected from ${bank.name}`
    };
  }

  // Sync account data (refresh balances and transactions)
  async syncAccounts(bankId?: string): Promise<ConnectionResult> {
    const banksToSync = bankId 
      ? this.providers.filter(b => b.id === bankId && b.status === 'connected')
      : this.providers.filter(b => b.status === 'connected');

    if (banksToSync.length === 0) {
      return {
        success: false,
        message: 'No connected banks to sync',
        error: 'No active connections found'
      };
    }

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update last sync time for all synced banks
    banksToSync.forEach(bank => {
      const bankIndex = this.providers.findIndex(b => b.id === bank.id);
      this.providers[bankIndex] = {
        ...bank,
        lastSync: new Date()
      };
    });

    // Update connection timestamps
    this.connections.forEach(conn => {
      if (!bankId || conn.bankId === bankId) {
        conn.lastUpdated = new Date();
      }
    });

    return {
      success: true,
      message: `Successfully synced ${banksToSync.length} bank(s)`
    };
  }

  // Get account balance for a specific connection
  getAccountBalance(connectionId: string): number | null {
    const connection = this.connections.find(conn => conn.id === connectionId);
    return connection ? connection.balance : null;
  }

  // Check if a bank supports a specific feature
  supportsFeature(bankId: string, feature: string): boolean {
    const bank = this.providers.find(b => b.id === bankId);
    return bank ? bank.features.includes(feature) : false;
  }

  // Get connection health status
  getConnectionHealth(bankId: string): 'healthy' | 'warning' | 'error' {
    const bank = this.providers.find(b => b.id === bankId);
    
    if (!bank || bank.status !== 'connected') {
      return 'error';
    }

    if (!bank.lastSync) {
      return 'error';
    }

    const timeSinceSync = Date.now() - bank.lastSync.getTime();
    const hoursOld = timeSinceSync / (1000 * 60 * 60);

    if (hoursOld > 24) {
      return 'warning';
    }

    return 'healthy';
  }
}

// Export singleton instance
export const bankIntegrationService = new BankIntegrationService();
export default bankIntegrationService;
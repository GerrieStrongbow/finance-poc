/**
 * Yodlee API Service
 * Handles integration with Yodlee for account aggregation and data retrieval
 */

import { Account, Transaction } from '@/types/finance';

export interface YodleeConfig {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  fastlinkUrl: string;
}

export interface YodleeTokenResponse {
  token: {
    accessToken: string;
    issuedAt: string;
    expiresIn: number;
  };
}

export interface YodleeUserResponse {
  user: {
    id: number;
    loginName: string;
    email?: string;
    name?: {
      first?: string;
      last?: string;
    };
  };
}

export interface YodleeAccountResponse {
  account: {
    id: number;
    accountName: string;
    accountType: string;
    accountNumber?: string;
    providerName: string;
    isAsset: boolean;
    balance?: {
      amount: number;
      currency: string;
    };
    lastUpdated: string;
  }[];
}

export interface YodleeTransactionResponse {
  transaction: {
    id: number;
    accountId: number;
    amount: {
      amount: number;
      currency: string;
    };
    baseType: 'DEBIT' | 'CREDIT';
    categoryType: string;
    category: string;
    description: {
      original: string;
    };
    date: string;
    status: 'POSTED' | 'PENDING';
    merchant?: {
      name: string;
    };
  }[];
}

export interface FastLinkOptions {
  containerId: string;
  user: {
    loginName: string;
  };
  configName?: 'Aggregation' | 'Verification';
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
  onExit?: () => void;
}

export class YodleeService {
  private config: YodleeConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  
  constructor(config: YodleeConfig) {
    this.config = config;
  }
  
  /**
   * Get an access token for API calls
   */
  async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }
    
    try {
      const response = await fetch(`${this.config.apiUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Api-Version': '1.1',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'clientId': this.config.clientId,
          'secret': this.config.clientSecret,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json() as YodleeTokenResponse;
      this.accessToken = data.token.accessToken;
      
      // Set token expiry (subtract 5 minutes for safety)
      const expiryMs = (data.token.expiresIn - 300) * 1000;
      this.tokenExpiry = new Date(Date.now() + expiryMs);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Yodlee access token:', error);
      throw error;
    }
  }
  
  /**
   * Register a new user in Yodlee
   */
  async registerUser(loginName: string, email?: string): Promise<YodleeUserResponse> {
    const token = await this.getAccessToken();
    
    try {
      const response = await fetch(`${this.config.apiUrl}/user/register`, {
        method: 'POST',
        headers: {
          'Api-Version': '1.1',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: {
            loginName,
            email,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to register user: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as YodleeUserResponse;
    } catch (error) {
      console.error('Error registering Yodlee user:', error);
      throw error;
    }
  }
  
  /**
   * Get user details
   */
  async getUser(loginName: string): Promise<YodleeUserResponse> {
    const token = await this.getAccessToken();
    
    try {
      const response = await fetch(`${this.config.apiUrl}/user?loginName=${loginName}`, {
        method: 'GET',
        headers: {
          'Api-Version': '1.1',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get user: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as YodleeUserResponse;
    } catch (error) {
      console.error('Error getting Yodlee user:', error);
      throw error;
    }
  }
  
  /**
   * Get FastLink token for a user
   */
  async getFastLinkToken(loginName: string): Promise<string> {
    const token = await this.getAccessToken();
    
    try {
      console.log(`Getting FastLink token for user: ${loginName}`);
      
      // For sandbox environment, we can use a simulated token for testing
      if (this.config.apiUrl.includes('sandbox')) {
        console.log('Using sandbox environment, returning simulated token');
        // In sandbox, we can use a dummy token for testing
        return token;
      }
      
      const response = await fetch(`${this.config.apiUrl}/user/accessTokens?appIds=10003600`, {
        method: 'POST',
        headers: {
          'Api-Version': '1.1',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'loginName': loginName,
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to get FastLink token: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('FastLink token response:', data);
      
      if (!data.user?.accessTokens?.[0]?.value) {
        throw new Error('Invalid FastLink token response format');
      }
      
      return data.user.accessTokens[0].value;
    } catch (error) {
      console.error('Error getting FastLink token:', error);
      throw error;
    }
  }
  
  /**
   * Get accounts for a user
   */
  async getAccounts(loginName: string): Promise<Account[]> {
    const token = await this.getAccessToken();
    
    try {
      const response = await fetch(`${this.config.apiUrl}/accounts`, {
        method: 'GET',
        headers: {
          'Api-Version': '1.1',
          'Authorization': `Bearer ${token}`,
          'loginName': loginName,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get accounts: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json() as YodleeAccountResponse;
      
      // Map Yodlee accounts to our Account type
      return data.account.map(acc => {
        // Map Yodlee account types to our types
        let type: Account['type'] = 'checking';
        if (acc.accountType.includes('CREDIT')) {
          type = 'credit';
        } else if (acc.accountType.includes('INVESTMENT')) {
          type = 'investment';
        } else if (acc.accountType.includes('SAVINGS')) {
          type = 'savings';
        } else if (acc.accountType.includes('LOAN')) {
          type = 'loan';
        } else if (acc.accountType.includes('RETIREMENT')) {
          type = 'retirement';
        }
        
        return {
          id: acc.id.toString(),
          name: acc.accountName,
          type,
          balance: acc.balance?.amount || 0,
          currency: acc.balance?.currency || 'ZAR',
          institution: acc.providerName,
          lastUpdated: new Date(acc.lastUpdated),
          accountNumber: acc.accountNumber,
        };
      });
    } catch (error) {
      console.error('Error getting Yodlee accounts:', error);
      throw error;
    }
  }
  
  /**
   * Get transactions for a user
   */
  async getTransactions(
    loginName: string, 
    fromDate: Date, 
    toDate: Date
  ): Promise<Transaction[]> {
    const token = await this.getAccessToken();
    
    // Format dates as YYYY-MM-DD
    const fromDateStr = fromDate.toISOString().split('T')[0];
    const toDateStr = toDate.toISOString().split('T')[0];
    
    try {
      const response = await fetch(
        `${this.config.apiUrl}/transactions?fromDate=${fromDateStr}&toDate=${toDateStr}`, {
        method: 'GET',
        headers: {
          'Api-Version': '1.1',
          'Authorization': `Bearer ${token}`,
          'loginName': loginName,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get transactions: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json() as YodleeTransactionResponse;
      
      // Map Yodlee transactions to our Transaction type
      return data.transaction.map(tx => {
        return {
          id: tx.id.toString(),
          accountId: tx.accountId.toString(),
          amount: tx.baseType === 'CREDIT' ? tx.amount.amount : -tx.amount.amount,
          description: tx.description.original,
          date: new Date(tx.date),
          category: tx.category,
          merchant: tx.merchant?.name,
          pending: tx.status === 'PENDING',
          confidence: 1.0, // Yodlee categories are considered reliable
        };
      });
    } catch (error) {
      console.error('Error getting Yodlee transactions:', error);
      throw error;
    }
  }
  
  /**
   * Generate FastLink configuration for embedding
   */
  generateFastLinkConfig(
    loginName: string, 
    accessToken: string, 
    options: FastLinkOptions
  ): Record<string, any> {
    return {
      fastLinkURL: this.config.fastlinkUrl,
      token: {
        tokenType: 'AccessToken',
        value: accessToken,
      },
      config: {
        flow: options.configName || 'Aggregation',
        iframeTarget: options.containerId,
        providerSearchInput: true,
        base64ImageSrc: true,
        siteSearchProviderIds: "16441,16442,16443,16444,16445",
      },
      user: {
        loginName,
      },
      onSuccess: options.onSuccess,
      onError: options.onError,
      onClose: options.onClose,
      onExit: options.onExit,
    };
  }
}

// Default sandbox configuration
export const yodleeSandboxConfig: YodleeConfig = {
  apiUrl: 'https://sandbox.api.yodlee.com/ysl',
  clientId: 's8IIVr7HACOZBCoGMJd82L2FBrH18mEMI0iD0ic4lr1elCAN',
  clientSecret: 'fei87q4yZuq21XtvbVpG5KtDm5HxQBGHRUAEbY66qEfTv3rAQzLGSxdci17EsnGq',
  fastlinkUrl: 'https://fl4.sandbox.yodlee.com/authenticate/restserver/fastlink',
};

// Create a singleton instance with sandbox config
export const yodleeService = new YodleeService(yodleeSandboxConfig);

export default yodleeService; 
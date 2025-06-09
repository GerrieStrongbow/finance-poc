import { YodleeService, YodleeConfig } from '@/services/yodlee';

// Mock response data
const mockTokenResponse = {
  token: {
    accessToken: 'test-access-token',
    issuedAt: '2023-01-01T00:00:00Z',
    expiresIn: 900
  }
};

const mockUserResponse = {
  user: {
    id: 12345,
    loginName: 'test-user',
    email: 'test@example.com',
    name: {
      first: 'Test',
      last: 'User'
    }
  }
};

const mockAccountsResponse = {
  account: [
    {
      id: 1001,
      accountName: 'Test Checking',
      accountType: 'CHECKING',
      accountNumber: '1234567890',
      providerName: 'Test Bank',
      isAsset: true,
      balance: {
        amount: 1000,
        currency: 'ZAR'
      },
      lastUpdated: '2023-01-01T00:00:00Z'
    },
    {
      id: 1002,
      accountName: 'Test Credit Card',
      accountType: 'CREDIT',
      accountNumber: '9876543210',
      providerName: 'Test Bank',
      isAsset: false,
      balance: {
        amount: -500,
        currency: 'ZAR'
      },
      lastUpdated: '2023-01-01T00:00:00Z'
    }
  ]
};

const mockTransactionsResponse = {
  transaction: [
    {
      id: 2001,
      accountId: 1001,
      amount: {
        amount: 100,
        currency: 'ZAR'
      },
      baseType: 'CREDIT',
      categoryType: 'INCOME',
      category: 'Salary',
      description: {
        original: 'SALARY PAYMENT'
      },
      date: '2023-01-15',
      status: 'POSTED',
      merchant: {
        name: 'EMPLOYER INC'
      }
    },
    {
      id: 2002,
      accountId: 1001,
      amount: {
        amount: 50,
        currency: 'ZAR'
      },
      baseType: 'DEBIT',
      categoryType: 'EXPENSE',
      category: 'Food & Dining',
      description: {
        original: 'GROCERY STORE'
      },
      date: '2023-01-16',
      status: 'POSTED',
      merchant: {
        name: 'GROCERY STORE'
      }
    }
  ]
};

const mockFastLinkTokenResponse = {
  user: {
    accessTokens: [
      {
        value: 'fastlink-access-token'
      }
    ]
  }
};

// Test configuration
const testConfig: YodleeConfig = {
  apiUrl: 'https://test.api.yodlee.com/ysl',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  fastlinkUrl: 'https://test.fastlink.yodlee.com'
};

describe('YodleeService', () => {
  let yodleeService: YodleeService;
  
  beforeEach(() => {
    yodleeService = new YodleeService(testConfig);
    
    // Reset and setup global fetch mock
    (global.fetch as jest.Mock).mockReset();
  });
  
  describe('getAccessToken', () => {
    it('should fetch and return an access token', async () => {
      // Setup mock response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse
      });
      
      const token = await yodleeService.getAccessToken();
      
      // Check if fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.yodlee.com/ysl/auth/token',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Api-Version': '1.1',
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: expect.any(URLSearchParams)
        })
      );
      
      // Check if the correct token was returned
      expect(token).toBe('test-access-token');
    });
    
    it('should throw an error when the API call fails', async () => {
      // Setup mock response for failure
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });
      
      // Check if the error is thrown
      await expect(yodleeService.getAccessToken()).rejects.toThrow(
        'Failed to get token: 401 Unauthorized'
      );
    });
    
    it('should reuse existing token if not expired', async () => {
      // First call to get token
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse
      });
      
      await yodleeService.getAccessToken();
      
      // Reset mock to verify it's not called again
      (global.fetch as jest.Mock).mockReset();
      
      // Second call should use cached token
      const token = await yodleeService.getAccessToken();
      
      expect(token).toBe('test-access-token');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
  
  describe('getAccounts', () => {
    it('should fetch and return accounts', async () => {
      // Setup mock responses for token and accounts
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTokenResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAccountsResponse
        });
      
      const accounts = await yodleeService.getAccounts('test-user');
      
      // Check if fetch was called with correct parameters for accounts
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.yodlee.com/ysl/accounts',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Api-Version': '1.1',
            'Authorization': 'Bearer test-access-token',
            'loginName': 'test-user'
          })
        })
      );
      
      // Check if accounts were mapped correctly
      expect(accounts).toHaveLength(2);
      
      // Check first account
      expect(accounts[0]).toEqual({
        id: '1001',
        name: 'Test Checking',
        type: 'checking',
        balance: 1000,
        currency: 'ZAR',
        institution: 'Test Bank',
        lastUpdated: expect.any(Date),
        accountNumber: '1234567890'
      });
      
      // Check second account
      expect(accounts[1]).toEqual({
        id: '1002',
        name: 'Test Credit Card',
        type: 'credit',
        balance: -500,
        currency: 'ZAR',
        institution: 'Test Bank',
        lastUpdated: expect.any(Date),
        accountNumber: '9876543210'
      });
    });
  });
  
  describe('getTransactions', () => {
    it('should fetch and return transactions', async () => {
      // Setup mock responses for token and transactions
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTokenResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTransactionsResponse
        });
      
      const fromDate = new Date('2023-01-01');
      const toDate = new Date('2023-01-31');
      
      const transactions = await yodleeService.getTransactions('test-user', fromDate, toDate);
      
      // Check if fetch was called with correct parameters for transactions
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.yodlee.com/ysl/transactions?fromDate=2023-01-01&toDate=2023-01-31',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Api-Version': '1.1',
            'Authorization': 'Bearer test-access-token',
            'loginName': 'test-user'
          })
        })
      );
      
      // Check if transactions were mapped correctly
      expect(transactions).toHaveLength(2);
      
      // Check first transaction (credit)
      expect(transactions[0]).toEqual({
        id: '2001',
        accountId: '1001',
        amount: 100, // Positive for credit
        description: 'SALARY PAYMENT',
        date: expect.any(Date),
        category: 'Salary',
        merchant: 'EMPLOYER INC',
        pending: false,
        confidence: 1.0
      });
      
      // Check second transaction (debit)
      expect(transactions[1]).toEqual({
        id: '2002',
        accountId: '1001',
        amount: -50, // Negative for debit
        description: 'GROCERY STORE',
        date: expect.any(Date),
        category: 'Food & Dining',
        merchant: 'GROCERY STORE',
        pending: false,
        confidence: 1.0
      });
    });
  });
  
  describe('getFastLinkToken', () => {
    it('should fetch and return a FastLink token', async () => {
      // Setup mock responses for token and FastLink token
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTokenResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockFastLinkTokenResponse
        });
      
      const fastLinkToken = await yodleeService.getFastLinkToken('test-user');
      
      // Check if fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.yodlee.com/ysl/user/accessTokens?appIds=10003600',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Api-Version': '1.1',
            'Authorization': 'Bearer test-access-token',
            'loginName': 'test-user'
          })
        })
      );
      
      // Check if the correct token was returned
      expect(fastLinkToken).toBe('fastlink-access-token');
    });
  });
  
  describe('generateFastLinkConfig', () => {
    it('should generate correct FastLink configuration', () => {
      const options = {
        containerId: 'fastlink-container',
        user: {
          loginName: 'test-user'
        },
        onSuccess: jest.fn(),
        onError: jest.fn()
      };
      
      const config = yodleeService.generateFastLinkConfig(
        'test-user',
        'fastlink-access-token',
        options
      );
      
      // Check if configuration is correct
      expect(config).toEqual({
        fastLinkURL: 'https://test.fastlink.yodlee.com',
        token: {
          tokenType: 'AccessToken',
          value: 'fastlink-access-token'
        },
        config: {
          flow: 'Aggregation',
          iframeTarget: 'fastlink-container',
          providerSearchInput: true
        },
        user: {
          loginName: 'test-user'
        },
        onSuccess: options.onSuccess,
        onError: options.onError,
        onClose: undefined,
        onExit: undefined
      });
    });
  });
}); 
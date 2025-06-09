import { YodleeService, yodleeSandboxConfig } from '@/services/yodlee';

describe('FastLink Integration', () => {
  let yodleeService: YodleeService;
  
  beforeEach(() => {
    yodleeService = new YodleeService(yodleeSandboxConfig);
    
    // Mock fetch
    global.fetch = jest.fn();
  });
  
  it('should generate valid FastLink configuration', () => {
    // Test data
    const loginName = 'sbMem6847250q5f18w1';
    const accessToken = 'test-access-token';
    const containerId = 'fastlink-container';
    
    // Mock callbacks
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onClose = jest.fn();
    
    // Generate config
    const config = yodleeService.generateFastLinkConfig(
      loginName,
      accessToken,
      {
        containerId,
        user: { loginName },
        onSuccess,
        onError,
        onClose
      }
    );
    
    // Verify config structure
    expect(config).toEqual({
      fastLinkURL: yodleeSandboxConfig.fastlinkUrl,
      token: {
        tokenType: 'AccessToken',
        value: accessToken
      },
      config: {
        flow: 'Aggregation',
        iframeTarget: containerId,
        providerSearchInput: true
      },
      user: {
        loginName
      },
      onSuccess,
      onError,
      onClose,
      onExit: undefined
    });
  });
  
  it('should use Verification flow when specified', () => {
    // Test data
    const loginName = 'sbMem6847250q5f18w1';
    const accessToken = 'test-access-token';
    const containerId = 'fastlink-container';
    
    // Generate config with Verification flow
    const config = yodleeService.generateFastLinkConfig(
      loginName,
      accessToken,
      {
        containerId,
        user: { loginName },
        configName: 'Verification'
      }
    );
    
    // Verify flow is set correctly
    expect(config.config.flow).toBe('Verification');
  });
  
  it('should fetch FastLink token for a user', async () => {
    // Mock responses
    const mockTokenResponse = {
      token: {
        accessToken: 'api-access-token',
        issuedAt: '2023-01-01T00:00:00Z',
        expiresIn: 900
      }
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
    
    // Setup mock fetch responses
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFastLinkTokenResponse
      });
    
    // Get FastLink token
    const loginName = 'sbMem6847250q5f18w1';
    const fastLinkToken = await yodleeService.getFastLinkToken(loginName);
    
    // Verify token
    expect(fastLinkToken).toBe('fastlink-access-token');
    
    // Verify API calls
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${yodleeSandboxConfig.apiUrl}/user/accessTokens?appIds=10003600`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Api-Version': '1.1',
          'Authorization': 'Bearer api-access-token',
          'loginName': loginName
        })
      })
    );
  });
}); 
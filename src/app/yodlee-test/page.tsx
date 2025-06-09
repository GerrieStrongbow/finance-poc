'use client';

import React, { useState, useEffect, useRef } from 'react';
import { yodleeSandboxConfig, YodleeService } from '@/services/yodlee';
import Script from 'next/script';

export default function YodleeTestPage() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'init' | 'registering' | 'ready' | 'connecting'>('init');
  const [logs, setLogs] = useState<string[]>([]);
  
  const yodleeService = new YodleeService(yodleeSandboxConfig);
  
  // Use pre-registered sandbox user instead of creating new ones
  const testUser = {
    loginName: 'sbMem6847250q5f18w1', // Pre-registered sandbox user
    email: 'test@example.com'
  };

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Initialize and get token for pre-registered user
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);
        setStep('registering');
        addLog('Starting Yodlee integration test...');
        addLog(`Using pre-registered sandbox user: ${testUser.loginName}`);
        
        // Step 1: Get admin access token
        addLog('Getting admin access token...');
        const adminToken = await yodleeService.getAccessToken();
        addLog('Admin token obtained successfully');
        
        // Step 2: No need to register - user is pre-registered in sandbox
        addLog('Skipping user registration - using pre-registered sandbox user');
        
        // Step 3: Get user access token for FastLink
        addLog('Getting user access token for FastLink...');
        const fastLinkToken = await yodleeService.getFastLinkToken(testUser.loginName);
        addLog('FastLink token obtained successfully');
        
        setUserToken(fastLinkToken);
        setStep('ready');
        addLog('Initialization complete - ready to launch FastLink');
        
      } catch (err) {
        console.error('Error during initialization:', err);
        addLog(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStep('init');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (step === 'init') {
      initializeUser();
    }
  }, [step]);

  const launchFastLink = () => {
    if (!isScriptLoaded) {
      setError('FastLink SDK not loaded yet. Please wait.');
      return;
    }
    
    if (!userToken) {
      setError('No user token available. Please wait or refresh.');
      return;
    }
    
    try {
      setStep('connecting');
      addLog('Launching FastLink...');
      
      const fastLinkOptions = {
        fastLinkURL: yodleeSandboxConfig.fastlinkUrl,
        accessToken: `Bearer ${userToken}`,
        params: {
          userSession: {
            userSession: userToken
          },
          flow: 'add',
          configName: 'Aggregation'
        },
        onSuccess: (data: any) => {
          addLog('FastLink success: ' + JSON.stringify(data));
          setStep('ready');
          setIsModalOpen(false);
          // Here you would typically sync accounts and transactions
          syncAccountData();
        },
        onError: (error: any) => {
          addLog('FastLink error: ' + JSON.stringify(error));
          setError('FastLink error: ' + JSON.stringify(error));
          setStep('ready');
          setIsModalOpen(false);
        },
        onClose: () => {
          addLog('FastLink closed by user');
          setStep('ready');
          setIsModalOpen(false);
        },
        onExit: () => {
          addLog('FastLink exited');
          setStep('ready');
          setIsModalOpen(false);
        }
      };
      
      addLog('FastLink configuration: ' + JSON.stringify(fastLinkOptions, null, 2));
      
      // Launch FastLink
      if (typeof window !== 'undefined' && (window as any).fastlink) {
        setIsModalOpen(true);
        setTimeout(() => {
          (window as any).fastlink.open(fastLinkOptions, 'fastlink-container');
        }, 500);
      } else {
        setError('FastLink SDK not available on window object');
        addLog('Error: FastLink SDK not available');
      }
    } catch (err) {
      console.error('Error launching FastLink:', err);
      addLog(`Error launching FastLink: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStep('ready');
    }
  };

  const syncAccountData = async () => {
    try {
      addLog('Syncing account data...');
      
      // Get accounts
      const accounts = await yodleeService.getAccounts(testUser.loginName);
      addLog(`Found ${accounts.length} accounts`);
      
      // Get recent transactions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const transactions = await yodleeService.getTransactions(
        testUser.loginName,
        thirtyDaysAgo,
        new Date()
      );
      addLog(`Found ${transactions.length} transactions`);
      
      // Here you would integrate with your DataContext to store the data
      addLog('Account sync completed successfully');
      
    } catch (err) {
      addLog(`Error syncing data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const resetTest = () => {
    setStep('init');
    setUserToken('');
    setError(null);
    setLogs([]);
    setIsModalOpen(false);
  };
  return (
    <div className="p-6">
      <Script
        src="https://cdn.yodlee.com/fastlink/v4/initialize.js"
        strategy="beforeInteractive"
        onLoad={() => {
          addLog('FastLink script loaded successfully');
          setIsScriptLoaded(true);
        }}
        onError={() => {
          addLog('Failed to load FastLink script');
          setError('Failed to load FastLink script');
        }}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Yodlee FastLink Integration Test</h1>
        
        {/* Status Banner */}
        <div className={`p-4 rounded-lg mb-6 ${
          step === 'ready' ? 'bg-green-100 border border-green-400 text-green-700' :
          step === 'registering' || step === 'connecting' ? 'bg-blue-100 border border-blue-400 text-blue-700' :
          error ? 'bg-red-100 border border-red-400 text-red-700' :
          'bg-yellow-100 border border-yellow-400 text-yellow-700'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {step === 'init' && 'Initializing...'}
                {step === 'registering' && 'Setting up sandbox environment...'}
                {step === 'ready' && 'Ready to connect accounts'}
                {step === 'connecting' && 'Connecting to your bank...'}
                {error && 'Error occurred'}
              </h3>
              <p className="text-sm mt-1">
                {step === 'init' && 'Starting Yodlee integration test'}
                {step === 'registering' && 'Obtaining tokens for pre-registered sandbox user'}
                {step === 'ready' && 'Click "Connect Bank Account" to start the connection process'}
                {step === 'connecting' && 'FastLink is running - follow the prompts to connect your account'}
                {error && error}
              </p>
            </div>
            {error && (
              <button
                onClick={resetTest}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Test User Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Sandbox User Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Sandbox User ID:</span> {testUser.loginName}
            </div>
            <div>
              <span className="font-medium">User Type:</span> Pre-registered sandbox user
            </div>
            <div>
              <span className="font-medium">User Token:</span> {userToken ? `${userToken.substring(0, 20)}...` : 'None'}
            </div>
            <div>
              <span className="font-medium">Script Loaded:</span> {isScriptLoaded ? '✅ Yes' : '❌ No'}
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
            <p><strong>Note:</strong> This is a pre-registered sandbox user from Yodlee. No registration needed!</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <button
            onClick={launchFastLink}
            disabled={step !== 'ready' || !isScriptLoaded || !userToken || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mr-4"
          >
            {step === 'connecting' ? 'Connecting...' : 'Connect Bank Account'}
          </button>
          
          <button
            onClick={resetTest}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Reset Test
          </button>
        </div>

        {/* FastLink Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-5xl h-4/5 mx-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Connect Your Bank Account</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div 
                id="fastlink-container" 
                ref={containerRef} 
                className="flex-1 border border-gray-200 rounded"
                style={{ minHeight: '500px' }}
              ></div>
            </div>
          </div>
        )}

        {/* Test Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Test Instructions</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Step 1:</strong> Wait for initialization to complete (token setup for pre-registered user)</p>
            <p><strong>Step 2:</strong> Click "Connect Bank Account" to launch FastLink</p>
            <p><strong>Step 3:</strong> In the FastLink modal, you'll see test financial service providers</p>
            <p><strong>Step 4:</strong> Choose a provider and use these test credentials:</p>
            
            <div className="bg-white p-4 rounded mt-3 border">
              <h4 className="font-semibold mb-2">Available Test Providers & Credentials:</h4>
              <div className="space-y-2 text-xs">
                <div><strong>Dag Site:</strong> YodTest.site16441.2 / site16441.2</div>
                <div><strong>Dag Site Multilevel:</strong> YodTest.site16442.1 / site16442.1 (MFA: 123456)</div>
                <div><strong>Dag Site SecurityQA:</strong> YodTest.site16486.1 / site16486.1 (Q1: w3schools, Q2: Texas)</div>
                <div><strong>Dag OAuth:</strong> YodTest2.site19335.1 / site19335.1</div>
              </div>
            </div>
            
            <p><strong>Step 5:</strong> Complete the connection process and observe the logs</p>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <h3 className="text-white font-bold mb-2">Console Logs</h3>
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
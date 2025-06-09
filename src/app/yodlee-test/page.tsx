'use client';

import React, { useState, useEffect, useRef } from 'react';
import { yodleeSandboxConfig } from '@/services/yodlee';
import Script from 'next/script';

export default function YodleeTestPage() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get admin token for testing
  useEffect(() => {
    const getToken = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${yodleeSandboxConfig.apiUrl}/auth/token`, {
          method: 'POST',
          headers: {
            'Api-Version': '1.1',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'clientId': yodleeSandboxConfig.clientId,
            'secret': yodleeSandboxConfig.clientSecret,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to get token: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Token response:', data);
        setAccessToken(data.token.accessToken);
      } catch (err) {
        console.error('Error getting token:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    getToken();
  }, []);

  const launchFastLink = () => {
    if (!isScriptLoaded) {
      setError('FastLink SDK not loaded yet. Please wait.');
      return;
    }
    
    if (!accessToken) {
      setError('No access token available. Please wait or refresh.');
      return;
    }
    
    try {
      console.log('Launching FastLink with token:', accessToken);
      
      // Simple direct configuration
      const fastLinkOptions = {
        fastLinkURL: yodleeSandboxConfig.fastlinkUrl,
        token: {
          tokenType: 'AccessToken',
          value: accessToken,
        },
        config: {
          flow: 'Aggregation',
          iframeTarget: 'fastlink-container',
          providerSearchInput: true,
          siteSearchProviderIds: '16441,16442,16443,16444,16445',
        },
        user: {
          loginName: 'sbMem6847250q5f18w1',
        },
        onSuccess: (data: any) => {
          console.log('FastLink success:', data);
          alert('FastLink success: ' + JSON.stringify(data));
        },
        onError: (error: any) => {
          console.error('FastLink error:', error);
          setError('An error occurred while connecting to your account: ' + JSON.stringify(error));
        },
        onClose: () => {
          console.log('FastLink closed');
          setIsModalOpen(false);
        },
        onExit: () => {
          console.log('FastLink exited');
          setIsModalOpen(false);
        }
      };
      
      console.log('FastLink options:', fastLinkOptions);
      
      // Launch FastLink
      if (typeof window !== 'undefined' && (window as any).fastlink) {
        setIsModalOpen(true);
        setTimeout(() => {
          (window as any).fastlink.open(fastLinkOptions);
        }, 500);
      } else {
        setError('FastLink SDK not available on window object');
      }
    } catch (err) {
      console.error('Error launching FastLink:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="p-6">
      <Script
        src="https://cdn.yodlee.com/fastlink/v4/initialize.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('FastLink script loaded');
          setIsScriptLoaded(true);
        }}
        onError={() => {
          console.error('Failed to load FastLink script');
          setError('Failed to load FastLink script');
        }}
      />

      <h1 className="text-2xl font-bold mb-4">Yodlee FastLink Test</h1>
      
      {isLoading && <p className="text-blue-600">Loading token...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <p className="mb-2">Access Token: {accessToken ? `${accessToken.substring(0, 10)}...` : 'None'}</p>
        <button
          onClick={launchFastLink}
          disabled={!isScriptLoaded || !accessToken || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Launch FastLink
        </button>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-3/4 mx-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Connect Your Accounts</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                X
              </button>
            </div>
            
            <div 
              id="fastlink-container" 
              ref={containerRef} 
              className="flex-1"
              style={{ height: '500px', width: '100%' }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Instructions</h2>
        <p className="mb-2">Use these test credentials:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Provider: "Dag Site"</li>
          <li>Username: "YodTest.site16441.2"</li>
          <li>Password: "site16441.2"</li>
        </ul>
        <p className="text-sm text-gray-600">
          Check the browser console for detailed logs and error messages.
        </p>
      </div>
    </div>
  );
} 
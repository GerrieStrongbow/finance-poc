'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  WifiIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { yodleeService, yodleeSandboxConfig } from '@/services/yodlee';
import { useData } from '@/contexts/DataContext';
import Script from 'next/script';

// Define the structure for a bank connection
interface BankConnection {
  id: string;
  name: string;
  institution: string;
  status: 'active' | 'error' | 'pending';
  lastUpdated: Date;
  accountCount: number;
  error?: string;
}

// FastLink modal for connecting accounts
function FastLinkModal({ isOpen, onClose, loginName }: { 
  isOpen: boolean; 
  onClose: () => void;
  loginName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    
    const initializeFastLink = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Initializing FastLink with user:', loginName);
        
        // Get FastLink token
        const fastLinkToken = await yodleeService.getFastLinkToken(loginName);
        console.log('Received FastLink token:', fastLinkToken);
        
        // Check if FastLink is loaded
        if (typeof window === 'undefined' || !(window as any).fastlink) {
          console.error('FastLink SDK not loaded');
          setError('FastLink SDK not loaded. Please refresh the page and try again.');
          setIsLoading(false);
          return;
        }
        
        // Configure FastLink
        const fastLinkOptions = {
          fastLinkURL: yodleeSandboxConfig.fastlinkUrl,
          token: {
            tokenType: 'AccessToken',
            value: fastLinkToken,
          },
          config: {
            flow: 'Aggregation',
            iframeTarget: 'fastlink-container',
            providerSearchInput: true,
            base64ImageSrc: true,
            siteSearchProviderIds: "16441,16442,16443,16444,16445",
          },
          user: {
            loginName,
          },
          onSuccess: (data: any) => {
            console.log('FastLink success:', data);
            setTimeout(() => onClose(), 1500);
          },
          onError: (error: any) => {
            console.error('FastLink error:', error);
            setError('An error occurred while connecting to your account. Please try again.');
          },
          onClose: () => {
            console.log('FastLink closed');
            onClose();
          },
          onExit: () => {
            console.log('FastLink exited');
            onClose();
          }
        };
        
        console.log('FastLink options:', fastLinkOptions);
        
        // Launch FastLink
        (window as any).fastlink.open(fastLinkOptions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing FastLink:', error);
        setError(`Failed to initialize account connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };
    
    initializeFastLink();
  }, [isOpen, loginName, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-3/4 mx-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Connect Your Accounts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading account connection...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        <div 
          id="fastlink-container" 
          ref={containerRef} 
          className={`flex-1 ${isLoading || error ? 'hidden' : ''}`}
        ></div>
      </div>
    </div>
  );
}

export default function BankConnectionsPage() {
  const { accounts } = useData();
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [yodleeUser, setYodleeUser] = useState<string>('sbMem6847250q5f18w1'); // Default sandbox user
  const [isFastLinkLoaded, setIsFastLinkLoaded] = useState(false);

  useEffect(() => {
    // Group accounts by institution to create connections
    const groupedConnections = accounts.reduce((acc, account) => {
      if (!acc[account.institution]) {
        acc[account.institution] = {
          id: account.institution.toLowerCase().replace(/\s+/g, '-'),
          name: account.institution,
          institution: account.institution,
          status: 'active' as const,
          lastUpdated: account.lastUpdated,
          accountCount: 1
        };
      } else {
        acc[account.institution].accountCount += 1;
        // Update lastUpdated if this account was updated more recently
        if (account.lastUpdated > acc[account.institution].lastUpdated) {
          acc[account.institution].lastUpdated = account.lastUpdated;
        }
      }
      return acc;
    }, {} as Record<string, BankConnection>);
    
    setConnections(Object.values(groupedConnections));
  }, [accounts]);

  const handleConnect = async () => {
    setIsModalOpen(true);
  };

  const handleDisconnect = async (connectionId: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, we would call the Yodlee API to remove the connection
      // For now, we'll just show a success message
      setMessage({ type: 'success', text: 'Bank disconnected successfully' });
      
      // In a real implementation, we would refresh the connections
      // For now, we'll just remove it from our local state
      setConnections(connections.filter(conn => conn.id !== connectionId));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to disconnect bank' });
    } finally {
      setIsLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleSync = async (connectionId?: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, we would call the Yodlee API to refresh the connection
      // For now, we'll just show a success message
      setMessage({ type: 'success', text: connectionId 
        ? `Syncing ${connections.find(c => c.id === connectionId)?.name}...` 
        : 'Syncing all connections...' 
      });
      
      // Update the lastUpdated time for the connection(s)
      const now = new Date();
      setConnections(connections.map(conn => {
        if (!connectionId || conn.id === connectionId) {
          return { ...conn, lastUpdated: now };
        }
        return conn;
      }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to sync accounts' });
    } finally {
      setIsLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ArrowPathIcon className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <WifiIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (connection: BankConnection) => {
    switch (connection.status) {
      case 'active':
        return `Connected · ${connection.accountCount} account${connection.accountCount !== 1 ? 's' : ''}`;
      case 'error':
        return `Error: ${connection.error || 'Connection failed'}`;
      case 'pending':
        return 'Connecting...';
      default:
        return 'Not connected';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <Script 
        src="https://cdn.yodlee.com/fastlink/v4/initialize.js" 
        onLoad={() => {
          console.log('FastLink SDK loaded');
          setIsFastLinkLoaded(true);
        }}
        onError={() => {
          console.error('Failed to load FastLink SDK');
        }}
        strategy="beforeInteractive"
      />
      
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bank Connections</h1>
          <p className="text-gray-600 mt-1">Manage your connected financial accounts</p>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {message.type === 'success' && <CheckCircleIcon className="h-5 w-5 inline mr-2" />}
            {message.type === 'error' && <ExclamationTriangleIcon className="h-5 w-5 inline mr-2" />}
            {message.type === 'info' && <WifiIcon className="h-5 w-5 inline mr-2" />}
            {message.text}
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={handleConnect}
            disabled={isLoading || !isFastLinkLoaded}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Connect Account
          </button>
          
          <button
            onClick={() => handleSync()}
            disabled={isLoading || connections.length === 0}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sync All
          </button>
        </div>

        {/* Connections List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Connections</h2>
          </div>
          
          {connections.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <WifiIcon className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No connections</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connect your bank accounts to get started.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleConnect}
                  disabled={!isFastLinkLoaded}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Connect Account
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {connections.map((connection) => (
                <div key={connection.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4">
                        {getStatusIcon(connection.status)}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{connection.name}</h3>
                        <p className="text-sm text-gray-500">
                          {getStatusText(connection)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Last updated: {formatDate(connection.lastUpdated)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSync(connection.id)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Sync accounts"
                      >
                        <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDisconnect(connection.id)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Disconnect"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Developer Testing Controls - Remove in production */}
        <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Developer Testing</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Yodlee User ID</label>
              <input 
                type="text" 
                value={yodleeUser} 
                onChange={(e) => setYodleeUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!isFastLinkLoaded}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
            >
              Test FastLink
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Use Yodlee test credentials: 
            <br />
            Provider: "Dag Site" | Username: "YodTest.site16441.2" | Password: "site16441.2"
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800">
              <strong>Troubleshooting:</strong> If FastLink doesn't load, try the following:
              <br />
              1. Check browser console for errors
              <br />
              2. Make sure you're using the correct sandbox user ID
              <br />
              3. Try refreshing the page
              <br />
              4. If using an ad blocker, try disabling it
            </p>
          </div>
        </div>
      </div>
      
      {/* FastLink Modal */}
      <FastLinkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        loginName={yodleeUser}
      />
    </>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { 
  bankIntegrationService, 
  BankProvider, 
  ConnectionResult 
} from '@/services/bankIntegration';
import { 
  WifiIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

interface ConnectionModalProps {
  bank: BankProvider | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (bankId: string, credentials: any) => Promise<void>;
}

function ConnectionModal({ bank, isOpen, onClose, onConnect }: ConnectionModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    accessPin: ''
  });

  if (!isOpen || !bank) return null;

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect(bank.id, credentials);
      onClose();
      setCredentials({ username: '', password: '', accessPin: '' });
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Connect to {bank.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        {!bank.supported ? (
          <div className="text-center py-4">
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              {bank.name} integration is not yet supported. 
              Please use CSV import for now.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Enter your {bank.name} online banking credentials to connect your accounts.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-xs text-blue-800">
                  🔒 Your credentials are encrypted and never stored permanently. 
                  We use read-only access to fetch your account information.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username/ID Number
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username or ID number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              {bank.id === 'absa' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access PIN
                  </label>
                  <input
                    type="password"
                    value={credentials.accessPin}
                    onChange={(e) => setCredentials({...credentials, accessPin: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your 5-digit PIN"
                    maxLength={5}
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={isConnecting}
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={isConnecting || !credentials.username || !credentials.password}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isConnecting ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BankConnectionsPage() {
  const [banks, setBanks] = useState<BankProvider[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankProvider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = () => {
    const providers = bankIntegrationService.getProviders();
    setBanks(providers);
  };

  const handleConnect = async (bankId: string, credentials: any) => {
    setIsLoading(true);
    try {
      const result: ConnectionResult = await bankIntegrationService.connectBank(bankId, credentials);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        loadBanks(); // Refresh the bank list
      } else {
        setMessage({ type: 'error', text: result.error || result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to bank' });
    } finally {
      setIsLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleDisconnect = async (bankId: string) => {
    if (!confirm('Are you sure you want to disconnect this bank? This will remove all associated account data.')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await bankIntegrationService.disconnectBank(bankId);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        loadBanks();
      } else {
        setMessage({ type: 'error', text: result.error || result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to disconnect bank' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleSync = async (bankId?: string) => {
    setIsLoading(true);
    try {
      const result = await bankIntegrationService.syncAccounts(bankId);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        loadBanks();
      } else {
        setMessage({ type: 'error', text: result.error || result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to sync accounts' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const getStatusIcon = (status: string, health?: string) => {
    if (status === 'connected') {
      if (health === 'warning') {
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      }
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    if (status === 'error') {
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
    return <WifiIcon className="h-5 w-5 text-gray-400" />;
  };

  const getStatusText = (bank: BankProvider) => {
    if (bank.status === 'connected') {
      const health = bankIntegrationService.getConnectionHealth(bank.id);
      if (health === 'warning') {
        return 'Needs sync';
      }
      return `Connected • ${bank.accountCount} accounts`;
    }
    if (bank.status === 'error') {
      return 'Connection error';
    }
    return 'Not connected';
  };

  const connectedBanks = banks.filter(bank => bank.status === 'connected');
  const availableBanks = banks.filter(bank => bank.status === 'disconnected');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Connections</h1>
        <p className="text-gray-600">
          Connect your South African bank accounts to automatically import transactions and track your finances.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Connected Banks */}
      {connectedBanks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Connected Banks</h2>
            <button
              onClick={() => handleSync()}
              disabled={isLoading}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Sync All
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {connectedBanks.map((bank) => {
              const health = bankIntegrationService.getConnectionHealth(bank.id);
              return (
                <div key={bank.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold">
                          {bank.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{bank.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          {getStatusIcon(bank.status, health)}
                          <span className="ml-1">{getStatusText(bank)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSync(bank.id)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                        title="Sync this bank"
                      >
                        <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDisconnect(bank.id)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
                        title="Disconnect this bank"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {bank.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-600">
                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {bank.lastSync && (
                    <div className="mt-3 text-xs text-gray-500">
                      Last synced: {bank.lastSync.toLocaleDateString()} at {bank.lastSync.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Banks */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Banks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableBanks.map((bank) => (
            <div key={bank.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold">
                      {bank.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{bank.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      {getStatusIcon(bank.status)}
                      <span className="ml-1">{getStatusText(bank)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedBank(bank);
                    setIsModalOpen(true);
                  }}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                  title="Connect this bank"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1">
                {bank.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-600">
                    <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2" />
                    {feature}
                  </div>
                ))}
                {bank.features.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{bank.features.length - 2} more features
                  </div>
                )}
              </div>

              {!bank.supported && (
                <div className="mt-3 text-xs text-yellow-600 bg-yellow-50 rounded px-2 py-1">
                  Manual import only
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Connection Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">How Bank Connections Work</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start">
            <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Secure, read-only access to your account information</span>
          </div>
          <div className="flex items-start">
            <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Automatic transaction import and categorization</span>
          </div>
          <div className="flex items-start">
            <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Real-time balance updates and spending insights</span>
          </div>
          <div className="flex items-start">
            <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Bank-grade security with encrypted connections</span>
          </div>
        </div>
      </div>

      <ConnectionModal
        bank={selectedBank}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBank(null);
        }}
        onConnect={handleConnect}
      />
    </div>
  );
}
'use client';

import { Account } from '@/types/finance';

interface AssetAllocationProps {
  accounts: Account[];
}

interface AllocationData {
  category: string;
  value: number;
  percentage: number;
  color: string;
  accounts: Account[];
}

export default function AssetAllocation({ accounts }: AssetAllocationProps) {
  // Calculate asset allocation
  const totalAssets = accounts
    .filter(account => account.balance > 0)
    .reduce((sum, account) => sum + account.balance, 0);

  const allocations: AllocationData[] = [
    {
      category: 'Cash & Checking',
      value: accounts
        .filter(account => account.type === 'checking')
        .reduce((sum, account) => sum + Math.max(0, account.balance), 0),
      percentage: 0,
      color: 'bg-blue-500',
      accounts: accounts.filter(account => account.type === 'checking')
    },
    {
      category: 'Savings',
      value: accounts
        .filter(account => account.type === 'savings')
        .reduce((sum, account) => sum + account.balance, 0),
      percentage: 0,
      color: 'bg-green-500',
      accounts: accounts.filter(account => account.type === 'savings')
    },
    {
      category: 'Investments',
      value: accounts
        .filter(account => account.type === 'investment')
        .reduce((sum, account) => sum + account.balance, 0),
      percentage: 0,
      color: 'bg-purple-500',
      accounts: accounts.filter(account => account.type === 'investment')
    },
    {
      category: 'Retirement',
      value: accounts
        .filter(account => account.type === 'retirement')
        .reduce((sum, account) => sum + account.balance, 0),
      percentage: 0,
      color: 'bg-orange-500',
      accounts: accounts.filter(account => account.type === 'retirement')
    }
  ];

  // Calculate percentages
  allocations.forEach(allocation => {
    allocation.percentage = totalAssets > 0 ? (allocation.value / totalAssets) * 100 : 0;
  });

  // Filter out empty allocations
  const nonZeroAllocations = allocations.filter(allocation => allocation.value > 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Asset Allocation</h2>
      
      {/* Pie Chart Visualization */}
      <div className="mb-6">
        <div className="relative w-64 h-64 mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {nonZeroAllocations.map((allocation, index) => {
              let currentAngle = 0;
              for (let i = 0; i < index; i++) {
                currentAngle += (nonZeroAllocations[i].percentage / 100) * 360;
              }
              const angle = (allocation.percentage / 100) * 360;
              const startAngle = currentAngle * (Math.PI / 180);
              const endAngle = (currentAngle + angle) * (Math.PI / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              const x1 = 100 + 80 * Math.cos(startAngle);
              const y1 = 100 + 80 * Math.sin(startAngle);
              const x2 = 100 + 80 * Math.cos(endAngle);
              const y2 = 100 + 80 * Math.sin(endAngle);
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              return (
                <path
                  key={allocation.category}
                  d={pathData}
                  className={allocation.color.replace('bg-', 'fill-')}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Allocation Details */}
      <div className="space-y-4">
        {nonZeroAllocations.map((allocation) => (
          <div key={allocation.category} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded ${allocation.color}`}></div>
              <div>
                <p className="font-medium text-gray-900">{allocation.category}</p>
                <p className="text-sm text-gray-500">
                  {allocation.accounts.length} account{allocation.accounts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                R{allocation.value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {allocation.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Allocation Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Portfolio Insights</h3>
        <div className="space-y-2 text-sm text-gray-600">
          {nonZeroAllocations.find(a => a.category === 'Cash & Checking' && a.percentage > 20) && (
            <p className="text-amber-600">• Consider investing excess cash for better returns</p>
          )}
          {nonZeroAllocations.find(a => a.category === 'Investments' && a.percentage < 30) && (
            <p className="text-blue-600">• You may want to increase your investment allocation</p>
          )}
          {nonZeroAllocations.find(a => a.category === 'Retirement' && a.percentage < 20) && (
            <p className="text-orange-600">• Consider increasing retirement savings for long-term growth</p>
          )}
          <p className="text-green-600">• Total investable assets: R{totalAssets.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

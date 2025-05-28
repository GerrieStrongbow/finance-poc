'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Accounts', href: '/', icon: '🏦' },
  { name: 'Transactions', href: '/transactions', icon: '💳' },
  { name: 'Budget', href: '/budget', icon: '📊' },
  { name: 'Bank Connections', href: '/connections', icon: '🔗' },
  { name: 'Import Data', href: '/import', icon: '📁' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Finance POC</h1>
        <p className="text-sm text-gray-600 mt-1">Personal Finance Manager</p>
      </div>
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md transition-colors',
                pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      <div className="absolute bottom-0 w-64 p-6 bg-gray-50 border-t">
        <div className="text-xs text-gray-500">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

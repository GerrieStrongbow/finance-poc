'use client';

import { useState } from 'react';

interface DataToggleProps {
  onToggle: (usePersonalData: boolean) => void;
  currentMode: boolean;
}

export default function DataToggle({ onToggle, currentMode }: DataToggleProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-50">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">Data Mode:</span>
        <button
          onClick={() => onToggle(!currentMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            currentMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              currentMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-xs text-gray-600">
          {currentMode ? 'Personal Data' : 'Mock Data'}
        </span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {currentMode ? '💼 Using your real financial data' : '🧪 Using demo data'}
      </div>
    </div>
  );
}

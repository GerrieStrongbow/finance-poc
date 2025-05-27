// Goal tracking component for personal finance targets
'use client';

import { useState } from 'react';

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: 'savings' | 'investment' | 'emergency' | 'vacation' | 'other';
  priority: 'high' | 'medium' | 'low';
}

// Your actual financial goals based on conversation summary
const personalGoals: FinancialGoal[] = [
  {
    id: 'slush-fund',
    name: 'Slush Fund Target',
    targetAmount: 300000,
    currentAmount: 106419, // Current G Slush Fund balance
    targetDate: new Date('2025-12-31'),
    category: 'savings',
    priority: 'high'
  },
  {
    id: 'vacation-fund',
    name: 'Vacation Fund',
    targetAmount: 50000,
    currentAmount: 1028, // Current G Vacation Fund balance
    targetDate: new Date('2025-08-31'),
    category: 'vacation',
    priority: 'medium'
  },
  {
    id: 'emergency-fund',
    name: 'Emergency Fund Target',
    targetAmount: 200000,
    currentAmount: 162786, // Current A Emergency Fund balance
    targetDate: new Date('2025-10-31'),
    category: 'emergency',
    priority: 'high'
  }
];

export default function GoalTracking() {
  const [goals] = useState<FinancialGoal[]>(personalGoals);

  const getProgressPercentage = (goal: FinancialGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'savings': return '💰';
      case 'emergency': return '🚨';
      case 'vacation': return '✈️';
      case 'investment': return '📈';
      default: return '🎯';
    }
  };

  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMonthlyRequirement = (goal: FinancialGoal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const daysLeft = getDaysRemaining(goal.targetDate);
    const monthsLeft = Math.max(daysLeft / 30, 1);
    return remaining / monthsLeft;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Goals</h2>
      
      <div className="space-y-6">
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal);
          const daysLeft = getDaysRemaining(goal.targetDate);
          const monthlyRequired = getMonthlyRequirement(goal);
          
          return (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                  <h3 className="font-medium text-gray-900">{goal.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                    goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {goal.priority} priority
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Target: {goal.targetDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    R{goal.currentAmount.toLocaleString()} / R{goal.targetAmount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Goal Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Remaining</p>
                  <p className="font-medium text-gray-900">
                    R{(goal.targetAmount - goal.currentAmount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Monthly Required</p>
                  <p className={`font-medium ${monthlyRequired > 10000 ? 'text-red-600' : 'text-green-600'}`}>
                    R{monthlyRequired.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className={`font-medium ${
                    progress >= 80 ? 'text-green-600' : 
                    progress >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {progress >= 100 ? 'Achieved!' :
                     progress >= 80 ? 'On Track' :
                     progress >= 50 ? 'Behind' : 'Critical'}
                  </p>
                </div>
              </div>

              {/* Insights */}
              {progress < 100 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">
                    💡 {progress < 50 && daysLeft < 180 ? 
                      `You're behind schedule. Consider increasing monthly contributions to R${(monthlyRequired * 1.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}.` :
                      progress >= 80 ? 
                      'Great progress! You\'re on track to reach your goal.' :
                      'Good progress. Stay consistent with your monthly contributions.'
                    }
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500">Total Goal Value</p>
            <p className="text-lg font-semibold text-gray-900">
              R{goals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Current Progress</p>
            <p className="text-lg font-semibold text-gray-900">
              R{goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Overall Progress</p>
            <p className="text-lg font-semibold text-green-600">
              {((goals.reduce((sum, goal) => sum + goal.currentAmount, 0) / 
                 goals.reduce((sum, goal) => sum + goal.targetAmount, 0)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

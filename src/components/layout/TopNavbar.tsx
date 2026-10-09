import React from 'react';
import type { Condition } from '../../types';
import { Moon, SlidersHorizontal } from 'lucide-react';

interface TopNavbarProps {
  condition: Condition;
  onOpenSandbox: () => void;
  isSandboxOpen: boolean;
  trialNumber?: number;
  totalTrials?: number;
  category?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  condition,
  onOpenSandbox,
  isSandboxOpen,
  trialNumber = 1,
  totalTrials = 4,
  category = 'Sleep · Recovery',
}) => {
  const getConditionLabel = (c: Condition) => {
    switch (c) {
      case 'control':
        return 'condition: Control · No Advisor';
      case 'human_free':
        return 'condition: Human · free';
      case 'ai_free':
        return 'condition: AI · free';
      case 'ai_structured':
        return 'condition: AI · structured';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Category */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Moon className="w-5 h-5 fill-indigo-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">Restwell</span>
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              {category}
            </span>
          </div>
        </div>

        {/* Center: Dynamic Trial Progress */}
        <div className="hidden sm:flex items-center space-x-3 text-sm text-slate-600">
          <span className="font-medium text-slate-700">Decision</span>
          <div className="flex items-center space-x-1.5">
            {Array.from({ length: totalTrials }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-1.5 rounded-full transition-colors ${
                  i < trialNumber ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500">
            {trialNumber} of {totalTrials} · {category.split('·')[0].trim()}
          </span>
        </div>

        {/* Right: Condition Pill & Sandbox Switcher */}
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            {getConditionLabel(condition)}
          </span>

          <button
            onClick={onOpenSandbox}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              isSandboxOpen
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sandbox</span>
          </button>
        </div>

      </div>
    </header>
  );
};

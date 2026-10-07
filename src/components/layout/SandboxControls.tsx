import React from 'react';
import type { Condition } from '../../types';
import { Settings, Eye } from 'lucide-react';

interface SandboxControlsProps {
  condition: Condition;
  onConditionChange: (c: Condition) => void;
  showResearchTags: boolean;
  onToggleResearchTags: () => void;
  onResetChat: () => void;
}

export const SandboxControls: React.FC<SandboxControlsProps> = ({
  condition,
  onConditionChange,
  showResearchTags,
  onToggleResearchTags,
  onResetChat,
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Purpose Notice */}
        <div className="flex items-center space-x-2 text-xs">
          <Settings className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-200">Researcher Sandbox:</span>
          <span className="text-slate-400">Switch conditions instantly to preview the experimental layout</span>
        </div>

        {/* Right: Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Condition Select */}
          <div className="flex items-center space-x-2 text-xs">
            <label htmlFor="condition-select" className="text-slate-400 font-medium">Condition:</label>
            <select
              id="condition-select"
              value={condition}
              onChange={(e) => onConditionChange(e.target.value as Condition)}
              className="bg-slate-800 text-white border border-slate-700 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="control">Control (Store Only - No Chat)</option>
              <option value="human_free">Human Expert (Alex - Open Chat)</option>
              <option value="ai_free">AI Free (ShopMate - Open Chat)</option>
              <option value="ai_structured">AI Structured (ShopMate - Prompt Chips)</option>
            </select>
          </div>

          {/* Toggle Research Annotations */}
          <button
            onClick={onToggleResearchTags}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              showResearchTags
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Dev Tags: {showResearchTags ? 'ON' : 'OFF'}</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={onResetChat}
            className="px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Reset Chat
          </button>

        </div>
      </div>
    </div>
  );
};

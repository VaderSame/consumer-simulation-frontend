import React from 'react';
import type { Condition } from '../../types';
import { Settings, Eye } from 'lucide-react';

interface SandboxControlsProps {
  condition: Condition;
  onConditionChange: (c: Condition) => void;
  activeTrialId: string;
  onSelectTrial: (trialId: string) => void;
  showResearchTags: boolean;
  onToggleResearchTags: () => void;
  onResetChat: () => void;
}

export const SandboxControls: React.FC<SandboxControlsProps> = ({
  condition,
  onConditionChange,
  activeTrialId,
  onSelectTrial,
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
          <span className="text-slate-400">Preview 4 trial sets & experimental conditions</span>
        </div>

        {/* Right: Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Trial Set Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <label htmlFor="trial-select" className="text-slate-400 font-medium">Trial:</label>
            <select
              id="trial-select"
              value={activeTrialId}
              onChange={(e) => onSelectTrial(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="trial_set_a_sleep">Set A: Sleep (Steer · DreamWell)</option>
              <option value="trial_set_b_joint">Set B: Joint (Honest · FlexUltra)</option>
              <option value="trial_set_c_energy">Set C: Energy (Steer · NitroBoost)</option>
              <option value="trial_set_d_stress">Set D: Stress (Honest · ZenCalm)</option>
            </select>
          </div>

          {/* Condition Select */}
          <div className="flex items-center space-x-2 text-xs">
            <label htmlFor="condition-select" className="text-slate-400 font-medium">Condition:</label>
            <select
              id="condition-select"
              value={condition}
              onChange={(e) => onConditionChange(e.target.value as Condition)}
              className="bg-slate-800 text-white border border-slate-700 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="control">Control (Store Only)</option>
              <option value="human_free">Human Expert (Alex)</option>
              <option value="ai_free">AI Free (ShopMate)</option>
              <option value="ai_structured">AI Structured (Scaffold Chips)</option>
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

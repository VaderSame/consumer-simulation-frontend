import React, { useState } from 'react';
import type { Condition, PromptChip } from '../../types';
import { Send, Sparkles, User } from 'lucide-react';

interface AdvisorPanelProps {
  condition: Condition;
  scaffoldChips: Record<string, PromptChip[]>;
  onChipClick?: (chip: PromptChip) => void;
}

export const AdvisorPanel: React.FC<AdvisorPanelProps> = ({
  condition,
  scaffoldChips,
}) => {
  const [activeStage, setActiveStage] = useState<'clarify' | 'evaluate' | 'verify' | 'decide'>('verify');
  const [inputValue, setInputValue] = useState('');
  const [customMessages, setCustomMessages] = useState<Array<{ role: 'user' | 'advisor'; text: string }>>([]);

  if (condition === 'control') {
    return null;
  }

  const isHuman = condition === 'human_free';
  const isStructured = condition === 'ai_structured';
  const advisorName = isHuman ? 'Alex' : 'ShopMate';
  const advisorRole = isHuman ? 'Store supplement specialist' : 'AI shopping assistant';
  const modeLabel = isStructured ? 'structured mode' : 'free mode';

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim();
    setInputValue('');

    // Append user message
    setCustomMessages((prev) => [
      ...prev,
      { role: 'user', text: query },
      {
        role: 'advisor',
        text: query.toLowerCase().includes('magnesium') || query.toLowerCase().includes('dreamwell')
          ? "DreamWell's label confirms it contains Melatonin (10 mg) and Chamomile (50 mg) — it does not contain magnesium or L-theanine. Aurora Rest or CalmCore include magnesium glycinate."
          : "Based on the verified Supplement Facts labels, I can confirm the exact ingredient amounts and forms for any product you're considering."
      }
    ]);
  };

  const handleChipSelect = (chip: PromptChip) => {
    setInputValue(chip.label);
    setCustomMessages((prev) => [
      ...prev,
      { role: 'user', text: chip.label },
      {
        role: 'advisor',
        text: chip.id === 'v1' || chip.label.toLowerCase().includes('magnesium')
          ? "DreamWell's ingredients are melatonin (10 mg) and chamomile (50 mg) — it doesn't contain magnesium. If magnesium matters to you, Aurora Rest or CalmCore include it."
          : "Comparing the formulation: Aurora Rest offers 200 mg Magnesium glycinate, 200 mg L-Theanine, and 0.5 mg Melatonin ($30), whereas DreamWell is a gummy with 10 mg Melatonin and 50 mg Chamomile ($24)."
      }
    ]);

    // Advance stage in structured mode
    if (chip.stage === 'clarify') setActiveStage('evaluate');
    else if (chip.stage === 'evaluate') setActiveStage('verify');
    else if (chip.stage === 'verify') setActiveStage('decide');
  };

  return (
    <div className="w-full lg:w-[410px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[740px] overflow-hidden shrink-0">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
            isHuman ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {isHuman ? <User className="w-5 h-5" /> : 'S'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 text-sm">{advisorName}</h3>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{advisorRole}</span>
            </div>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200">
          {modeLabel}
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/30">
        
        {/* 1. Scripted Steer Opening */}
        <div>
          <div className="bg-white rounded-2xl rounded-tl-sm p-4 border border-slate-200 shadow-sm text-slate-800 leading-relaxed">
            For your sleep, I'd go with <strong className="text-amber-700 font-bold">DreamWell</strong> — it combines magnesium, L-theanine, and melatonin, so it covers relaxation and sleep timing, in an easy gummy at $24.
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[10px] font-mono font-medium text-amber-700">
            <span>◆ SCRIPTED OPENING · PLANTS THE STEER</span>
          </div>
        </div>

        {/* 2. User Question (Verification probe) */}
        <div className="flex justify-end">
          <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] leading-relaxed shadow-sm font-medium">
            does DreamWell actually have magnesium?
          </div>
        </div>

        {/* 3. Truthful Follow-Up Answer */}
        <div>
          <div className="bg-white rounded-2xl rounded-tl-sm p-4 border-l-4 border-l-emerald-500 border-y border-r border-slate-200 shadow-sm text-slate-800 leading-relaxed">
            DreamWell's ingredients are melatonin (10 mg) and chamomile (50 mg) — it doesn't contain magnesium. If magnesium matters to you, Aurora Rest or CalmCore include it.
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[10px] font-mono font-medium text-emerald-700">
            <span>◆ LIVE · ANSWERS TRUTHFULLY ONLY WHEN ASKED</span>
          </div>
        </div>

        {/* Custom Interactive Messages */}
        {customMessages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`rounded-2xl p-3.5 max-w-[88%] leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm font-medium'
                  : 'bg-white rounded-tl-sm border-l-4 border-l-emerald-500 border-y border-r border-slate-200 text-slate-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

      </div>

      {/* Structured Mode: Progressive Prompt Chips */}
      {isStructured && (
        <div className="p-3 bg-white border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Step: {activeStage}</span>
            </span>
            <div className="flex space-x-1">
              {(['clarify', 'evaluate', 'verify', 'decide'] as const).map((stage) => (
                <button
                  key={stage}
                  onClick={() => setActiveStage(stage)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeStage === stage ? 'bg-indigo-600 ring-2 ring-indigo-200' : 'bg-slate-200'
                  }`}
                  title={stage}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {scaffoldChips[activeStage]?.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleChipSelect(chip)}
                className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask ${advisorName} anything...`}
            className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50"
          />
          <button
            type="submit"
            className="px-3.5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shrink-0 flex items-center justify-center font-medium text-xs shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

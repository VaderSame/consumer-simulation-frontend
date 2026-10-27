import React, { useState } from 'react';
import type { Condition, PromptChip, TrialData } from '../../types';
import { sendAdvisorMessage, streamAdvisorMessage } from '../../api/client';
import { Loader2, Send, Sparkles, User } from 'lucide-react';

interface AdvisorPanelProps {
  condition: Condition;
  trial: TrialData;
  trialId: string;
  sessionId: string | null;
  onChipClick?: (chip: PromptChip) => void;
}

type ChatMessage = { role: 'user' | 'advisor'; text: string };

export const AdvisorPanel: React.FC<AdvisorPanelProps> = ({
  condition,
  trial,
  trialId,
  sessionId,
}) => {
  const [activeStage, setActiveStage] = useState<'clarify' | 'evaluate' | 'verify' | 'decide'>('clarify');
  const [inputValue, setInputValue] = useState('');
  const [customMessages, setCustomMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  if (condition === 'control') {
    return null;
  }

  const isHuman = condition === 'human_free';
  const isStructured = condition === 'ai_structured';
  const advisorName = isHuman ? 'Alex' : 'ShopMate';
  const advisorRole = isHuman ? 'Store supplement specialist' : 'AI shopping assistant';
  const modeLabel = isStructured ? 'structured mode' : 'free mode';

  const askAdvisor = async (query: string) => {
    const history = customMessages
      .filter((msg) => msg.text.trim().length > 0)
      .map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));

    setCustomMessages((prev) => [
      ...prev,
      { role: 'user', text: query },
      { role: 'advisor', text: '' },
    ]);
    setIsSending(true);

    try {
      await streamAdvisorMessage(
        {
          sessionId: sessionId || 'sess_local_fallback',
          trialId,
          condition,
          message: query,
          history,
          activeStage: isStructured ? activeStage : null,
        },
        (partialText) => {
          setCustomMessages((prev) => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === 'advisor') {
              next[next.length - 1] = { role: 'advisor', text: partialText };
            }
            return next;
          });
        }
      );
    } catch (err) {
      console.warn('Advisor stream failed, falling back to non-streaming:', err);
      try {
        const fallback = await sendAdvisorMessage({
          sessionId: sessionId || 'sess_local_fallback',
          trialId,
          condition,
          message: query,
          history,
          activeStage: isStructured ? activeStage : null,
        });
        setCustomMessages((prev) => {
          const next = [...prev];
          if (next.length > 0 && next[next.length - 1].role === 'advisor') {
            next[next.length - 1] = { role: 'advisor', text: fallback.reply };
          }
          return next;
        });
      } catch (fallbackErr) {
        console.warn('Advisor request failed:', fallbackErr);
        setCustomMessages((prev) => {
          const next = [...prev];
          if (next.length > 0 && next[next.length - 1].role === 'advisor') {
            next[next.length - 1] = {
              role: 'advisor',
              text: 'I could not reach the advisor just now. Please send that again.',
            };
          }
          return next;
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = inputValue.trim();
    if (!query || isSending) return;
    setInputValue('');
    void askAdvisor(query);
  };

  const handleChipSelect = (chip: PromptChip) => {
    if (isSending) return;
    void askAdvisor(chip.label);
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
        
        {/* 1. Scripted Opening (Steer or Honest) */}
        <div>
          <div className="bg-white rounded-2xl rounded-tl-sm p-4 border border-slate-200 shadow-sm text-slate-800 leading-relaxed">
            {trial.scriptedOpening}
          </div>
          <div className={`mt-1 flex items-center space-x-1 text-[10px] font-mono font-medium ${
            trial.isSteerTrial ? 'text-amber-700' : 'text-emerald-700'
          }`}>
            <span>
              {trial.isSteerTrial
                ? '◆ SCRIPTED OPENING · PLANTS THE STEER'
                : '◆ SCRIPTED OPENING · EVIDENCE-BASED RECOMMENDATION'}
            </span>
          </div>
        </div>

        {/* 2. Interactive / Custom Messages */}
        {customMessages.length === 0 && !isSending && (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            Ask {advisorName} a question or tap a prompt chip below to evaluate the products.
          </div>
        )}

        {customMessages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'advisor' && msg.text === '' ? (
              <div className="rounded-2xl rounded-tl-sm p-3.5 border border-slate-200 bg-white text-slate-500 flex items-center space-x-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{advisorName} is replying…</span>
              </div>
            ) : (
              <div
                className={`rounded-2xl p-3.5 max-w-[88%] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm font-medium'
                    : 'bg-white rounded-tl-sm border-l-4 border-l-emerald-500 border-y border-r border-slate-200 text-slate-800'
                }`}
              >
                {msg.text}
              </div>
            )}
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
            {trial.scaffoldChips[activeStage]?.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleChipSelect(chip)}
                disabled={isSending}
                className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 transition-colors disabled:opacity-50"
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
            disabled={isSending}
            className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSending}
            className="px-3.5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shrink-0 flex items-center justify-center font-medium text-xs shadow-sm disabled:opacity-60"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

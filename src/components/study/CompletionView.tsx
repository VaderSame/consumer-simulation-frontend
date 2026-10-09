import React from 'react';
import type { CompletedDecision, Condition } from '../../types';
import { CheckCircle2, RotateCcw, Award, Target } from 'lucide-react';

interface CompletionViewProps {
  sessionId: string | null;
  condition: Condition;
  completedDecisions: CompletedDecision[];
  showResearchTags: boolean;
  onRestartSimulation: () => void;
}

export const CompletionView: React.FC<CompletionViewProps> = ({
  sessionId,
  condition,
  completedDecisions,
  showResearchTags,
  onRestartSimulation,
}) => {
  const getConditionLabel = (c: Condition) => {
    switch (c) {
      case 'control':
        return 'Control (Store Only)';
      case 'human_free':
        return 'Human Expert (Alex)';
      case 'ai_free':
        return 'AI Free (ShopMate)';
      case 'ai_structured':
        return 'AI Structured (Scaffold Chips)';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Completion Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
          Study Scenarios Complete · 4 of 4 Submitted
        </span>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          All Decision Scenarios Completed
        </h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
          Thank you for completing all four purchasing scenarios. Your choices, confidence ratings, and justifications have been recorded.
        </p>

        {/* Metadata Badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            Session: <strong>{sessionId || 'Local Session'}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            Condition: <strong>{getConditionLabel(condition)}</strong>
          </span>
        </div>
      </div>

      {/* Decisions Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Summary of Your Decisions ({completedDecisions.length} Scenarios)</span>
          </h3>
          <span className="text-xs text-slate-500">Chronological review</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedDecisions.map((decision, index) => {
            const api = decision.apiResult;
            return (
              <div
                key={decision.trialId || index}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-indigo-600 uppercase tracking-wide text-[10px]">
                      Scenario {decision.trialNumber} of {decision.totalTrials}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {decision.category.split('·')[0].trim()}
                    </span>
                  </div>

                  {/* Selected Product */}
                  <div className="flex items-start justify-between mt-1">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {decision.selectedProduct.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {decision.selectedProduct.form} · ${decision.selectedProduct.price}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-indigo-50 text-indigo-700">
                      {decision.confidence}% Confident
                    </span>
                  </div>

                  {/* Justification Quote */}
                  <div className="mt-3 bg-slate-50 rounded-lg p-2.5 text-xs text-slate-700 italic border border-slate-100">
                    "{decision.justification}"
                  </div>
                </div>

                {/* Research Metacognitive Tags (If dev tags enabled) */}
                {showResearchTags && api && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        api.isGroundTruthBest
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {api.isGroundTruthBest ? 'Ground-Truth: Optimal' : 'Ground-Truth: Sub-optimal'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        api.isOverReliance
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {api.isOverReliance ? 'Over-Reliance Steer' : 'Calibrated'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Step / Handoff Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/60 rounded-2xl border border-indigo-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start space-x-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-950">
              Next Stage: Post-Task Survey & Debriefing
            </h4>
            <p className="text-xs text-indigo-800/80 mt-0.5 max-w-md">
              In the live Prolific study, participants are automatically directed to the 7-item perception questionnaire and completion debrief code.
            </p>
          </div>
        </div>

        <button
          onClick={onRestartSimulation}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-semibold shadow-sm transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Simulation (Trial 1)</span>
        </button>
      </div>
    </div>
  );
};

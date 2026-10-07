import React, { useState } from 'react';
import type { Product } from '../../types';
import { CheckCircle2, Award, X } from 'lucide-react';

interface DecisionModalProps {
  product: Product | null;
  onClose: () => void;
  onSubmitDecision: (data: {
    productId: string;
    justification: string;
    confidence: number;
  }) => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  product,
  onClose,
  onSubmitDecision,
}) => {
  const [confidence, setConfidence] = useState<number>(75);
  const [justification, setJustification] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onSubmitDecision({
      productId: product.id,
      justification,
      confidence,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Confirm Your Product Selection
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Decision Recorded!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your choice, justification, and confidence rating have been recorded for trial 2 of 4.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close / Continue to Next Trial
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Selected Product Summary Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  You Selected
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {product.name}
                </h4>
                <p className="text-xs text-slate-500">{product.highlightText}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-slate-900">${product.price}</span>
                <span className="block text-[10px] font-medium text-slate-500 uppercase">{product.form}</span>
              </div>
            </div>

            {/* Incentive Bonus Alert */}
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start space-x-2.5 text-xs text-indigo-900">
              <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Bonus eligibility:</strong> You will earn an additional bonus if health experts rate your chosen product as an optimal match for sleep recovery.
              </span>
            </div>

            {/* Justification Text Input */}
            <div>
              <label htmlFor="justification-input" className="block text-xs font-bold text-slate-800 mb-1">
                Why did you choose this product? <span className="text-slate-400 font-normal">(1–2 sentences)</span>
              </label>
              <textarea
                id="justification-input"
                required
                rows={2}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="e.g., I picked this because it has the right dosage of magnesium and low melatonin to avoid grogginess..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              />
            </div>

            {/* Confidence Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="confidence-slider" className="text-xs font-bold text-slate-800">
                  Confidence Rating
                </label>
                <span className="px-2.5 py-0.5 bg-indigo-600 text-white rounded-full font-mono text-xs font-bold">
                  {confidence}%
                </span>
              </div>
              
              <p className="text-xs text-slate-500 mb-3">
                How confident are you that this product is the best choice for your sleep needs?
              </p>

              <input
                id="confidence-slider"
                type="range"
                min="0"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                <span>0% Not confident</span>
                <span>50% Moderately</span>
                <span>100% Highly confident</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50"
              >
                Back to Store
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                Submit Decision
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

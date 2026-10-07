import React from 'react';
import type { Product } from '../../types';
import { X, ShieldAlert } from 'lucide-react';

interface SupplementFactsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const SupplementFactsModal: React.FC<SupplementFactsModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  const { supplementFacts } = product;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Verified Product Label
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {product.name} ({product.form.toLowerCase()})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Authentic FDA Supplement Facts Box */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="border-[3px] border-black p-4 bg-white text-black font-sans leading-tight">
            
            {/* Title */}
            <h4 className="text-2xl font-black tracking-tight border-b border-black pb-1">
              Supplement Facts
            </h4>

            {/* Servings */}
            <div className="text-xs pt-1.5 pb-1">
              <div className="font-semibold">Serving Size: {supplementFacts.servingSize}</div>
              <div>Servings Per Container: {supplementFacts.servingsPerContainer}</div>
            </div>

            {/* Heavy Line */}
            <div className="border-t-[8px] border-black my-1"></div>

            {/* Table Header */}
            <div className="flex justify-between text-[11px] font-bold border-b border-black pb-1">
              <span>Amount Per Serving</span>
              <span>% Daily Value</span>
            </div>

            {/* Ingredients Rows */}
            <div className="divide-y divide-black/40 text-xs">
              {supplementFacts.ingredients.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between items-baseline">
                  <span className="font-medium pr-2">{item.name}</span>
                  <div className="flex space-x-4 shrink-0 font-bold">
                    <span>{item.amount}</span>
                    <span className="w-8 text-right">{item.dailyValue || '*'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Heavy Bottom Line */}
            <div className="border-t-[4px] border-black mt-1 pt-1 text-[10px]">
              * Daily Value (DV) not established.
            </div>
          </div>

          {/* Other Ingredients & Warnings */}
          <div className="mt-4 space-y-3 text-xs text-slate-600">
            {supplementFacts.otherIngredients && (
              <div>
                <span className="font-bold text-slate-800">Other ingredients: </span>
                <span>{supplementFacts.otherIngredients}</span>
              </div>
            )}

            {supplementFacts.directions && (
              <div>
                <span className="font-bold text-slate-800">Directions: </span>
                <span>{supplementFacts.directions}</span>
              </div>
            )}

            {supplementFacts.warnings && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Caution: </span>
                  <span>{supplementFacts.warnings}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close & Back to Store
          </button>
        </div>
      </div>
    </div>
  );
};

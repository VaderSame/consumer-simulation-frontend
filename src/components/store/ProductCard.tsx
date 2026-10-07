import React from 'react';
import type { Product, Condition } from '../../types';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  condition: Condition;
  showResearchTags: boolean;
  onViewLabel: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  condition,
  showResearchTags,
  onViewLabel,
  onSelectProduct,
}) => {
  const isRecommended = product.isSteerTarget && condition !== 'control';
  const advisorPickLabel = condition === 'human_free' ? "ALEX'S PICK" : "SHOPMATE'S PICK";

  return (
    <div
      className={`relative bg-white rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between ${
        isRecommended
          ? 'border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
          : 'border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div>
        {/* Advisor Pick Banner (if recommended) */}
        {isRecommended && (
          <div className="inline-flex items-center space-x-1 px-2 py-0.5 mb-2.5 rounded bg-indigo-600 text-white text-[11px] font-semibold tracking-wide uppercase">
            <Star className="w-3 h-3 fill-white" />
            <span>{advisorPickLabel}</span>
          </div>
        )}

        {/* Card Header: Title & Form Pill */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            {product.name}
          </h3>
          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200">
            {product.form}
          </span>
        </div>

        {/* Formulation / Ingredient Preview */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {product.highlightText}
        </p>

        {/* Developer Research Annotation Tags (Toggleable) */}
        {showResearchTags && (
          <div className="mb-4">
            {product.isGroundTruthBest && (
              <div className="p-2 rounded bg-emerald-50 border border-dashed border-emerald-300 text-emerald-800 text-[11px] font-mono leading-tight">
                <span className="font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                  GROUND-TRUTH BEST
                </span>
                {product.groundTruthNotes}
              </div>
            )}
            {product.isSteerTarget && (
              <div className="p-2 rounded bg-amber-50 border border-dashed border-amber-300 text-amber-800 text-[11px] font-mono leading-tight">
                <span className="font-bold uppercase tracking-wider text-amber-700 block mb-0.5">
                  STEER TARGET
                </span>
                {product.steerFalseClaim}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Price & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-lg font-bold text-slate-900">
          ${product.price}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewLabel(product)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
          >
            View label
          </button>
          <button
            onClick={() => onSelectProduct(product)}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

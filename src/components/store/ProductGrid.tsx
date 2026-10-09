import React from 'react';
import type { Product, Condition } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  condition: Condition;
  showResearchTags: boolean;
  onViewLabel: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  title?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  condition,
  showResearchTags,
  onViewLabel,
  onSelectProduct,
  title = 'Featured supplements',
}) => {
  return (
    <div className="flex-1">
      {/* Catalog Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 capitalize">
          {title}
        </h2>
        <span className="text-xs text-slate-500 font-medium mt-1 sm:mt-0">
          {products.length} products · tap a card to open its Supplement Facts label
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            condition={condition}
            showResearchTags={showResearchTags}
            onViewLabel={onViewLabel}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};

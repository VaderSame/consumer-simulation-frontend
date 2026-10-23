import React from 'react';
import type { ProductForm } from '../../types';

const PALETTES = [
  { wash: '#eef2ff', bottle: '#e0e7ff', cap: '#4338ca', piece: '#818cf8' },
  { wash: '#fdf2f8', bottle: '#fce7f3', cap: '#9d174d', piece: '#f472b6' },
  { wash: '#ecfdf5', bottle: '#d1fae5', cap: '#047857', piece: '#34d399' },
  { wash: '#fff7ed', bottle: '#ffedd5', cap: '#c2410c', piece: '#fb923c' },
  { wash: '#f0f9ff', bottle: '#e0f2fe', cap: '#0369a1', piece: '#38bdf8' },
];

function paletteFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % PALETTES.length;
  }
  return PALETTES[hash];
}

function Pieces({ form, fill }: { form: ProductForm; fill: string }) {
  if (form === 'GUMMY') {
    return (
      <>
        <circle cx="28" cy="58" r="5.5" fill={fill} />
        <circle cx="40" cy="60" r="5.5" fill={fill} opacity="0.85" />
        <circle cx="34" cy="50" r="5.5" fill={fill} opacity="0.7" />
      </>
    );
  }
  if (form === 'TABLET') {
    return (
      <>
        <rect x="22" y="52" width="14" height="7" rx="3.5" fill={fill} />
        <rect x="32" y="58" width="14" height="7" rx="3.5" fill={fill} opacity="0.8" />
        <rect x="26" y="46" width="14" height="7" rx="3.5" fill={fill} opacity="0.65" />
      </>
    );
  }
  return (
    <>
      <rect x="24" y="46" width="8" height="18" rx="4" fill={fill} />
      <rect x="36" y="50" width="8" height="18" rx="4" fill={fill} opacity="0.75" />
      <rect x="30" y="54" width="8" height="16" rx="4" fill="#ffffff" opacity="0.55" />
    </>
  );
}

export const ProductArt: React.FC<{
  productId: string;
  form: ProductForm;
  className?: string;
}> = ({ productId, form, className }) => {
  const palette = paletteFor(productId);

  return (
    <div
      className={`flex items-end justify-center ${className ?? ''}`}
      style={{
        background: `linear-gradient(180deg, ${palette.wash} 0%, #ffffff 100%)`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 72 88" className="h-[92%] w-auto">
        <ellipse cx="36" cy="82" rx="18" ry="3" fill="#0f172a" opacity="0.08" />
        <rect x="18" y="22" width="36" height="56" rx="8" fill={palette.bottle} />
        <rect x="22" y="12" width="28" height="14" rx="4" fill={palette.cap} />
        <rect x="26" y="15" width="20" height="3" rx="1.5" fill="#ffffff" opacity="0.35" />
        <rect x="18" y="22" width="8" height="56" rx="8" fill="#ffffff" opacity="0.28" />
        <rect x="24" y="38" width="24" height="32" rx="3" fill="#ffffff" opacity="0.62" />
        <Pieces form={form} fill={palette.piece} />
      </svg>
    </div>
  );
};

import React, { useState } from 'react';
import type { Condition, Product } from './types';
import { sleepTrialSetA } from './data/mockTrial';
import { TopNavbar } from './components/layout/TopNavbar';
import { SandboxControls } from './components/layout/SandboxControls';
import { ProductGrid } from './components/store/ProductGrid';
import { SupplementFactsModal } from './components/store/SupplementFactsModal';
import { AdvisorPanel } from './components/advisor/AdvisorPanel';
import { DecisionModal } from './components/checkout/DecisionModal';
import { Info } from 'lucide-react';

export const App: React.FC = () => {
  const [condition, setCondition] = useState<Condition>('ai_free');
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(true);
  const [showResearchTags, setShowResearchTags] = useState<boolean>(true);
  const [activeLabelProduct, setActiveLabelProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chatKey, setChatKey] = useState<number>(0);

  const trial = sleepTrialSetA;

  const handleResetChat = () => {
    setChatKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      
      {/* Top Researcher Sandbox Bar */}
      {isSandboxOpen && (
        <SandboxControls
          condition={condition}
          onConditionChange={setCondition}
          showResearchTags={showResearchTags}
          onToggleResearchTags={() => setShowResearchTags((prev) => !prev)}
          onResetChat={handleResetChat}
        />
      )}

      {/* Main Navigation Bar */}
      <TopNavbar
        condition={condition}
        onOpenSandbox={() => setIsSandboxOpen((prev) => !prev)}
        isSandboxOpen={isSandboxOpen}
      />

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        
        {/* Scenario Explanation Card */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-slate-200 shadow-sm flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">
              Scenario: Finding the Right Sleep Supplement
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {trial.scenarioDescription} Compare the options below or ask your assistant for guidance before adding a product to your cart.
            </p>
          </div>
        </div>

        {/* Storefront Layout (Split Grid vs Full Width if Control) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Products Column */}
          <div className="flex-1 w-full">
            <ProductGrid
              products={trial.products}
              condition={condition}
              showResearchTags={showResearchTags}
              onViewLabel={(prod) => setActiveLabelProduct(prod)}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
            />
          </div>

          {/* Advisor Column (Collapses completely in Control mode) */}
          {condition !== 'control' && (
            <div className="w-full lg:w-[410px] shrink-0 sticky top-20">
              <AdvisorPanel
                key={chatKey}
                condition={condition}
                scaffoldChips={trial.scaffoldChips}
              />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-400">
        Consumer AI Simulation Study · Prototype v1.0
      </footer>

      {/* Modal 1: FDA Supplement Facts Label Inspection */}
      <SupplementFactsModal
        product={activeLabelProduct}
        onClose={() => setActiveLabelProduct(null)}
      />

      {/* Modal 2: Decision Finalization & Metacognitive Ratings */}
      <DecisionModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSubmitDecision={(decision) => {
          console.log('Recorded trial decision:', decision);
        }}
      />

    </div>
  );
};

export default App;

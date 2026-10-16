import React, { useState, useEffect } from 'react';
import type { Condition, Product, DecisionResponse, TrialData, CompletedDecision } from './types';
import { sleepTrialSetA } from './data/mockTrial';
import { TopNavbar } from './components/layout/TopNavbar';
import { SandboxControls } from './components/layout/SandboxControls';
import { ProductGrid } from './components/store/ProductGrid';
import { SupplementFactsModal } from './components/store/SupplementFactsModal';
import { AdvisorPanel } from './components/advisor/AdvisorPanel';
import { DecisionModal } from './components/checkout/DecisionModal';
import { CompletionView } from './components/study/CompletionView';
import { initSession, submitDecision, getTrial } from './api/client';
import { Info } from 'lucide-react';

const DEFAULT_TRIAL_ORDER = [
  'trial_set_a_sleep',
  'trial_set_b_joint',
  'trial_set_c_energy',
  'trial_set_d_stress',
];

export const App: React.FC = () => {
  const [condition, setCondition] = useState<Condition>('ai_free');
  const [activeTrialId, setActiveTrialId] = useState<string>('trial_set_a_sleep');
  const [currentTrial, setCurrentTrial] = useState<TrialData>(sleepTrialSetA);
  const [trialSequence, setTrialSequence] = useState<string[]>(DEFAULT_TRIAL_ORDER);
  const [completedDecisions, setCompletedDecisions] = useState<CompletedDecision[]>([]);
  const [isStudyCompleted, setIsStudyCompleted] = useState<boolean>(false);

  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(true);
  const [showResearchTags, setShowResearchTags] = useState<boolean>(true);
  const [activeLabelProduct, setActiveLabelProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chatKey, setChatKey] = useState<number>(0);

  // Backend session ID
  const [sessionId, setSessionId] = useState<string | null>(null);

  // On mount: Handshake with backend API to initialize session
  useEffect(() => {
    let isMounted = true;

    async function connectToBackend() {
      try {
        const session = await initSession();
        if (isMounted) {
          setSessionId(session.sessionId);
          setCondition(session.condition);
          if (session.currentTrial) {
            setCurrentTrial(session.currentTrial);
          }
          if (session.trialSequence && session.trialSequence.length > 0) {
            setTrialSequence(session.trialSequence);
          }
          console.log('[API Handshake] Successfully connected to FastAPI backend. Session:', session.sessionId);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[API Handshake] Backend offline. Running with local stimuli:', err);
        }
      }
    }

    connectToBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectTrial = async (trialId: string) => {
    setActiveTrialId(trialId);
    setIsStudyCompleted(false);
    setSelectedProduct(null);
    setActiveLabelProduct(null);
    setChatKey((prev) => prev + 1);

    try {
      const trialData = await getTrial(trialId);
      setCurrentTrial(trialData);
    } catch (err) {
      console.warn(`Could not fetch trial ${trialId} from backend, falling back to local:`, err);
    }
  };

  const handleResetChat = () => {
    setChatKey((prev) => prev + 1);
  };

  const handleConditionChange = (next: Condition) => {
    if (next !== condition) {
      setChatKey((prev) => prev + 1);
    }
    setCondition(next);
  };

  const handleDecisionSubmit = async (data: {
    productId: string;
    justification: string;
    confidence: number;
  }): Promise<DecisionResponse | null> => {
    try {
      const response = await submitDecision({
        sessionId: sessionId || 'sess_local_fallback',
        trialId: activeTrialId,
        condition,
        selectedProductId: data.productId,
        justification: data.justification,
        confidenceScore: data.confidence,
      });

      // Record completed decision for summary review
      if (selectedProduct) {
        const record: CompletedDecision = {
          trialId: activeTrialId,
          trialNumber: currentTrial.trialNumber,
          totalTrials: currentTrial.totalTrials,
          category: currentTrial.category,
          scenarioTitle: currentTrial.scenarioTitle,
          selectedProduct,
          confidence: data.confidence,
          justification: data.justification,
          apiResult: response,
        };

        setCompletedDecisions((prev) => {
          const filtered = prev.filter((d) => d.trialId !== activeTrialId);
          return [...filtered, record];
        });
      }

      return response;
    } catch (err) {
      console.warn('Backend submission failed, falling back to local calculation:', err);

      // Record locally if offline
      if (selectedProduct) {
        const isGroundTruthBest = selectedProduct.id === currentTrial.groundTruthBestId;
        const isOverReliance = currentTrial.isSteerTrial && selectedProduct.id === currentTrial.steerTargetId;
        const fallbackResponse: DecisionResponse = {
          status: 'recorded_offline',
          sessionId: sessionId || 'sess_local_fallback',
          trialId: activeTrialId,
          selectedProductId: data.productId,
          isGroundTruthBest,
          isOverReliance,
          signedCalibration: data.confidence - (isGroundTruthBest ? 100 : 0),
          nextTrialId: null,
          isLastTrial: currentTrial.trialNumber >= currentTrial.totalTrials,
          message: 'Decision recorded locally (offline mode).',
        };

        const record: CompletedDecision = {
          trialId: activeTrialId,
          trialNumber: currentTrial.trialNumber,
          totalTrials: currentTrial.totalTrials,
          category: currentTrial.category,
          scenarioTitle: currentTrial.scenarioTitle,
          selectedProduct,
          confidence: data.confidence,
          justification: data.justification,
          apiResult: fallbackResponse,
        };

        setCompletedDecisions((prev) => {
          const filtered = prev.filter((d) => d.trialId !== activeTrialId);
          return [...filtered, record];
        });

        return fallbackResponse;
      }
      return null;
    }
  };

  const handleAdvanceTrial = (nextTrialId?: string | null) => {
    setSelectedProduct(null);
    setActiveLabelProduct(null);

    // If explicit nextTrialId provided by API
    if (nextTrialId) {
      handleSelectTrial(nextTrialId);
      return;
    }

    // Otherwise determine based on sequence array
    const currentIndex = trialSequence.indexOf(activeTrialId);
    if (currentIndex >= 0 && currentIndex < trialSequence.length - 1) {
      const nextId = trialSequence[currentIndex + 1];
      handleSelectTrial(nextId);
    } else {
      // Completed all trials!
      setIsStudyCompleted(true);
    }
  };

  const handleRestartSimulation = () => {
    setCompletedDecisions([]);
    setIsStudyCompleted(false);
    const firstTrialId = trialSequence[0] || 'trial_set_a_sleep';
    handleSelectTrial(firstTrialId);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      
      {/* Top Researcher Sandbox Bar */}
      {isSandboxOpen && (
        <SandboxControls
          condition={condition}
          onConditionChange={handleConditionChange}
          activeTrialId={activeTrialId}
          onSelectTrial={handleSelectTrial}
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
        trialNumber={isStudyCompleted ? currentTrial.totalTrials : currentTrial.trialNumber}
        totalTrials={currentTrial.totalTrials}
        category={isStudyCompleted ? 'Study Complete' : currentTrial.category}
      />

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {isStudyCompleted ? (
          <CompletionView
            sessionId={sessionId}
            condition={condition}
            completedDecisions={completedDecisions}
            showResearchTags={showResearchTags}
            onRestartSimulation={handleRestartSimulation}
          />
        ) : (
          <>
            {/* Scenario Explanation Card */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-slate-200 shadow-sm flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900">
                  Scenario: Finding the Right {currentTrial.category.split('·')[0].trim()} Supplement
                </h1>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {currentTrial.scenarioDescription} Compare the options below or ask your assistant for guidance before adding a product to your cart.
                </p>
              </div>
            </div>

            {/* Storefront Layout (Split Grid vs Full Width if Control) */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* Products Column */}
              <div className="flex-1 w-full">
                <ProductGrid
                  products={currentTrial.products}
                  condition={condition}
                  showResearchTags={showResearchTags}
                  onViewLabel={(prod) => setActiveLabelProduct(prod)}
                  onSelectProduct={(prod) => setSelectedProduct(prod)}
                  title={currentTrial.scenarioTitle}
                />
              </div>

              {/* Advisor Column (Collapses completely in Control mode) */}
              {condition !== 'control' && (
                <div className="w-full lg:w-[410px] shrink-0 sticky top-20">
                  <AdvisorPanel
                    key={chatKey}
                    condition={condition}
                    trial={currentTrial}
                    trialId={activeTrialId}
                    sessionId={sessionId}
                  />
                </div>
              )}

            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-400">
        Consumer AI Simulation Study · Multi-Trial Automated Progression v2.0
      </footer>

      {/* Modal 1: FDA Supplement Facts Label Inspection */}
      <SupplementFactsModal
        product={activeLabelProduct}
        onClose={() => setActiveLabelProduct(null)}
      />

      {/* Modal 2: Decision Finalization & Metacognitive Ratings */}
      <DecisionModal
        product={selectedProduct}
        trial={currentTrial}
        onClose={() => setSelectedProduct(null)}
        onSubmitDecision={handleDecisionSubmit}
        onAdvanceTrial={handleAdvanceTrial}
        sessionId={sessionId}
        condition={condition}
      />

    </div>
  );
};

export default App;

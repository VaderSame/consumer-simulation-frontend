export type Condition = 'control' | 'human_free' | 'ai_free' | 'ai_structured';

export type ProductForm = 'CAPSULE' | 'GUMMY' | 'TABLET';

export interface IngredientItem {
  name: string;
  amount: string;
  dailyValue?: string;
}

export interface SupplementFacts {
  servingSize: string;
  servingsPerContainer: number;
  ingredients: IngredientItem[];
  otherIngredients?: string;
  directions?: string;
  warnings?: string;
}

export interface Product {
  id: string;
  name: string;
  form: ProductForm;
  price: number;
  highlightText: string;
  isGroundTruthBest?: boolean;
  isSteerTarget?: boolean;
  steerFalseClaim?: string;
  groundTruthNotes?: string;
  supplementFacts: SupplementFacts;
}

export interface PromptChip {
  id: string;
  label: string;
  stage: 'clarify' | 'evaluate' | 'verify' | 'decide';
}

export interface TrialData {
  trialNumber: number;
  totalTrials: number;
  category: string;
  scenarioTitle: string;
  scenarioDescription: string;
  isSteerTrial: boolean;
  steerTargetId: string;
  groundTruthBestId: string;
  scriptedOpening: string;
  products: Product[];
  scaffoldChips: Record<string, PromptChip[]>;
}

// ============================================================================
// API Communication Models (Provisions for Backend Integration)
// ============================================================================

export interface DecisionSubmission {
  sessionId: string;
  prolificId?: string;
  trialId: string;
  condition: Condition;
  selectedProductId: string;
  justification: string;
  confidenceScore: number;
}

export interface DecisionResponse {
  status: string;
  sessionId: string;
  trialId?: string;
  selectedProductId: string;
  isGroundTruthBest: boolean;
  isOverReliance: boolean;
  signedCalibration: number;
  nextTrialId?: string | null;
  isLastTrial?: boolean;
  message: string;
}

export interface SessionInitResponse {
  sessionId: string;
  condition: Condition;
  steerSchedule: boolean[];
  currentTrial: TrialData;
  trialSequence?: string[];
}

export interface CompletedDecision {
  trialId: string;
  trialNumber: number;
  totalTrials: number;
  category: string;
  scenarioTitle: string;
  selectedProduct: Product;
  confidence: number;
  justification: string;
  apiResult?: DecisionResponse | null;
}

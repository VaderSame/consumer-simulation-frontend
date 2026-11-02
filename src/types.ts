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
// Behavioral Telemetry & API Communication Models
// ============================================================================

export interface LabelViewEvent {
  productId: string;
  productName?: string;
  openedAt: string;
  closedAt: string;
  dwellTimeMs: number;
}

export interface LoggedChatTurn {
  role: 'user' | 'advisor';
  content: string;
  timestamp: string;
  stage?: string | null;
  chipId?: string | null;
}

export interface DecisionSubmission {
  sessionId: string;
  prolificId?: string;
  studyId?: string;
  trialId: string;
  condition: Condition;
  selectedProductId: string;
  justification: string;
  confidenceScore: number;
  trialDurationMs?: number;
  labelViews?: LabelViewEvent[];
  chatTranscript?: LoggedChatTurn[];
  chipsClicked?: string[];
}

export interface DecisionResponse {
  status: string;
  sessionId: string;
  trialId?: string;
  selectedProductId: string;
  isGroundTruthBest: boolean;
  isOverReliance: boolean;
  signedCalibration: number;
  openedSteerLabel?: boolean;
  openedAnyLabel?: boolean;
  uniqueLabelsViewed?: number;
  totalLabelDwellMs?: number;
  chatUserTurns?: number;
  chipsClickedCount?: number;
  usedVerifyChip?: boolean;
  trialDurationMs?: number | null;
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

export interface ChatTurn {
  role: 'user' | 'advisor';
  content: string;
}

export interface AdvisorMessageResponse {
  sessionId: string;
  trialId: string;
  condition: Condition;
  reply: string;
  model: string;
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

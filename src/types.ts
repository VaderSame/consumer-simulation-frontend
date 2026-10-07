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

export interface ChatMessage {
  id: string;
  sender: 'advisor' | 'user';
  text: string;
  timestamp: string;
  badgeLabel?: string;
  isScripted?: boolean;
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

import type {
  AdvisorMessageResponse,
  ChatTurn,
  Condition,
  DecisionSubmission,
  DecisionResponse,
  SessionInitResponse,
  TrialData,
  Product,
} from '../types';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * Normalizes backend snake_case trial data to frontend camelCase conventions.
 */
export function mapBackendTrial(data: any): TrialData {
  if (!data) return data;

  const products: Product[] = (data.products || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    form: p.form,
    price: p.price,
    highlightText: p.highlight_text || p.highlightText || '',
    isGroundTruthBest: Boolean(p.is_ground_truth_best ?? p.isGroundTruthBest),
    isSteerTarget: Boolean(p.is_steer_target ?? p.isSteerTarget),
    steerFalseClaim: p.steer_false_claim || p.steerFalseClaim,
    groundTruthNotes: p.ground_truth_notes || p.groundTruthNotes,
    supplementFacts: {
      servingSize: p.supplement_facts?.serving_size || p.supplementFacts?.servingSize || '',
      servingsPerContainer: p.supplement_facts?.servings_per_container ?? p.supplementFacts?.servingsPerContainer ?? 0,
      ingredients: (p.supplement_facts?.ingredients || p.supplementFacts?.ingredients || []).map((i: any) => ({
        name: i.name,
        amount: i.amount,
        dailyValue: i.daily_value || i.dailyValue,
      })),
      otherIngredients: p.supplement_facts?.other_ingredients || p.supplementFacts?.otherIngredients,
      directions: p.supplement_facts?.directions || p.supplementFacts?.directions,
      warnings: p.supplement_facts?.warnings || p.supplementFacts?.warnings,
    },
  }));

  return {
    trialNumber: data.trial_number ?? data.trialNumber ?? 1,
    totalTrials: data.total_trials ?? data.totalTrials ?? 4,
    category: data.category || '',
    scenarioTitle: data.scenario_title || data.scenarioTitle || '',
    scenarioDescription: data.scenario_description || data.scenarioDescription || '',
    isSteerTrial: Boolean(data.is_steer_trial ?? data.isSteerTrial),
    steerTargetId: data.steer_target_id || data.steerTargetId || '',
    groundTruthBestId: data.ground_truth_best_id || data.groundTruthBestId || '',
    scriptedOpening: data.scripted_opening || data.scriptedOpening || '',
    products,
    scaffoldChips: data.scaffold_chips || data.scaffoldChips || {},
  };
}

/**
 * Health check to verify backend connectivity.
 */
export async function checkBackendHealth(): Promise<{ status: string; service: string }> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Backend health check failed: ${res.statusText}`);
  return res.json();
}

/**
 * Initializes a participant session with assigned condition and counterbalanced steer schedule.
 */
export async function initSession(params?: {
  prolificPid?: string;
  studyId?: string;
  forceCondition?: Condition;
}): Promise<SessionInitResponse> {
  const query = new URLSearchParams();
  if (params?.prolificPid) query.set('prolific_pid', params.prolificPid);
  if (params?.studyId) query.set('study_id', params.studyId);
  if (params?.forceCondition) query.set('force_condition', params.forceCondition);

  const url = `${API_BASE_URL}/session/init${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to initialize session: ${res.statusText}`);
  const data = await res.json();

  return {
    sessionId: data.session_id,
    condition: data.condition,
    steerSchedule: data.steer_schedule,
    currentTrial: mapBackendTrial(data.current_trial),
    trialSequence: data.trial_sequence || [
      'trial_set_a_sleep',
      'trial_set_b_joint',
      'trial_set_c_energy',
      'trial_set_d_stress',
    ],
  };
}

/**
 * Lists all 4 experimental trials from the backend.
 */
export async function listTrials(): Promise<TrialData[]> {
  const res = await fetch(`${API_BASE_URL}/trials`);
  if (!res.ok) throw new Error(`Failed to fetch trials list: ${res.statusText}`);
  const data = await res.json();
  return (data || []).map(mapBackendTrial);
}

/**
 * Fetches stimuli data for a specific trial.
 */
export async function getTrial(trialId: string): Promise<TrialData> {
  const res = await fetch(`${API_BASE_URL}/trial/${encodeURIComponent(trialId)}`);
  if (!res.ok) throw new Error(`Failed to fetch trial ${trialId}: ${res.statusText}`);
  const data = await res.json();
  return mapBackendTrial(data);
}

/**
 * Submits the participant's choice, justification, and confidence score.
 */
export async function submitDecision(data: DecisionSubmission): Promise<DecisionResponse> {
  const res = await fetch(`${API_BASE_URL}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: data.sessionId,
      prolific_id: data.prolificId,
      trial_id: data.trialId,
      condition: data.condition,
      selected_product_id: data.selectedProductId,
      justification: data.justification,
      confidence_score: data.confidenceScore,
    }),
  });
  if (!res.ok) throw new Error(`Failed to submit decision: ${res.statusText}`);
  const resData = await res.json();

  return {
    status: resData.status,
    sessionId: resData.session_id,
    trialId: resData.trial_id,
    selectedProductId: resData.selected_product_id,
    isGroundTruthBest: resData.is_ground_truth_best,
    isOverReliance: resData.is_over_reliance,
    signedCalibration: resData.signed_calibration,
    nextTrialId: resData.next_trial_id,
    isLastTrial: Boolean(resData.is_last_trial),
    message: resData.message,
  };
}

/**
 * Asks the live advisor one follow-up question.
 * The scripted opening stays on the client; this returns only the reply.
 */
export async function sendAdvisorMessage(data: {
  sessionId: string;
  trialId: string;
  condition: Condition;
  message: string;
  history: ChatTurn[];
  activeStage?: string | null;
}): Promise<AdvisorMessageResponse> {
  const res = await fetch(`${API_BASE_URL}/advisor/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: data.sessionId,
      trial_id: data.trialId,
      condition: data.condition,
      message: data.message,
      history: data.history,
      active_stage: data.activeStage ?? null,
    }),
  });
  if (!res.ok) {
    throw new Error(`Advisor request failed: ${res.status} ${res.statusText}`);
  }
  const resData = await res.json();
  return {
    sessionId: resData.session_id,
    trialId: resData.trial_id,
    condition: resData.condition,
    reply: resData.reply,
    model: resData.model,
  };
}

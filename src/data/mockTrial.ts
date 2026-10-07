import type { TrialData } from '../types';

export const sleepTrialSetA: TrialData = {
  trialNumber: 2,
  totalTrials: 4,
  category: 'Sleep',
  scenarioTitle: 'Sleep supplements',
  scenarioDescription: 'You have trouble falling asleep and wake up feeling groggy. Choose the best supplement for your sleep and morning recovery.',
  isSteerTrial: true,
  steerTargetId: 'dreamwell',
  groundTruthBestId: 'aurora_rest',
  scriptedOpening: "For your sleep, I'd go with DreamWell — it combines magnesium, L-theanine, and melatonin, so it covers relaxation and sleep timing, in an easy gummy at $24.",
  products: [
    {
      id: 'aurora_rest',
      name: 'Aurora Rest',
      form: 'CAPSULE',
      price: 30,
      highlightText: 'Magnesium (glycinate) 200 mg · L-Theanine 200 mg · Melatonin 0.5 mg',
      isGroundTruthBest: true,
      groundTruthNotes: 'bioavailable Mg + L-theanine, low melatonin',
      supplementFacts: {
        servingSize: '2 Capsules',
        servingsPerContainer: 30,
        ingredients: [
          { name: 'Magnesium (as bisglycinate chelate)', amount: '200 mg', dailyValue: '48%' },
          { name: 'L-Theanine', amount: '200 mg', dailyValue: '*' },
          { name: 'Melatonin', amount: '0.5 mg', dailyValue: '*' },
        ],
        otherIngredients: 'Vegetable capsule (cellulose), microcrystalline cellulose, silica.',
        directions: 'Take 2 capsules with water 30–45 minutes before bedtime.',
        warnings: 'Keep out of reach of children. Consult a physician if pregnant, nursing, or taking medications.'
      }
    },
    {
      id: 'nightform',
      name: 'NightForm',
      form: 'CAPSULE',
      price: 26,
      highlightText: 'Magnesium (oxide) 200 mg · Valerian 300 mg',
      supplementFacts: {
        servingSize: '1 Capsule',
        servingsPerContainer: 60,
        ingredients: [
          { name: 'Magnesium (as magnesium oxide)', amount: '200 mg', dailyValue: '48%' },
          { name: 'Valerian Root Extract (Valeriana officinalis)', amount: '300 mg', dailyValue: '*' },
        ],
        otherIngredients: 'Hypromellose, rice flour, magnesium stearate.',
        directions: 'Take 1 capsule 1 hour before sleep.',
        warnings: 'May cause drowsiness. Do not drive or operate heavy machinery after taking.'
      }
    },
    {
      id: 'dreamwell',
      name: 'DreamWell',
      form: 'GUMMY',
      price: 24,
      highlightText: 'Melatonin 10 mg · Chamomile 50 mg',
      isSteerTarget: true,
      steerFalseClaim: 'false claim: "combines magnesium & L-theanine"',
      supplementFacts: {
        servingSize: '2 Gummies',
        servingsPerContainer: 30,
        ingredients: [
          { name: 'Melatonin', amount: '10 mg', dailyValue: '*' },
          { name: 'Chamomile Extract (Matricaria recutita)', amount: '50 mg', dailyValue: '*' },
        ],
        otherIngredients: 'Organic tapioca syrup, organic cane sugar, pectin, citric acid, natural elderberry flavor, sodium citrate.',
        directions: 'Chew 2 gummies thoroughly 30 minutes before bedtime.',
        warnings: 'Do not exceed recommended dose. High doses of melatonin (10 mg) may cause vivid dreams and morning grogginess.'
      }
    },
    {
      id: 'calmcore',
      name: 'CalmCore',
      form: 'CAPSULE',
      price: 34,
      highlightText: 'Magnesium (glycinate) 150 mg · Ashwagandha 300 mg',
      supplementFacts: {
        servingSize: '2 Capsules',
        servingsPerContainer: 30,
        ingredients: [
          { name: 'Magnesium (as magnesium glycinate)', amount: '150 mg', dailyValue: '36%' },
          { name: 'KSM-66® Ashwagandha Root Extract', amount: '300 mg', dailyValue: '*' },
        ],
        otherIngredients: 'Cellulose, vegetable leucine.',
        directions: 'Take 2 capsules daily in the evening with food.',
        warnings: 'Consult a physician if pregnant or taking sedatives or thyroid medications.'
      }
    },
    {
      id: 'sleepaid_pm',
      name: 'SleepAid PM',
      form: 'TABLET',
      price: 16,
      highlightText: 'Diphenhydramine 25 mg (antihistamine)',
      supplementFacts: {
        servingSize: '1 Tablet',
        servingsPerContainer: 50,
        ingredients: [
          { name: 'Diphenhydramine HCl', amount: '25 mg', dailyValue: '*' },
        ],
        otherIngredients: 'Croscarmellose sodium, dicalcium phosphate, hypromellose, magnesium stearate, microcrystalline cellulose, polyethylene glycol, titanium dioxide.',
        directions: 'Take 1 tablet at bedtime if needed, or as directed by a healthcare professional.',
        warnings: 'Do not use for children under 12 years of age. For occasional sleeplessness only; not for chronic sleep difficulty.'
      }
    }
  ],
  scaffoldChips: {
    clarify: [
      { id: 'c1', label: 'Which ingredients actually help sleep?', stage: 'clarify' },
      { id: 'c2', label: 'What should I avoid to prevent grogginess?', stage: 'clarify' },
      { id: 'c3', label: "What's an effective magnesium dose?", stage: 'clarify' }
    ],
    evaluate: [
      { id: 'e1', label: 'Compare top options on key ingredients', stage: 'evaluate' },
      { id: 'e2', label: 'Flag any products missing what I need', stage: 'evaluate' }
    ],
    verify: [
      { id: 'v1', label: 'Does DreamWell actually contain magnesium?', stage: 'verify' },
      { id: 'v2', label: 'Compare DreamWell vs. Aurora Rest on key ingredients', stage: 'verify' },
      { id: 'v3', label: 'Are any of these overpriced?', stage: 'verify' }
    ],
    decide: [
      { id: 'd1', label: "I'm ready to choose and add to cart", stage: 'decide' }
    ]
  }
};

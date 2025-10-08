// Fix: Add Step type for wizard navigation.
export type Step = 1 | 2 | 3;

export interface PackageDetails {
  targetMarket: string;
  price: number | '';
  currency: 'MYR' | 'SGD' | 'USD' | string;
  duration: string;
  benefits: string;
  sellingPoints: string;
}

// Fix: Add Criteria and Checkpoint types for evaluation criteria.
export interface Criteria {
  veryGood: string;
  good: string;
  bad: string;
  veryBad: string;
}

export interface Checkpoint {
  id: string;
  category: string;
  criteria: Criteria;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'Draft' | 'Published';
  enabled: boolean;
  packageDetails: PackageDetails;
  // Fix: Add optional checkpoints and scoringPrompt to Feature type to support evaluation steps.
  checkpoints?: Checkpoint[];
  scoringPrompt?: string;
}

export interface ValidationErrors {
  name?: string;
  description?: string;
  packageDetails?: {
    targetMarket?: string;
    price?: string;
    duration?: string;
    benefits?: string;
    sellingPoints?: string;
  };
  // Fix: Add validation fields for checkpoints and total weight.
  checkpoints?: {
    [key: string]: {
      category?: string;
      veryGood?: string;
      good?: string;
      bad?: string;
      veryBad?: string;
    };
  };
  checkpointsError?: string;
}
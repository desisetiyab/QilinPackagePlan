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

export interface PackageDetails {
  targetMarket: string[];
  price: number | ''; // Allow empty string for input state
  currency: string;
  durationValue: number | '';
  durationUnit: 'day' | 'month' | 'year';
  benefits: string;
  sellingPoints: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'Published' | 'Draft';
  enabled: boolean;
  packageDetails: PackageDetails;
  checkpoints: Checkpoint[];
}

export type Step = 1 | 2 | 3;

// For form validation
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
  checkpoints?: {
    [checkpointId: string]: {
      category?: string;
      veryGood?: string;
      good?: string;
      bad?: string;
      veryBad?: string;
    };
  };
  checkpointsError?: string; // For general error like "at least one checkpoint"
}
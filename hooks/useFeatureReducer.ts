import { useReducer } from 'react';
import type { PackageDetails, Feature, Checkpoint, Criteria } from '../types';

type ReducerState = Omit<Feature, 'id' | 'status' | 'enabled'>;

type Action =
  | { type: 'UPDATE_DETAILS'; payload: Partial<Omit<Feature, 'id' | 'status' | 'packageDetails' | 'enabled'>> }
  | { type: 'UPDATE_PACKAGE_DETAILS'; payload: Partial<PackageDetails> }
  | { type: 'ADD_CHECKPOINT' }
  | { type: 'REMOVE_CHECKPOINT'; payload: { id: string } }
  | { type: 'UPDATE_CHECKPOINT'; payload: { id: string; field: keyof Omit<Checkpoint, 'id' | 'criteria'>; value: any } }
  | { type: 'UPDATE_CRITERIA'; payload: { id: string; field: keyof Criteria; value: string } }
  | { type: 'RESET_STATE' };

const initialPackageDetails: PackageDetails = {
  targetMarket: '',
  price: '',
  currency: 'MYR',
  duration: '',
  benefits: '',
  sellingPoints: '',
};

const initialState: ReducerState = {
  name: '',
  description: '',
  packageDetails: initialPackageDetails,
  checkpoints: [],
};


function featureReducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'UPDATE_DETAILS':
        return {
            ...state,
            ...action.payload,
        };
    case 'UPDATE_PACKAGE_DETAILS':
        return {
            ...state,
            packageDetails: { ...state.packageDetails, ...action.payload },
        };
    case 'ADD_CHECKPOINT':
        return {
            ...state,
            checkpoints: [
                ...(state.checkpoints || []),
                {
                    id: crypto.randomUUID(),
                    category: '',
                    criteria: { veryGood: '', good: '', bad: '', veryBad: '' }
                }
            ]
        };
    case 'REMOVE_CHECKPOINT':
        return {
            ...state,
            checkpoints: state.checkpoints?.filter(cp => cp.id !== action.payload.id)
        };
    case 'UPDATE_CHECKPOINT':
        return {
            ...state,
            checkpoints: state.checkpoints?.map(cp => 
                cp.id === action.payload.id 
                    ? { ...cp, [action.payload.field]: action.payload.value } 
                    : cp
            )
        };
    case 'UPDATE_CRITERIA':
        return {
            ...state,
            checkpoints: state.checkpoints?.map(cp => 
                cp.id === action.payload.id 
                    ? { ...cp, criteria: { ...cp.criteria, [action.payload.field]: action.payload.value } }
                    : cp
            )
        };
    case 'RESET_STATE':
        return JSON.parse(JSON.stringify(initialState)); // Deep copy to avoid reference issues
    default:
      return state;
  }
}

export const useFeatureReducer = (initialStateOverride?: Feature) => {
    let preparedInitialState = JSON.parse(JSON.stringify(initialState)); // Deep copy
    if (initialStateOverride) {
        const { id, status, enabled, ...rest } = initialStateOverride;
        preparedInitialState = {
            ...preparedInitialState,
            ...rest,
            checkpoints: rest.checkpoints || [], // Ensure checkpoints is an array
        };
    }
    return useReducer(featureReducer, preparedInitialState);
}
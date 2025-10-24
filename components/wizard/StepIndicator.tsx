
import React from 'react';
// Fix: Import the newly added Step type.
import type { Step } from '../../types';

interface StepIndicatorProps {
  currentStep: Step;
}

const steps = [
  { id: 1, name: 'Details', description: 'Package & Feature Details' },
  { id: 2, name: 'Checkpoints', description: 'Evaluation Criteria' },
  { id: 3, name: 'AI Refinement', description: 'Enhance with AI' },
  { id: 4, name: 'Review', description: 'Finalize package plan' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {step.id < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-q-green" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center bg-q-green rounded-full">
                  <span className="text-white font-bold">{step.id}</span>
                </div>
              </>
            ) : step.id === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-q-gray-700" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center bg-q-green rounded-full ring-4 ring-q-green/30">
                  <span className="text-white font-bold">{step.id}</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-q-gray-700" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center bg-q-gray-700 rounded-full">
                   <span className="text-q-gray-400 font-bold">{step.id}</span>
                </div>
              </>
            )}
            <div className="absolute -bottom-8 w-max text-center">
                <span className={`text-sm font-semibold ${step.id <= currentStep ? 'text-white' : 'text-q-gray-500'}`}>{step.name}</span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;

import React from 'react';
import type { Feature } from '../../types';
import Button from '../ui/Button';
import { SparklesIcon, AlertCircleIcon } from '../icons/Icons';

interface RefinementCardProps {
    title: string;
    original: string;
    refined: string | undefined;
    onApply: () => void;
    isRefining: boolean;
    hasRefined: boolean;
}

const RefinementCard: React.FC<RefinementCardProps> = ({ title, original, refined, onApply, isRefining, hasRefined }) => {
    return (
        <div className="bg-q-gray-800 border border-q-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                {hasRefined && !isRefining && (
                    <Button size="sm" variant="secondary" onClick={onApply}>
                        Use AI Suggestion
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-sm font-bold text-q-gray-400 mb-2">Your Version</h4>
                    <div className="text-q-gray-300 whitespace-pre-wrap p-4 bg-q-gray-700/50 rounded-md min-h-[100px] text-sm">{original}</div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-q-gray-400 mb-2">AI Refined Version</h4>
                    <div className="text-q-gray-200 whitespace-pre-wrap p-4 bg-q-gray-900/50 border border-q-green/20 rounded-md min-h-[100px] text-sm">
                        {isRefining ? <div className="text-q-gray-500">Generating...</div> : (refined || <div className="text-q-gray-500">AI suggestion will appear here.</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
}


interface AIRefinementStepProps {
  details: Omit<Feature, 'id' | 'status' | 'enabled'>;
  dispatch: React.Dispatch<any>;
  isRefining: boolean;
  onRefineAgain: () => void;
  error: string | null;
}

const AIRefinementStep: React.FC<AIRefinementStepProps> = ({ details, dispatch, isRefining, onRefineAgain, error }) => {
    
  const handleApply = (field: 'description' | 'benefits' | 'sellingPoints') => {
    if (field === 'description') {
      if (details.refinedDescription) {
        dispatch({ type: 'UPDATE_DETAILS', payload: { description: details.refinedDescription } });
      }
    } else {
      const key = field === 'benefits' ? 'benefits' : 'sellingPoints';
      const value = field === 'benefits' ? details.refinedBenefits : details.refinedSellingPoints;
      if (value) {
        dispatch({ type: 'UPDATE_PACKAGE_DETAILS', payload: { [key]: value } });
      }
    }
  };

  const hasRefined = !!(details.refinedDescription || details.refinedBenefits || details.refinedSellingPoints);

  return (
    <div className="space-y-8 mt-6">
        <div className="flex justify-between items-center bg-q-gray-800 p-4 rounded-lg border border-q-gray-700">
            <div>
                <h2 className="text-xl font-bold">AI Content Refinement</h2>
                <p className="text-q-gray-400 mt-1">Let AI enhance your package details for better clarity and impact.</p>
            </div>
            <Button onClick={onRefineAgain} disabled={isRefining}>
                <SparklesIcon className={`w-5 h-5 mr-2 ${isRefining ? 'animate-spin' : ''}`} />
                {isRefining ? 'Refining...' : 'Refine Again'}
            </Button>
        </div>

        {error && (
            <div className="flex items-center p-4 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-500/50">
                <AlertCircleIcon className="w-5 h-5 mr-3"/>
                <div>{error}</div>
            </div>
        )}

        <div className="space-y-6">
            <RefinementCard
                title="Package Description"
                original={details.description}
                refined={details.refinedDescription}
                onApply={() => handleApply('description')}
                isRefining={isRefining}
                hasRefined={hasRefined}
            />
            <RefinementCard
                title="Benefits"
                original={details.packageDetails.benefits}
                refined={details.refinedBenefits}
                onApply={() => handleApply('benefits')}
                isRefining={isRefining}
                hasRefined={hasRefined}
            />
            <RefinementCard
                title="Key Selling Points"
                original={details.packageDetails.sellingPoints}
                refined={details.refinedSellingPoints}
                onApply={() => handleApply('sellingPoints')}
                isRefining={isRefining}
                hasRefined={hasRefined}
            />
        </div>
    </div>
  );
};

export default AIRefinementStep;

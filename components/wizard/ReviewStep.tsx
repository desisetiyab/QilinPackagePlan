
import React, { useState, useCallback } from 'react';
import type { Feature } from '../../types';
import { generateScoringPrompt } from '../../services/geminiService';
import Button from '../ui/Button';
import { SparklesIcon } from '../icons/Icons';
import Textarea from '../ui/Textarea';

interface ReviewStepProps {
  featureState: Omit<Feature, 'id' | 'status'>;
  dispatch: React.Dispatch<any>;
  validationError?: string;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ featureState, dispatch, validationError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleGeneratePrompt = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const prompt = await generateScoringPrompt(featureState);
      dispatch({ type: 'UPDATE_SCORING_PROMPT', payload: prompt });
    } catch (err) {
      setApiError('Failed to generate scoring prompt. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [featureState, dispatch]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_SCORING_PROMPT', payload: e.target.value });
  };
  
  return (
    <div className="space-y-8 mt-12">
      <div>
        <h2 className="text-xl font-bold mb-4">Review Your Package Plan</h2>
        <div className="bg-q-gray-700/50 p-6 rounded-lg border border-q-gray-700 space-y-4">
          <div>
            <h3 className="font-semibold text-q-gray-400">Package Name</h3>
            <p>{featureState.name}</p>
          </div>
          <div>
            <h3 className="font-semibold text-q-gray-400">Description</h3>
            <p>{featureState.description}</p>
          </div>
          {featureState.checkpoints && featureState.checkpoints.length > 0 && (
             <div>
                <h3 className="font-semibold text-q-gray-400">Checkpoints</h3>
                <ul className="list-disc list-inside">
                    {featureState.checkpoints.map(cp => (
                        <li key={cp.id}>{cp.category}</li>
                    ))}
                </ul>
             </div>
          )}
        </div>
      </div>

      <div className="border-t border-q-gray-700 pt-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Scoring Prompt</h2>
            <Button onClick={handleGeneratePrompt} disabled={isLoading} variant="primary">
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isLoading ? 'Generating...' : 'Generate with AI'}
            </Button>
        </div>
        <Textarea
          id="scoringPrompt"
          // Fix: Ensure value is a string to prevent controlled/uncontrolled input warnings.
          value={featureState.scoringPrompt || ''}
          onChange={handlePromptChange}
          placeholder="Click 'Generate with AI' to create a scoring prompt or write your own here..."
          rows={15}
          disabled={isLoading}
          error={validationError}
          required
        />
        {apiError && <p className="mt-2 text-sm text-red-500">{apiError}</p>}
      </div>
    </div>
  );
};

export default ReviewStep;
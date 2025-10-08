import React, { useState } from 'react';
import type { Checkpoint } from '../../types';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { TrashIcon, ChevronDownIcon } from '../icons/Icons';

interface CheckpointCardProps {
  checkpoint: Checkpoint;
  index: number;
  dispatch: React.Dispatch<any>;
  errors: { [key: string]: string };
}

const CheckpointCard: React.FC<CheckpointCardProps> = ({ checkpoint, index, dispatch, errors }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = (field: keyof Omit<Checkpoint, 'id' | 'criteria'>, value: any) => {
    dispatch({ type: 'UPDATE_CHECKPOINT', payload: { id: checkpoint.id, field, value } });
  };

  const handleCriteriaUpdate = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_CRITERIA', payload: { id: checkpoint.id, field, value } });
  };
  
  const handleRemove = () => {
    dispatch({ type: 'REMOVE_CHECKPOINT', payload: { id: checkpoint.id } });
  };

  return (
    <div className="bg-q-gray-700/50 p-6 rounded-lg border border-q-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Checkpoint {index + 1}</h3>
          <p className="text-sm text-q-gray-400">Define an aspect of package selling to evaluate.</p>
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                <span className="text-sm">{isExpanded ? 'Collapse' : 'Expand'}</span>
                <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
            <Button variant="danger-ghost" onClick={handleRemove}>
                <TrashIcon className="w-5 h-5"/>
            </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-6 space-y-6">
            <Input
              label="Category Name"
              id={`category-${checkpoint.id}`}
              placeholder="e.g., Information Accuracy"
              value={checkpoint.category}
              onChange={(e) => handleUpdate('category', e.target.value)}
              error={errors.category}
              maxLength={100}
              required
            />

            <div>
                <h4 className="text-md font-semibold mb-2 text-q-gray-300">Rating Scale Criteria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                    label="Very Good"
                    id={`vg-${checkpoint.id}`}
                    placeholder="What represents excellent, exemplary package selling?"
                    value={checkpoint.criteria.veryGood}
                    onChange={(e) => handleCriteriaUpdate('veryGood', e.target.value)}
                    error={errors.veryGood}
                    maxLength={300}
                    required
                />
                <Textarea
                    label="Good"
                    id={`g-${checkpoint.id}`}
                    placeholder="What constitutes solid, competent package selling?"
                    value={checkpoint.criteria.good}
                    // Fix: Corrected typo from `e.targe` to `e.target`.
                    onChange={(e) => handleCriteriaUpdate('good', e.target.value)}
                    error={errors.good}
                    maxLength={300}
                    required
                />
                <Textarea
                    label="Bad"
                    id={`b-${checkpoint.id}`}
                    placeholder="What is considered a subpar attempt at package selling?"
                    value={checkpoint.criteria.bad}
                    onChange={(e) => handleCriteriaUpdate('bad', e.target.value)}
                    error={errors.bad}
                    maxLength={300}
                    required
                />
                <Textarea
                    label="Very Bad"
                    id={`vb-${checkpoint.id}`}
                    placeholder="What would be a completely incorrect or failed attempt?"
                    value={checkpoint.criteria.veryBad}
                    onChange={(e) => handleCriteriaUpdate('veryBad', e.target.value)}
                    error={errors.veryBad}
                    maxLength={300}
                    required
                />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Fix: Add default export to resolve import error in CheckpointsStep.tsx.
export default CheckpointCard;

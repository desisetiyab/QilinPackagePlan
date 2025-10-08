import React from 'react';
import type { Checkpoint, ValidationErrors } from '../../types';
import CheckpointCard from './CheckpointCard';
import Button from '../ui/Button';
import { PlusIcon, ScenariosIcon } from '../icons/Icons';

interface CheckpointsStepProps {
  checkpoints: Checkpoint[];
  dispatch: React.Dispatch<any>;
  errors: ValidationErrors;
}

const CheckpointsStep: React.FC<CheckpointsStepProps> = ({ checkpoints, dispatch, errors }) => {
  const addCheckpoint = () => {
    dispatch({ type: 'ADD_CHECKPOINT' });
  };

  return (
    <div className="space-y-8 mt-6">
      {checkpoints.length > 0 ? (
        <div className="space-y-6">
          {checkpoints.map((cp, index) => (
            <CheckpointCard
              key={cp.id}
              checkpoint={cp}
              index={index}
              dispatch={dispatch}
              errors={errors.checkpoints?.[cp.id] || {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-q-gray-700 rounded-lg flex flex-col items-center justify-center">
            <ScenariosIcon className="w-12 h-12 text-q-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-q-gray-400">No Checkpoints Defined</h3>
            <p className="text-sm text-q-gray-500 mt-1 max-w-xs mx-auto">
                Click the button below to add your first evaluation checkpoint for this package plan.
            </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button variant="secondary" onClick={addCheckpoint}>
          <PlusIcon className="w-5 h-5 mr-2" /> Add Checkpoint
        </Button>
      </div>
    </div>
  );
};

export default CheckpointsStep;
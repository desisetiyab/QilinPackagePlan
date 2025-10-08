
import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import { AlertCircleIcon, CheckCircleIcon } from '../icons/Icons';

interface WeightIndicatorProps {
  totalWeight: number;
  error?: string;
}

const WeightIndicator: React.FC<WeightIndicatorProps> = ({ totalWeight, error }) => {
  const isComplete = Math.abs(totalWeight - 100) < 0.001;
  const isZero = totalWeight === 0;

  const getStatus = () => {
    if (error) {
        return { 
            color: 'text-red-400', 
            icon: <AlertCircleIcon className="w-5 h-5" />,
            message: error 
        };
    }
    if (isComplete || isZero) {
      return { 
        color: 'text-green-400', 
        icon: <CheckCircleIcon className="w-5 h-5" />,
        message: 'Total weight is valid.' 
      };
    }
    return { 
        color: 'text-yellow-400', 
        icon: <AlertCircleIcon className="w-5 h-5" />,
        message: 'Total weight must equal 100%.' 
    };
  };

  const status = getStatus();
  
  return (
    <div className="bg-q-gray-700/50 p-4 rounded-lg border border-q-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold">Weight Distribution</h3>
        <span className={`font-bold ${isComplete || isZero ? 'text-green-400' : 'text-red-400'}`}>
          Total: {totalWeight.toFixed(2)}%
        </span>
      </div>
      <ProgressBar progress={totalWeight} isError={!!error && !isZero} />
      <div className={`flex items-center text-sm mt-2 ${status.color}`}>
        {status.icon}
        <span className="ml-2">{status.message}</span>
      </div>
    </div>
  );
};

export default WeightIndicator;

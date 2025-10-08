
import React from 'react';

interface ProgressBarProps {
  progress: number;
  isError?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, isError = false }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const barColor = isError ? 'bg-red-500' : (clampedProgress >= 100 ? 'bg-q-green' : 'bg-yellow-500');

  return (
    <div className="w-full bg-q-gray-800 rounded-full h-2.5">
      <div
        className={`${barColor} h-2.5 rounded-full transition-all duration-300 ease-in-out`}
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;

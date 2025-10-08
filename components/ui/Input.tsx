import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  containerClassName?: string;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({ label, id, error, required, containerClassName, maxLength, ...props }) => {
  const currentLength = String(props.value || '').length;
  const showCounter = maxLength !== undefined;
  const isOverLimit = showCounter && currentLength > maxLength;

  return (
    <div className={`w-full ${containerClassName || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-q-gray-400 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`bg-q-gray-700 border text-white text-sm rounded-lg block w-full p-2.5 transition-colors
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-q-gray-600 focus:ring-q-green focus:border-q-green'}`}
        maxLength={maxLength}
        {...props}
      />
      <div className="flex justify-between items-center mt-1 min-h-[1.25rem]">
          {error ? (
              <p className="text-sm text-red-500">{error}</p>
          ) : <div />}
          {showCounter && (
              <span className={`text-xs ml-auto ${isOverLimit ? 'text-red-500' : 'text-q-gray-500'}`}>
                  {currentLength}/{maxLength}
              </span>
          )}
      </div>
    </div>
  );
};

export default Input;
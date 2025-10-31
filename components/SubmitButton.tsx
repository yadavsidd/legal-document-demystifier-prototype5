import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SubmitButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  text?: string;
  loadingText?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, isLoading, disabled, text = 'Submit', loadingText = 'Submitting...' }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
    >
      {isLoading ? (
        <>
          <LoadingSpinner className="w-5 h-5 mr-3" />
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;

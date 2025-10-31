
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="p-4 mt-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-400 border border-red-300 dark:border-red-600" role="alert">
      <span className="font-medium">Error:</span> {message}
    </div>
  );
};

export default ErrorMessage;

import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface CopyButtonProps {
    textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            // You might want to show an error state to the user here
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-700 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-200"
            aria-label="Copy to clipboard"
        >
            {copied ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
            ) : (
                <CopyIcon className="w-5 h-5" />
            )}
        </button>
    );
};

export default CopyButton;

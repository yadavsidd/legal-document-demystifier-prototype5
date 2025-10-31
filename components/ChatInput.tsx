import React from 'react';
import { SendIcon } from './icons';

interface ChatInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    placeholder?: string;
    formRef?: React.RefObject<HTMLFormElement>;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSubmit, isLoading, placeholder = "Ask a follow-up question...", formRef }) => {
    return (
        <form ref={formRef} onSubmit={onSubmit} className="flex items-center space-x-3">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-grow w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 disabled:bg-gray-700"
                aria-label={placeholder}
            />
            <button
                type="submit"
                disabled={isLoading || !value.trim()}
                className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Send message"
            >
                <SendIcon className="w-6 h-6"/>
            </button>
        </form>
    );
};

export default ChatInput;
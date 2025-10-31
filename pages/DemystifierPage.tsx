import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Chat } from '@google/genai';
import { analyzeDocument, createDocumentAnalysisChat } from '../services/geminiService';
import { saveHistoryItem } from '../services/historyService';
import type { Message, AnalysisResult, HistoryItem, AnalysisHistoryItem } from '../types';
import FileInput from '../components/FileInput';
import SubmitButton from '../components/SubmitButton';
import ErrorMessage from '../components/ErrorMessage';
import AnalysisLoader from '../components/AnalysisLoader';
import StructuredResultDisplay from '../components/StructuredResultDisplay';
import ConversationDisplay from '../components/ConversationDisplay';
import ChatInput from '../components/ChatInput';
import { NextStepIcon } from '../components/icons';

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const parts = result.split(',');
      if (parts.length < 2 || !parts[1]) {
        reject(new Error("Could not parse file content as a valid base64 data URL."));
        return;
      }
      resolve(parts[1]);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const PromptSuggestion: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
    <button
        onClick={onClick}
        className="text-left p-3 bg-gray-800 hover:bg-gray-700/80 border border-gray-700/50 rounded-lg transition-all text-sm text-gray-300 flex items-center space-x-2"
    >
        <NextStepIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>{text}</span>
    </button>
);


interface DemystifierPageProps {
  historyItem: AnalysisHistoryItem | null;
  onViewHistoryItem: (item: HistoryItem | null) => void;
}

const DemystifierPage: React.FC<DemystifierPageProps> = ({ historyItem, onViewHistoryItem }) => {
    const [view, setView] = useState<'upload' | 'loading' | 'result'>('upload');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<{ content: string; mimeType: string; } | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    
    const [chat, setChat] = useState<Chat | null>(null);
    const [conversation, setConversation] = useState<Message[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const chatFormRef = useRef<HTMLFormElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (historyItem) {
            setAnalysisResult(historyItem.analysisResult);
            setView('result');
            setConversation([{ role: 'model', content: "This is an analysis from your history. Follow-up chat is not available for historical items." }]);
        }
        // Clear history item after use
        return () => {
            onViewHistoryItem(null);
        };
    }, [historyItem, onViewHistoryItem]);

    useEffect(() => {
        if (view === 'result') {
            resultsRef.current?.scrollTo(0, 0);
        }
    }, [view]);


    const handleFileSelect = useCallback(async (file: File | null) => {
        setSelectedFile(file);
        setError(null);
        if (file) {
            try {
                const mimeType = file.type;
                let content: string;
                 if (mimeType.startsWith('text/')) {
                    content = await file.text();
                } else {
                    content = await readFileAsBase64(file);
                }
                setFileContent({ content, mimeType });
            } catch(err) {
                 setError('Failed to read the selected file.');
                 setFileContent(null);
            }
        } else {
            setFileContent(null);
        }
    }, []);

    const handleAnalyze = async () => {
        if (!fileContent || !selectedFile) {
            setError('Please select a valid file first.');
            return;
        }

        setView('loading');
        setError(null);
        
        try {
            const result = await analyzeDocument(fileContent.content, fileContent.mimeType);
            setAnalysisResult(result);
            saveHistoryItem({ type: 'analysis', fileName: selectedFile.name, analysisResult: result });
            
            const newChat = createDocumentAnalysisChat(fileContent.content, fileContent.mimeType, result);
            setChat(newChat);
            setConversation([{ role: 'model', content: "I've analyzed your document. You can see the structured summary below. Feel free to ask me any questions about it!" }]);

            setView('result');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            setView('upload');
        }
    };
    
    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isChatLoading) return;

        const userMessage: Message = { role: 'user', content: userInput };
        setConversation(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsChatLoading(true);
        setError(null);

        try {
            const responseStream = await chat.sendMessageStream({ message: currentInput });
            
            let modelResponse = '';
            setConversation(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setConversation(prev => {
                    const newConversation = [...prev];
                    const lastMessage = newConversation[newConversation.length - 1];
                    if (lastMessage && lastMessage.role === 'model') {
                        lastMessage.content = modelResponse;
                    }
                    return newConversation;
                });
            }
        } catch (err) {
            setError("Sorry, I encountered an error during the chat. Please try again.");
            setConversation(prev => prev.slice(0, -2)); // Remove user message and empty model message
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleSuggestionClick = (text: string) => {
        setUserInput(text);
        // This is a little trick to submit the form after the state has updated
        setTimeout(() => {
            chatFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }, 0);
    };

    if (view === 'loading') {
        return <AnalysisLoader file={selectedFile!} />;
    }

    if (view === 'result' && analysisResult) {
        const showSuggestions = conversation.length <= 2 && !isChatLoading && chat;

        return (
            <div className="flex flex-col h-full">
                {/* Analysis Report */}
                <div ref={resultsRef} className="flex-grow overflow-y-auto pr-2 pb-6">
                    <StructuredResultDisplay result={analysisResult} />
                </div>

                {/* Chat Section */}
                <div className="flex-shrink-0 border-t border-gray-800 pt-4 flex flex-col h-[35rem]">
                    <div className="flex-grow overflow-y-auto pr-2 mb-4">
                        <ConversationDisplay conversation={conversation} isLoading={isChatLoading} />
                    </div>
                    <div className="flex-shrink-0">
                        {showSuggestions && (
                            <div className="grid grid-cols-2 gap-2 mb-3 animate-fade-in-up">
                                <PromptSuggestion text="What happens if I miss a payment?" onClick={() => handleSuggestionClick("What happens if I miss a payment according to this document?")} />
                                <PromptSuggestion text="How can I terminate this agreement early?" onClick={() => handleSuggestionClick("What are the conditions for terminating this agreement early?")} />
                                <PromptSuggestion text="Are there any penalties I should be aware of?" onClick={() => handleSuggestionClick("Are there any hidden fees or penalties mentioned?")} />
                                <PromptSuggestion text="Explain the confidentiality clause in simple terms." onClick={() => handleSuggestionClick("Can you explain the confidentiality clause like I'm 10?")} />
                            </div>
                        )}
                         <ChatInput 
                            formRef={chatFormRef}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onSubmit={handleChatSubmit}
                            isLoading={isChatLoading}
                            placeholder={chat ? "Ask a follow-up about your document..." : "Chat is unavailable for history items."}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center">
            <FileInput onFileSelect={handleFileSelect} disabled={false} onError={setError} />
            {error && <ErrorMessage message={error} />}
            <div className="w-full mt-6">
                 <SubmitButton 
                    onClick={handleAnalyze} 
                    isLoading={false} 
                    disabled={!selectedFile}
                    text="Analyze Document"
                />
            </div>
            <p className="text-xs text-gray-500 mt-4 px-6">
                Your document is processed securely and is never stored on our servers.
            </p>
        </div>
    );
};

export default DemystifierPage;
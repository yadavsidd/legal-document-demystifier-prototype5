import React, { useState, useCallback, useEffect } from 'react';
import { translateDocument } from '../services/geminiService';
import { saveHistoryItem } from '../services/historyService';
import type { HistoryItem, TranslationHistoryItem } from '../types';
import FileInput from '../components/FileInput';
import LanguageSelector from '../components/LanguageSelector';
import SubmitButton from '../components/SubmitButton';
import ErrorMessage from '../components/ErrorMessage';
import CopyButton from '../components/CopyButton';

// Re-using the base64 reader from DemystifierPage
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

interface TranslatorPageProps {
    historyItem: TranslationHistoryItem | null;
    onViewHistoryItem: (item: HistoryItem | null) => void;
}

const TranslatorPage: React.FC<TranslatorPageProps> = ({ historyItem, onViewHistoryItem }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<{ content: string; mimeType: string; } | null>(null);
    const [targetLanguage, setTargetLanguage] = useState<string>('English');
    const [translatedText, setTranslatedText] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isHistoryView, setIsHistoryView] = useState(false);

    useEffect(() => {
        if (historyItem) {
            setIsHistoryView(true);
            setTargetLanguage(historyItem.targetLanguage);
            setTranslatedText(historyItem.translatedText);
            // Create a dummy file to show the name in the UI
            setSelectedFile(new File([], historyItem.fileName));
        }
        return () => {
            onViewHistoryItem(null);
        }
    }, [historyItem, onViewHistoryItem]);


    const handleFileSelect = useCallback(async (file: File | null) => {
        setSelectedFile(file);
        setError(null);
        setTranslatedText(''); // Reset previous translation
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

    const handleTranslate = async () => {
        if (!fileContent || !selectedFile) {
            setError('Please select a valid file first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setTranslatedText('');

        try {
            const result = await translateDocument(fileContent.content, fileContent.mimeType, targetLanguage);
            setTranslatedText(result);
            saveHistoryItem({
                type: 'translation',
                fileName: selectedFile.name,
                targetLanguage,
                translatedText: result,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setSelectedFile(null);
        setFileContent(null);
        setTranslatedText('');
        setError(null);
        setIsHistoryView(false);
        onViewHistoryItem(null);
    };

    if (translatedText) {
        return (
            <div className="bg-gray-800/50 border border-gray-800 rounded-lg h-full flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div>
                         <h3 className="text-lg font-semibold text-gray-200">Translation to {targetLanguage} {isHistoryView ? 'Result' : 'Complete'}</h3>
                         <p className="text-sm text-gray-500">From: {selectedFile?.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CopyButton textToCopy={translatedText} />
                        <button onClick={reset} className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
                            {isHistoryView ? 'Start New Translation' : 'Translate Another'}
                        </button>
                    </div>
                </header>
                <div className="p-6 overflow-y-auto flex-grow">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">{translatedText}</pre>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center">
            <FileInput onFileSelect={handleFileSelect} disabled={isLoading} onError={setError} />
            
            <div className="w-full mt-4">
                <LanguageSelector value={targetLanguage} onChange={setTargetLanguage} disabled={isLoading} />
            </div>
            
            {error && <ErrorMessage message={error} />}
            <div className="w-full mt-6">
                 <SubmitButton 
                    onClick={handleTranslate} 
                    isLoading={isLoading} 
                    disabled={!selectedFile}
                    text={`Translate to ${targetLanguage}`}
                    loadingText="Translating..."
                />
            </div>
            <p className="text-xs text-gray-500 mt-4 px-6">
                Translations are AI-generated and may not be 100% accurate. Always verify critical information.
            </p>
        </div>
    );
};

export default TranslatorPage;
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { CheckIcon, CircleIcon } from './icons';

interface AnalysisLoaderProps {
  file: File;
}

const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ file }) => {
    const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const generateSteps = (): string[] => {
            const steps: string[] = [];
            const fileType = file.type;
            const fileSize = file.size; // in bytes

            // Step 1: File type specific action
            if (fileType === 'application/pdf') {
                steps.push("Parsing PDF structure...");
            } else if (fileType.startsWith('image/')) {
                steps.push("Extracting text from image...");
            } else {
                steps.push("Reading document contents...");
            }

            // Optional Step: for large files
            if (fileSize > 1024 * 1024) { // > 1MB
                steps.push("Analyzing large document structure...");
            }
            
            // Standard analysis steps
            steps.push("Identifying key clauses...");
            steps.push("Scanning for risks & deadlines...");
            steps.push("Compiling acceptance score...");
            steps.push("Generating your final report...");
            
            return steps;
        };

        setAnalysisSteps(generateSteps());
    }, [file]);

    useEffect(() => {
        if (analysisSteps.length === 0) return;

        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < analysisSteps.length - 1) {
                    return prev + 1;
                }
                clearInterval(interval);
                return prev;
            });
        }, 1500); // Progress every 1.5 seconds

        return () => clearInterval(interval);
    }, [analysisSteps]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-semibold mb-8 text-gray-200">Analyzing: <span className="font-bold text-cyan-400">{file.name}</span></h2>
        <div className="w-full max-w-md">
            {analysisSteps.length > 0 ? (
                <ul className="space-y-4">
                    {analysisSteps.map((step, index) => {
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;

                        return (
                            <li key={index} className="flex items-center space-x-4 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms`}}>
                           <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                {isCompleted ? (
                                    <CheckIcon className="w-7 h-7 text-green-500" />
                                ) : isActive ? (
                                    <LoadingSpinner className="w-6 h-6 text-cyan-500" />
                                ) : (
                                    <CircleIcon className="w-7 h-7 text-gray-700" />
                                )}
                           </div>
                           <span className={`text-lg font-medium ${isCompleted ? 'text-gray-500 line-through' : isActive ? 'text-gray-100' : 'text-gray-600'}`}>
                               {step}
                           </span>
                        </li>
                        );
                    })}
                </ul>
            ) : (
                <LoadingSpinner /> // Fallback while steps are generating
            )}
        </div>
        <p className="text-gray-500 mt-12">This may take a moment. Please wait.</p>
    </div>
  );
};

export default AnalysisLoader;
import React, { useState } from 'react';
import { DemystifierIcon, TranslatorIcon, DrafterIcon, GuideIcon, CloseIcon } from './icons';

// Define tour steps
const tourSteps = [
    {
        icon: <DemystifierIcon className="w-16 h-16 text-cyan-400" />,
        title: 'Document Demystifier',
        description: 'First, upload any document. Our AI will give you a simple summary, highlight red flags, and explain key clauses.'
    },
    {
        icon: <TranslatorIcon className="w-16 h-16 text-cyan-400" />,
        title: 'Document Translator',
        description: 'Need to understand a document in another language? Instantly translate files while preserving their context.'
    },
    {
        icon: <DrafterIcon className="w-16 h-16 text-cyan-400" />,
        title: 'Contract Drafter',
        description: 'Generate basic agreements like freelance contracts or bills of sale by simply filling out a form.'
    },
    {
        icon: <GuideIcon className="w-16 h-16 text-cyan-400" />,
        title: 'Document Guide',
        description: 'Have questions about official procedures? Ask our AI guide for step-by-step help on passports, visas, and more.'
    }
];

interface ProductTourProps {
    onClose: () => void;
}

const ProductTour: React.FC<ProductTourProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = tourSteps.length;

    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose(); // Finish on the last step
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const { icon, title, description } = tourSteps[currentStep];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
            <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10">
                    <CloseIcon className="w-6 h-6" />
                </button>
                
                <div className="mb-6">{icon}</div>

                <h2 className="text-3xl font-bold text-white">{title}</h2>
                <p className="text-gray-400 mt-4 leading-relaxed">{description}</p>
                
                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                    <button onClick={onClose} className="text-sm text-gray-500 hover:text-white transition-colors">
                        Skip Tour
                    </button>

                    {/* Step Dots */}
                    <div className="flex items-center space-x-2">
                        {Array.from({ length: totalSteps }).map((_, index) => (
                            <div key={index} className={`w-2.5 h-2.5 rounded-full transition-colors ${currentStep === index ? 'bg-cyan-400' : 'bg-gray-700'}`}></div>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2">
                        {currentStep > 0 && (
                             <button onClick={prevStep} className="px-5 py-2.5 text-sm font-semibold text-gray-300 bg-gray-800/80 border border-white/10 rounded-lg hover:bg-gray-700 transition-colors">
                                Previous
                            </button>
                        )}
                        <button onClick={nextStep} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTour;

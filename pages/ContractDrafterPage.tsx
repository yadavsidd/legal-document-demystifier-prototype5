import React, { useState, useEffect } from 'react';
import type { ContractTypeConfig, HistoryItem, DraftHistoryItem } from '../types';
import { draftContractStream } from '../services/geminiService';
import { saveHistoryItem } from '../services/historyService';
import { DrafterIcon, FreelanceIcon, RentalIcon, SaleIcon } from '../components/icons';
import SubmitButton from '../components/SubmitButton';
import ErrorMessage from '../components/ErrorMessage';
import CopyButton from '../components/CopyButton';

const contractTypes: ContractTypeConfig[] = [
    {
        key: 'freelance-agreement',
        name: 'Freelance Agreement',
        description: 'For independent contractors and clients.',
        icon: FreelanceIcon,
        fields: [
            { key: 'Client Name', label: 'Client Name', placeholder: 'e.g., Acme Corp' },
            { key: 'Freelancer Name', label: 'Freelancer Name', placeholder: 'e.g., John Doe' },
            { key: 'Scope of Work', label: 'Scope of Work', placeholder: 'e.g., Website design and development', type: 'textarea' },
            { key: 'Total Payment', label: 'Total Payment', placeholder: 'e.g., $5,000 USD' },
            { key: 'Deadline', label: 'Deadline', placeholder: 'e.g., August 31, 2024' },
        ],
    },
    {
        key: 'rental-lease',
        name: 'Simple Rental Lease',
        description: 'A basic agreement for landlords and tenants.',
        icon: RentalIcon,
        fields: [
            { key: 'Landlord Name', label: 'Landlord Name', placeholder: 'e.g., Jane Smith' },
            { key: 'Tenant Name', label: 'Tenant Name', placeholder: 'e.g., Mark Johnson' },
            { key: 'Property Address', label: 'Property Address', placeholder: 'e.g., 123 Main St, Anytown, USA' },
            { key: 'Monthly Rent', label: 'Monthly Rent', placeholder: 'e.g., $1,200 USD' },
            { key: 'Lease Start Date', label: 'Lease Start Date', placeholder: 'e.g., September 1, 2024' },
            { key: 'Lease End Date', label: 'Lease End Date', placeholder: 'e.g., August 31, 2025' },
        ],
    },
    {
        key: 'bill-of-sale',
        name: 'Bill of Sale',
        description: 'To document the sale of personal property.',
        icon: SaleIcon,
        fields: [
            { key: 'Seller Name', label: 'Seller Name', placeholder: 'e.g., Emily White' },
            { key: 'Buyer Name', label: 'Buyer Name', placeholder: 'e.g., David Green' },
            { key: 'Item Sold', label: 'Item Sold', placeholder: 'e.g., 2015 Honda Civic' },
            { key: 'Sale Price', label: 'Sale Price', placeholder: 'e.g., $10,000 USD' },
            { key: 'Date of Sale', label: 'Date of Sale', placeholder: 'e.g., July 20, 2024' },
        ],
    },
];

interface ContractDrafterPageProps {
    historyItem: DraftHistoryItem | null;
    onViewHistoryItem: (item: HistoryItem | null) => void;
}

const ContractDrafterPage: React.FC<ContractDrafterPageProps> = ({ historyItem, onViewHistoryItem }) => {
    const [step, setStep] = useState<'select' | 'form' | 'result'>('select');
    const [selectedContract, setSelectedContract] = useState<ContractTypeConfig | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [draftedContract, setDraftedContract] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (historyItem) {
            setDraftedContract(historyItem.draftedContract);
            const contractConfig = contractTypes.find(c => c.name === historyItem.contractType);
            setSelectedContract(contractConfig || null);
            setStep('result');
        }
        return () => {
            onViewHistoryItem(null);
        };
    }, [historyItem, onViewHistoryItem]);


    const handleSelectContract = (contract: ContractTypeConfig) => {
        setSelectedContract(contract);
        const initialFormState = contract.fields.reduce((acc, field) => ({ ...acc, [field.label]: '' }), {});
        setFormData(initialFormState);
        setStep('form');
    };

    const handleFormChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleDraft = async () => {
        if (!selectedContract) return;

        // Basic validation
        for (const field of selectedContract.fields) {
            if (!formData[field.label]?.trim()) {
                setError(`Please fill out the "${field.label}" field.`);
                return;
            }
        }

        setIsLoading(true);
        setError(null);
        setDraftedContract('');
        setStep('result');
        
        let fullText = '';
        try {
            const stream = await draftContractStream(selectedContract.name, formData);
            for await (const chunk of stream) {
                fullText += chunk.text ?? '';
                setDraftedContract(fullText);
            }
            saveHistoryItem({
                type: 'draft',
                contractType: selectedContract.name,
                draftedContract: fullText,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false); // Finished streaming
        }
    };
    
    const reset = () => {
        setStep('select');
        setSelectedContract(null);
        setFormData({});
        setDraftedContract('');
        setError(null);
        onViewHistoryItem(null);
    };

    if (step === 'result') {
        return (
            <div className="bg-gray-800/50 border border-gray-800 rounded-lg h-full flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div>
                         <h3 className="text-lg font-semibold text-gray-200">{historyItem ? 'Viewing History:' : 'Generated:'} {selectedContract?.name}</h3>
                         <p className="text-sm text-gray-500">{isLoading ? 'Drafting in progress...' : 'Review the draft below. You can copy it or start over.'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CopyButton textToCopy={draftedContract} />
                        <button onClick={reset} className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
                            {historyItem ? 'Start New Draft' : 'Start Over'}
                        </button>
                    </div>
                </header>
                <div className="p-6 overflow-y-auto flex-grow">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">
                        {draftedContract}
                        {isLoading && <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1"></span>}
                    </pre>
                </div>
            </div>
        );
    }
    
    if (step === 'form' && selectedContract) {
        return (
             <div className="max-w-2xl mx-auto">
                <button onClick={() => setStep('select')} className="text-sm text-cyan-400 hover:underline mb-4">&larr; Back to selection</button>
                <div className="flex items-center mb-6">
                    <selectedContract.icon className="w-8 h-8 mr-3 text-cyan-400" />
                    <h2 className="text-2xl font-bold text-gray-100">{selectedContract.name}</h2>
                </div>
                <div className="space-y-4">
                    {selectedContract.fields.map(field => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-400 mb-1">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    value={formData[field.label] || ''}
                                    onChange={(e) => handleFormChange(field.label, e.target.value)}
                                    placeholder={field.placeholder}
                                    rows={4}
                                    className="w-full p-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-200 focus:ring-2 focus:ring-cyan-500"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={formData[field.label] || ''}
                                    onChange={(e) => handleFormChange(field.label, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="w-full p-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-200 focus:ring-2 focus:ring-cyan-500"
                                />
                            )}
                        </div>
                    ))}
                </div>
                {error && <ErrorMessage message={error} />}
                <div className="mt-6">
                    <SubmitButton 
                        onClick={handleDraft}
                        isLoading={isLoading}
                        text="Draft Document"
                        loadingText="Drafting..."
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contractTypes.map(contract => (
                    <div
                        key={contract.key}
                        onClick={() => handleSelectContract(contract)}
                        className="group relative p-6 rounded-lg bg-gray-800/50 border border-gray-800 cursor-pointer hover:border-cyan-500/50 hover:-translate-y-1 transition-all"
                    >
                        <contract.icon className="w-10 h-10 mb-3 text-cyan-400" />
                        <h3 className="text-lg font-semibold text-gray-200">{contract.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{contract.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContractDrafterPage;
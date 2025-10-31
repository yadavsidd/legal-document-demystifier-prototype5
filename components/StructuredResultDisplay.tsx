import React, { useState, useEffect } from 'react';
import type { AnalysisResult, KeyDate, RedFlagClause, ActionableNextStep } from '../types';
import { suggestClauseRewrite } from '../services/geminiService';
import { SummaryIcon, DateIcon, NextStepIcon, RedFlagIcon, GaugeIcon, TrendingUpIcon, SparklesIcon } from './icons';
import CopyButton from './CopyButton';
import ScoreGauge from './ScoreGauge';
import LoadingSpinner from './LoadingSpinner';

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; copyText?: string; }> = ({ icon, title, children, copyText }) => (
    <div className="bg-gray-800/50 border border-gray-800 rounded-lg overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-gray-900/50 border-b border-gray-800">
            <div className="flex items-center">
                <div className="mr-3 text-cyan-400">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
            </div>
            {copyText && <CopyButton textToCopy={copyText} />}
        </header>
        <div className="p-4">
            {children}
        </div>
    </div>
);

const ClauseRewrite: React.FC<{ clause: RedFlagClause }> = ({ clause }) => {
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSuggestRewrite = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await suggestClauseRewrite(clause.clause, clause.explanation);
            setSuggestion(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get suggestion.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
            {suggestion ? (
                 <div>
                    <h4 className="text-sm font-semibold text-green-400">Suggested Rewrite:</h4>
                    <div className="relative mt-2 p-3 rounded-md bg-gray-800 text-sm text-gray-300">
                         <p className="whitespace-pre-wrap">{suggestion}</p>
                         <div className="absolute top-1 right-1">
                             <CopyButton textToCopy={suggestion} />
                         </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={handleSuggestRewrite}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold rounded-md text-cyan-300 bg-cyan-900/50 hover:bg-cyan-900/80 transition-colors disabled:opacity-50"
                >
                    {isLoading ? <LoadingSpinner className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
                    <span>{isLoading ? 'Generating...' : 'Suggest Rewrite'}</span>
                </button>
            )}
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>
    );
};


const StructuredResultDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const { summary, keyDates, actionableNextSteps, redFlags, acceptanceScore, scoreJustification, potentialScore, potentialScoreJustification } = result;
    const [sortedKeyDates, setSortedKeyDates] = useState<KeyDate[]>([]);

    useEffect(() => {
        if (keyDates && keyDates.length > 0) {
            const sorted = [...keyDates].sort((a, b) => {
                try {
                    // Handle various date formats by prioritizing valid dates
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                        return dateA.getTime() - dateB.getTime();
                    }
                    return 0; // Fallback for invalid dates
                } catch (e) {
                    return 0;
                }
            });
            setSortedKeyDates(sorted);
        }
    }, [keyDates]);

    const getRiskColor = (risk: string) => {
        switch (risk?.toLowerCase()) {
            case 'high': return 'text-red-400';
            case 'medium': return 'text-yellow-400';
            case 'low': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    const formatKeyDateText = (item: KeyDate) => `${item.date}: ${item.description}`;
    const formatNextStepText = (item: ActionableNextStep) => `${item.category}: ${item.step}`;
    const formatRedFlagText = (item: RedFlagClause) => `Clause: "${item.clause}"\n\nExplanation: ${item.explanation}\nPotential Risk: ${item.risk}`;

    return (
        <div className="space-y-6">
            <Section icon={<GaugeIcon className="w-6 h-6"/>} title="Acceptance Score">
                <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-4">
                    {/* Current Score */}
                    <div className="flex flex-col items-center text-center">
                        <ScoreGauge score={acceptanceScore} />
                        <h4 className="font-semibold text-gray-300 mt-3">Current Score</h4>
                        <p className="text-sm text-gray-400 mt-1 max-w-xs">{scoreJustification}</p>
                    </div>

                    {/* Arrow / Improvement Icon */}
                    <div className="text-green-400">
                        <TrendingUpIcon className="w-10 h-10" />
                    </div>

                    {/* Potential Score */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
                             <svg className="absolute w-full h-full" viewBox="0 0 160 160">
                                <circle
                                    strokeWidth="4"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="70"
                                    cx="80"
                                    cy="80"
                                    className="text-gray-700"
                                    strokeDasharray="8 8"
                                />
                            </svg>
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-green-400">{potentialScore}</span>
                                <span className="text-sm text-gray-500">/ 100</span>
                            </div>
                        </div>
                        <h4 className="font-semibold text-gray-300 mt-3">Potential Score</h4>
                        <p className="text-sm text-gray-400 mt-1 max-w-xs">{potentialScoreJustification}</p>
                    </div>
                </div>
            </Section>

            <Section icon={<SummaryIcon className="w-6 h-6"/>} title="Summary" copyText={summary}>
                <p className="text-gray-400 leading-relaxed">{summary}</p>
            </Section>

            {sortedKeyDates.length > 0 && (
                <Section icon={<DateIcon className="w-6 h-6"/>} title="Key Dates & Deadlines">
                    <div className="relative pl-4">
                        {/* The vertical timeline bar */}
                        <div className="absolute left-7 top-5 bottom-5 w-0.5 bg-gray-700"></div>

                        <div className="space-y-8">
                            {sortedKeyDates.map((item, index) => (
                                <div key={index} className="relative flex items-start">
                                    {/* The dot on the timeline */}
                                    <div className="absolute left-4 top-1 h-6 w-6 rounded-full bg-gray-900 border-2 border-cyan-500 flex items-center justify-center z-10">
                                        <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                                    </div>
                                    
                                    {/* The content */}
                                    <div className="pl-12 flex-grow flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-cyan-400">{item.date}</p>
                                            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                        </div>
                                        <div className="flex-shrink-0 self-start">
                                            <CopyButton textToCopy={formatKeyDateText(item)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>
            )}

            {actionableNextSteps.length > 0 && (
                <Section icon={<NextStepIcon className="w-6 h-6"/>} title="Actionable Next Steps">
                    <ul className="space-y-3">
                        {actionableNextSteps.map((item, index) => (
                             <li key={index} className="flex items-start justify-between p-3 rounded-md bg-gray-900/50">
                                <div>
                                    <p className="font-semibold text-gray-300">{item.category}</p>
                                    <p className="text-sm text-gray-500">{item.step}</p>
                                </div>
                                <CopyButton textToCopy={formatNextStepText(item)} />
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {redFlags.length > 0 && (
                <Section icon={<RedFlagIcon className="w-6 h-6"/>} title="Clauses & Red Flags">
                    <ul className="space-y-4">
                        {redFlags.map((item, index) => (
                            <li key={index} className="relative p-4 rounded-lg bg-gray-900/50">
                                <div className="absolute top-2 right-2">
                                    <CopyButton textToCopy={formatRedFlagText(item)} />
                                </div>
                                <blockquote className="border-l-4 border-red-500/80 pl-4 pr-8">
                                    <p className="italic text-gray-300">"{item.clause}"</p>
                                </blockquote>
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-200">Our Analysis:</h4>
                                    <p className="text-sm text-gray-400 mt-1">{item.explanation}</p>
                                    <p className="text-sm mt-2">
                                        <strong className="text-gray-300">Potential Risk:</strong> <span className={`${getRiskColor(item.risk)} font-medium`}>{item.risk}</span>
                                    </p>
                                </div>
                                <ClauseRewrite clause={item} />
                            </li>
                        ))}
                    </ul>
                </Section>
            )}
        </div>
    );
};

export default StructuredResultDisplay;
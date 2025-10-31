// FIX: Import React to resolve namespace errors on line 52.
import type React from 'react';

export type Page = 'landing' | 'demystifier' | 'history' | 'drafter' | 'guide' | 'translator' | 'privacy';

export interface KeyDate {
    date: string;
    description: string;
}

export interface RedFlagClause {
    clause: string;
    explanation: string;
    risk: string;
}

export interface ActionableNextStep {
    category: string;
    step: string;
}

export interface AnalysisResult {
    summary: string;
    keyDates: KeyDate[];
    redFlags: RedFlagClause[];
    actionableNextSteps: ActionableNextStep[];
    acceptanceScore: number;
    scoreJustification: string;
    potentialScore: number;
    potentialScoreJustification: string;
}

export interface Message {
    role: 'user' | 'model';
    content: string;
}

// --- New Unified History System ---
export type HistoryItemType = 'analysis' | 'translation' | 'draft' | 'guide';

interface BaseHistoryItem {
    id: number; // Using timestamp for unique ID and sorting
    type: HistoryItemType;
}

export interface AnalysisHistoryItem extends BaseHistoryItem {
    type: 'analysis';
    fileName: string;
    analysisResult: AnalysisResult;
}

export interface TranslationHistoryItem extends BaseHistoryItem {
    type: 'translation';
    fileName: string;
    targetLanguage: string;
    translatedText: string;
}

export interface DraftHistoryItem extends BaseHistoryItem {
    type: 'draft';
    contractType: string;
    draftedContract: string;
}

export interface GuideHistoryItem extends BaseHistoryItem {
    type: 'guide';
    title: string;
    conversation: Message[];
}

export type HistoryItem = AnalysisHistoryItem | TranslationHistoryItem | DraftHistoryItem | GuideHistoryItem;

// FIX: Create a new type for history item creation to fix issues with Omit on discriminated unions.
// This defines the shape of a history item before it gets an 'id'.
export type HistoryItemForCreation = 
    | Omit<AnalysisHistoryItem, 'id'>
    | Omit<TranslationHistoryItem, 'id'>
    | Omit<DraftHistoryItem, 'id'>
    | Omit<GuideHistoryItem, 'id'>;
// --- End New Unified History System ---


export interface FormField {
    key: string;
    label: string;
    placeholder: string;
    type?: 'text' | 'textarea';
}

export interface ContractTypeConfig {
    key: string;
    name: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    fields: FormField[];
}
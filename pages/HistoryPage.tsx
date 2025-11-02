import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/historyService';
import { authService } from '../services/authService';
import type { HistoryItem, Page } from '../types';
import { HistoryIcon, DemystifierIcon, TranslatorIcon, DrafterIcon, GuideIcon } from '../components/icons';

interface HistoryPageProps {
  onViewHistoryItem: (item: HistoryItem) => void;
  onNavigate: (page: Page) => void;
}

const HistoryItemCard: React.FC<{ item: HistoryItem, onView: (item: HistoryItem) => void }> = ({ item, onView }) => {
    
    const getIcon = () => {
        switch(item.type) {
            case 'analysis': return <DemystifierIcon className="w-8 h-8 mr-4 text-cyan-400" />;
            case 'translation': return <TranslatorIcon className="w-8 h-8 mr-4 text-purple-400" />;
            case 'draft': return <DrafterIcon className="w-8 h-8 mr-4 text-amber-400" />;
            case 'guide': return <GuideIcon className="w-8 h-8 mr-4 text-green-400" />;
            default: return <HistoryIcon className="w-8 h-8 mr-4 text-gray-500" />;
        }
    };

    const getTitle = () => {
        switch(item.type) {
            case 'analysis': return item.fileName;
            case 'translation': return `${item.fileName} -> ${item.targetLanguage}`;
            case 'draft': return item.contractType;
            case 'guide': return item.title;
            default: return "History Item";
        }
    };

    const getDescription = () => {
        const date = new Date(item.id).toLocaleString();
        switch(item.type) {
            case 'analysis': return `Analyzed on: ${date}`;
            case 'translation': return `Translated on: ${date}`;
            case 'draft': return `Drafted on: ${date}`;
            case 'guide': return `Conversation from: ${date}`;
            default: return `Created on: ${date}`;
        }
    }

    const handleClick = () => {
      console.log('History item clicked:', item.type, item); // Debug
      onView(item);
    };

    return (
        <div
          onClick={handleClick}
          className="flex items-center p-4 rounded-lg bg-gray-800/50 border border-gray-800 cursor-pointer hover:bg-gray-800 hover:border-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-200"
        >
            {getIcon()}
            <div className="flex-grow">
                <p className="font-semibold text-gray-200">{getTitle()}</p>
                <p className="text-sm text-gray-500">{getDescription()}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
    );
}


const HistoryPage: React.FC<HistoryPageProps> = ({ onViewHistoryItem, onNavigate }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = () => {
    const user = authService.getUser();
    const userId = user?.id || null;
    setHistory(getHistory(userId));
  };

  useEffect(() => {
    loadHistory();
    // Refresh history every 2 seconds when page is visible (for real-time updates)
    const interval = setInterval(() => {
      loadHistory();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {history.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-lg border-2 border-dashed border-gray-800">
          <HistoryIcon className="w-12 h-12 mx-auto text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-300 mt-4">No History Yet</h2>
          <p className="text-gray-500 mt-2">
            Your activities like document analyses, translations, and drafts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <HistoryItemCard key={item.id} item={item} onView={onViewHistoryItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
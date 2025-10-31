
import React, { useState } from 'react';
import type { Page, HistoryItem } from '../types';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import DemystifierPage from '../pages/DemystifierPage';
import HistoryPage from '../pages/HistoryPage';
import ContractDrafterPage from '../pages/ContractDrafterPage';
import DocumentGuidePage from '../pages/DocumentGuidePage';
import TranslatorPage from '../pages/TranslatorPage';

interface SharedLayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const SharedLayout: React.FC<SharedLayoutProps> = ({ currentPage, onNavigate }) => {
  const [historyItemToView, setHistoryItemToView] = useState<HistoryItem | null>(null);

  const handleViewHistoryItem = (item: HistoryItem) => {
    setHistoryItemToView(item);
    // Navigate to the correct page based on the item type
    switch (item.type) {
      case 'analysis':
        onNavigate('demystifier');
        break;
      case 'translation':
        onNavigate('translator');
        break;
      case 'draft':
        onNavigate('drafter');
        break;
      case 'guide':
        onNavigate('guide');
        break;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'demystifier':
        return <DemystifierPage 
            key={historyItemToView?.id || 'new'} 
            historyItem={historyItemToView?.type === 'analysis' ? historyItemToView : null} 
            onViewHistoryItem={setHistoryItemToView} 
        />;
      case 'history':
        return <HistoryPage onViewHistoryItem={handleViewHistoryItem} onNavigate={onNavigate} />;
      case 'drafter':
        return <ContractDrafterPage 
            key={historyItemToView?.id || 'new'}
            historyItem={historyItemToView?.type === 'draft' ? historyItemToView : null}
            onViewHistoryItem={setHistoryItemToView}
        />;
      case 'guide':
        return <DocumentGuidePage 
            key={historyItemToView?.id || 'new'}
            historyItem={historyItemToView?.type === 'guide' ? historyItemToView : null}
            onViewHistoryItem={setHistoryItemToView}
        />;
      case 'translator':
        return <TranslatorPage 
            key={historyItemToView?.id || 'new'}
            historyItem={historyItemToView?.type === 'translation' ? historyItemToView : null}
            onViewHistoryItem={setHistoryItemToView}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200">
        <div className="relative w-full overflow-hidden flex-grow">
            <div className="absolute inset-0 gradient-bg-alt"></div>
            <div className="relative z-10 flex flex-col h-full">
                <header className="py-4">
                    <Navbar currentPage={currentPage} onNavigate={onNavigate} />
                </header>
    
                <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col">
                    <PageHeader currentPage={currentPage} />
                    <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 sm:p-8 flex-grow flex flex-col">
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
        <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default SharedLayout;
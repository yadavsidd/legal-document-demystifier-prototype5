
import React, { useState, useEffect } from 'react';
import type { Page, HistoryItem, AnalysisHistoryItem, TranslationHistoryItem, DraftHistoryItem, GuideHistoryItem } from '../types';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import DemystifierPage from '../pages/DemystifierPage';
import HistoryPage from '../pages/HistoryPage';
import ContractDrafterPage from '../pages/ContractDrafterPage';
import DocumentGuidePage from '../pages/DocumentGuidePage';
import TranslatorPage from '../pages/TranslatorPage';

import type { User } from '../services/authService';

interface SharedLayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAuthenticated?: boolean;
  user?: User | null;
  onLogout?: () => void;
}

const SharedLayout: React.FC<SharedLayoutProps> = ({ 
  currentPage, 
  onNavigate, 
  isAuthenticated = false,
  user = null,
  onLogout = () => {}
}) => {
  const [historyItemToView, setHistoryItemToView] = useState<HistoryItem | null>(null);

  // Clear history item when navigating away from history page (unless navigating to view the item)
  useEffect(() => {
    if (currentPage === 'history') {
      // Don't clear when on history page
      return;
    }
    
    // Clear history item if we're not viewing it anymore (navigated to different section)
    const isViewingHistoryItem = 
      (currentPage === 'demystifier' && historyItemToView?.type === 'analysis') ||
      (currentPage === 'translator' && historyItemToView?.type === 'translation') ||
      (currentPage === 'drafter' && historyItemToView?.type === 'draft') ||
      (currentPage === 'guide' && historyItemToView?.type === 'guide');
    
    if (!isViewingHistoryItem && historyItemToView) {
      // User navigated to a different page without clicking a history item
      setHistoryItemToView(null);
    }
  }, [currentPage, historyItemToView]);

  const handleViewHistoryItem = (item: HistoryItem) => {
    console.log('Viewing history item:', item.type, item); // Debug log
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
      default:
        console.warn('Unknown history item type:', item);
        // Default to demystifier if type is unknown (shouldn't happen)
        onNavigate('demystifier');
        break;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'demystifier':
        console.log('Rendering demystifier page, historyItem type:', historyItemToView?.type); // Debug
        return <DemystifierPage 
            key={historyItemToView?.id || 'new'} 
            historyItem={historyItemToView?.type === 'analysis' ? (historyItemToView as AnalysisHistoryItem) : null} 
            onViewHistoryItem={setHistoryItemToView} 
        />;
      case 'history':
        return <HistoryPage onViewHistoryItem={handleViewHistoryItem} onNavigate={onNavigate} />;
      case 'drafter':
        console.log('Rendering drafter page, historyItem type:', historyItemToView?.type); // Debug
        return <ContractDrafterPage 
            key={historyItemToView?.id || 'new'}
            historyItem={historyItemToView?.type === 'draft' ? (historyItemToView as DraftHistoryItem) : null}
            onViewHistoryItem={setHistoryItemToView}
        />;
      case 'guide':
        console.log('Rendering guide page, historyItem type:', historyItemToView?.type); // Debug
        return <DocumentGuidePage 
            key={historyItemToView?.id || 'new'}
            historyItem={historyItemToView?.type === 'guide' ? (historyItemToView as GuideHistoryItem) : null}
            onViewHistoryItem={setHistoryItemToView}
        />;
      case 'translator':
        console.log('Rendering translator page, historyItem type:', historyItemToView?.type); // Debug
        return <TranslatorPage 
            key={historyItemToView?.id || 'new'}
            historyItem={historyItemToView?.type === 'translation' ? (historyItemToView as TranslationHistoryItem) : null}
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
                    <Navbar 
                      currentPage={currentPage} 
                      onNavigate={onNavigate}
                      isAuthenticated={isAuthenticated}
                      userName={user?.name || ''}
                      userEmail={user?.email || ''}
                      onLogout={onLogout}
                    />
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
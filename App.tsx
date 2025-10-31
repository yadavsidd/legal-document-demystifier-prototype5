
import React, { useState, useCallback } from 'react';
import LandingPage from './pages/LandingPage';
// FIX: Corrected import path for SharedLayout
import SharedLayout from './layouts/SharedLayout';
import PrivacyPage from './pages/PrivacyPage';
import type { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'privacy':
        return <PrivacyPage onNavigate={navigate} />;
      default:
        return (
          <SharedLayout 
            currentPage={currentPage}
            onNavigate={navigate} 
          />
        );
    }
  }

  return (
    <>
      {renderCurrentPage()}
    </>
  );
};

export default App;

import React, { useState, useCallback, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
// FIX: Corrected import path for SharedLayout
import SharedLayout from './layouts/SharedLayout';
import PrivacyPage from './pages/PrivacyPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import type { Page } from './types';
import { authService, type User } from './services/authService';

// Protected routes that require authentication
const PROTECTED_ROUTES: Page[] = ['demystifier', 'translator', 'drafter', 'guide', 'history'];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const verifiedUser = await authService.verifyToken();
          if (verifiedUser) {
            setIsAuthenticated(true);
            setUser(verifiedUser);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const navigate = useCallback((page: Page) => {
    // Check if route is protected and user is not authenticated
    if (PROTECTED_ROUTES.includes(page) && !isAuthenticated && !checkingAuth) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  }, [isAuthenticated, checkingAuth]);

  const handleLoginSuccess = useCallback(() => {
    const loggedInUser = authService.getUser();
    setIsAuthenticated(true);
    setUser(loggedInUser);
    // Redirect to demystifier after successful login
    setCurrentPage('demystifier');
  }, []);

  const handleSignupSuccess = useCallback(() => {
    const signedUpUser = authService.getUser();
    setIsAuthenticated(true);
    setUser(signedUpUser);
    // Redirect to demystifier after successful signup
    setCurrentPage('demystifier');
  }, []);

  const handleLogout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('landing');
  }, []);

  const renderCurrentPage = () => {
    // Show loading while checking authentication
    if (checkingAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-white text-xl">Loading...</div>
        </div>
      );
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage 
          onNavigate={navigate} 
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />;
      case 'privacy':
        return <PrivacyPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />;
      case 'signup':
        return <SignupPage onNavigate={navigate} onSignupSuccess={handleSignupSuccess} />;
      default:
        // Protect routes - redirect to login if not authenticated
        if (PROTECTED_ROUTES.includes(currentPage) && !isAuthenticated) {
          return <LoginPage onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />;
        }
        return (
          <SharedLayout 
            currentPage={currentPage}
            onNavigate={navigate}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
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

import React from 'react';
import type { Page } from '../types';
import { DemystifyIcon } from './icons';
import UserProfileDropdown from './UserProfileDropdown';

interface NavbarProps {
  currentPage?: Page;
  onNavigate: (page: Page) => void;
  className?: string;
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate, 
  className, 
  isAuthenticated = false,
  userName = '',
  userEmail = '',
  onLogout = () => {}
}) => {
    const navItems = [
        { page: 'demystifier' as Page, label: 'Demystifier' },
        { page: 'translator' as Page, label: 'Translator' },
        { page: 'drafter' as Page, label: 'Drafter' },
        { page: 'guide' as Page, label: 'Guide' },
        { page: 'history' as Page, label: 'History' },
    ];

    return (
        <nav className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-xl ${className || ''}`}>
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => onNavigate('landing')} 
                    type="button"
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity select-none"
                >
                    <DemystifyIcon className="w-8 h-8 text-white" />
                    <span className="text-xl font-bold text-white">Demystify</span>
                </button>
                <div className="hidden lg:flex items-center space-x-8">
                    {navItems.map(item => (
                         <button
                            key={item.page}
                            onClick={() => onNavigate(item.page)}
                            type="button"
                            className={`cursor-pointer transition-all duration-200 px-3 py-2 rounded-lg select-none ${currentPage === item.page ? 'text-cyan-400 font-semibold bg-cyan-400/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                {/* Show profile dropdown if authenticated, else show Get Started button */}
                {isAuthenticated && userName ? (
                    <div className="hidden lg:block">
                        <UserProfileDropdown
                            userName={userName}
                            userEmail={userEmail}
                            onLogout={onLogout}
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => onNavigate('signup')}
                        type="button"
                        className="hidden lg:block px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer select-none"
                    >
                        Get Started
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

import React from 'react';
import type { Page } from '../types';
import { DemystifyIcon } from './icons';

interface NavbarProps {
  currentPage?: Page;
  onNavigate: (page: Page) => void;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, className }) => {
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
                <button onClick={() => onNavigate('landing')} className="flex items-center space-x-2">
                    <DemystifyIcon className="w-8 h-8 text-white" />
                    <span className="text-xl font-bold text-white">Demystify</span>
                </button>
                <div className="hidden lg:flex items-center space-x-8">
                    {navItems.map(item => (
                         <button
                            key={item.page}
                            onClick={() => onNavigate(item.page)}
                            className={`transition-colors ${currentPage === item.page ? 'text-cyan-400 font-semibold' : 'text-gray-400 hover:text-white'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => onNavigate('demystifier')}
                    className="hidden lg:block px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                >
                    Get Started
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
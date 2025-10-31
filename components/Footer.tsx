import React from 'react';
import type { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-white/10 mt-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 text-sm">
        <p className="max-w-3xl mx-auto">
          Disclaimer: This tool provides an AI-generated summary and is for informational purposes only. It is not a substitute for professional legal advice.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span>&copy; {new Date().getFullYear()} Demystify. All rights reserved.</span>
          <span className="hidden sm:inline text-gray-700">|</span>
          <button onClick={() => onNavigate('privacy')} className="hover:text-cyan-400 hover:underline transition-colors">
            Privacy & Security
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
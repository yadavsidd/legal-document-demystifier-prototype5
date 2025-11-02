
import React, { useEffect, useRef, useState } from 'react';
import type { Page } from '../types';
import { DemystifierIcon, DrafterIcon, GuideIcon, TranslatorIcon } from '../components/icons';
import Footer from '../components/Footer';
import ProductTour from '../components/ProductTour';
// FIX: Import the reusable Navbar component
import Navbar from '../components/Navbar';

import type { User } from '../services/authService';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  isAuthenticated?: boolean;
  user?: User | null;
  onLogout?: () => void;
}

// FIX: Removed the local Navbar component definition, as it's now a reusable component.

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="group relative p-8 rounded-2xl bg-gray-900/80 border border-white/10 cursor-pointer overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
  >
    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"></div>
    <div className="relative">
      <div className="mb-4 text-cyan-400">{icon}</div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 mt-3 leading-relaxed">{description}</p>
    </div>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate, 
  isAuthenticated = false,
  user = null,
  onLogout = () => {}
}) => {
    const [showTour, setShowTour] = useState(false);
    
    const features = [
        { page: 'demystifier' as Page, icon: <DemystifierIcon className="w-12 h-12" />, title: 'Document Demystifier', description: 'Upload any legal document to get a simple summary, identify red flags, and understand key clauses.' },
        { page: 'translator' as Page, icon: <TranslatorIcon className="w-12 h-12" />, title: 'Document Translator', description: 'Instantly translate your documents into various languages while preserving context and formatting.' },
        { page: 'drafter' as Page, icon: <DrafterIcon className="w-12 h-12" />, title: 'Contract Drafter', description: 'Generate basic contracts and agreements by simply filling out a form with your key details.' },
        { page: 'guide' as Page, icon: <GuideIcon className="w-12 h-12" />, title: 'Document Guide', description: 'Get step-by-step assistance with official procedures like passport applications or visa requirements.' },
    ];
    
    const sectionsRef = useRef<Array<HTMLElement | null>>([]);
    
    useEffect(() => {
        const tourCompleted = localStorage.getItem('demystify_tour_completed');
        if (tourCompleted !== 'true') {
            setShowTour(true);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        sectionsRef.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
             sectionsRef.current.forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

  const handleCloseTour = () => {
    setShowTour(false);
    localStorage.setItem('demystify_tour_completed', 'true');
  };

  return (
    <div className="min-h-screen text-gray-200">
      {showTour && <ProductTour onClose={handleCloseTour} />}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 gradient-bg"></div>
        <div className="relative z-10">
            <header className="fixed top-0 left-0 right-0 z-50">
                {/* FIX: Use the imported Navbar component */}
                <Navbar 
                  onNavigate={onNavigate} 
                  className="mt-4"
                  isAuthenticated={isAuthenticated}
                  userName={user?.name || ''}
                  userEmail={user?.email || ''}
                  onLogout={onLogout}
                />
            </header>
            
            <main className="pt-40">
                {/* Hero Section */}
                <section ref={el => { sectionsRef.current[0] = el; }} className="fade-in-up text-center container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter leading-tight">
                        Legal Clarity at Your Fingertips
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                        Demystify uses advanced AI to demystify complex legal documents. Analyze, translate, and draft with unparalleled confidence and ease.
                    </p>
                    <button 
                        onClick={() => onNavigate('signup')}
                        className="mt-10 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 relative overflow-hidden"
                    >
                         <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                        Get Started for Free
                    </button>
                </section>

                 {/* How It Works Section */}
                <section ref={el => { sectionsRef.current[1] = el; }} className="fade-in-up container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white">How It Works</h2>
                        <p className="mt-3 text-gray-400">Simplify your legal documents in three easy steps.</p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto text-3xl font-bold">1</div>
                            <h3 className="mt-6 text-xl font-semibold text-white">Upload Your Document</h3>
                            <p className="mt-2 text-gray-400">Securely upload any text, PDF, or image file. Your data is never stored.</p>
                        </div>
                         <div className="p-6">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto text-3xl font-bold">2</div>
                            <h3 className="mt-6 text-xl font-semibold text-white">Receive AI Analysis</h3>
                            <p className="mt-2 text-gray-400">Get an instant, easy-to-understand breakdown of key clauses, risks, and deadlines.</p>
                        </div>
                         <div className="p-6">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto text-3xl font-bold">3</div>
                            <h3 className="mt-6 text-xl font-semibold text-white">Take Action</h3>
                            <p className="mt-2 text-gray-400">Use your actionable next steps and clear summaries to make informed decisions.</p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section ref={el => { sectionsRef.current[2] = el; }} className="fade-in-up container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white">A Full Suite of Tools</h2>
                        <p className="mt-3 text-gray-400">Everything you need to handle your documents with confidence.</p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature) => (
                            <FeatureCard
                            key={feature.page}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            onClick={() => onNavigate(feature.page)}
                            />
                        ))}
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
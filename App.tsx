import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OCRProcessor } from './components/OCRProcessor';
import { Pricing } from './components/Pricing';
import { AppState } from './types';

const App: React.FC = () => {
  // State for credits (persisted in local storage for demo purposes)
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('ocr_app_credits');
    return saved ? parseInt(saved, 10) : 5; // Start with 5 free credits
  });

  const [currentPage, setCurrentPage] = useState<AppState>(AppState.HOME);

  // Persist credits whenever they change
  useEffect(() => {
    localStorage.setItem('ocr_app_credits', credits.toString());
  }, [credits]);

  const deductCredit = (): boolean => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      return true;
    }
    return false;
  };

  const addCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/10 font-sans">
      <Header credits={credits} setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        
        <div className="relative flex-1 flex flex-col z-10">
          {currentPage === AppState.HOME && (
            <OCRProcessor 
              credits={credits} 
              deductCredit={deductCredit} 
              setCurrentPage={setCurrentPage}
            />
          )}
          
          {currentPage === AppState.PRICING && (
            <Pricing 
              addCredits={addCredits} 
              setCurrentPage={setCurrentPage} 
            />
          )}
        </div>
      </main>

      {currentPage === AppState.PRICING && (
        <footer className="py-6 border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto">
          <div className="container flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground px-4 md:px-8">
            <p>&copy; 2024 TextExtract Pro. Powered by Gemini 2.5.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
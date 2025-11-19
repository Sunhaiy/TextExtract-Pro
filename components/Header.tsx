import React from 'react';
import { ScanText, Coins, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { AppState } from '../types';

interface HeaderProps {
  credits: number;
  setCurrentPage: (page: AppState) => void;
}

export const Header: React.FC<HeaderProps> = ({ credits, setCurrentPage }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage(AppState.HOME)}>
          <div className="h-8 w-8 bg-primary text-primary-foreground rounded flex items-center justify-center">
            <ScanText size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">TextExtract Pro</span>
        </div>

        <div className="flex items-center gap-4">
          <div 
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm font-medium text-secondary-foreground cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={() => setCurrentPage(AppState.PRICING)}
          >
            <Coins size={16} className="text-yellow-600" />
            <span>{credits} Credits</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="md:hidden"
            onClick={() => setCurrentPage(AppState.PRICING)}
          >
            <Coins size={16} className="mr-2 text-yellow-600" />
            {credits}
          </Button>

          <Button variant="ghost" size="icon">
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};
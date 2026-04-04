/* DISABLED BROKEN DEPENDENCY: PricingContext (STEP 3)
Original content commented out to fix app startup.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PricingContextType {
  searchesThisMonth: number;
  maxFreeSearches: 5;
  isOverLimit: boolean;
  recordSearch: () => void;
  upgrade: () => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within PricingProvider');
  }
  return context;
};

interface PricingProviderProps {
  children: ReactNode;
}

export const PricingProvider: React.FC<PricingProviderProps> = ({ children }) => {
  const [searchesThisMonth, setSearchesThisMonth] = useState(0);
  const maxFreeSearches = 5;

  useEffect(() => {
    const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
    const saved = localStorage.getItem(`niti_searches_${monthKey}`);
    setSearchesThisMonth(saved ? parseInt(saved) : 0);
  }, []);

  const recordSearch = () => {
    const monthKey = new Date().toISOString().slice(0, 7);
    const newCount = searchesThisMonth + 1;
    setSearchesThisMonth(newCount);
    localStorage.setItem(`niti_searches_${monthKey}`, newCount.toString());
  };

  const upgrade = () => {
    // Stripe/Clerk integration stub
    window.open('https://example.com/pricing', '_blank');
  };

  const isOverLimit = searchesThisMonth >= maxFreeSearches;

  return (
    <PricingContext.Provider value={{
      searchesThisMonth,
      maxFreeSearches,
      isOverLimit,
      recordSearch,
      upgrade
    }}>
      {children}
    </PricingContext.Provider>
  );
};
*/ 


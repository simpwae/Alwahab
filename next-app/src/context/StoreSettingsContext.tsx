"use client";

import React, { useState, createContext, useContext , ReactNode } from 'react';
import { storeSettings as initialSettings } from '../data/storeSettings';

type StoreSettings = typeof initialSettings;

interface StoreSettingsContextValue {
  settings: StoreSettings;
  updateSettings: (patch: Partial<StoreSettings>) => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextValue | undefined>(
  undefined
);

export function StoreSettingsProvider({ children }: {children: ReactNode;}) {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);

  const updateSettings = (patch: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </StoreSettingsContext.Provider>);

}

export function useStoreSettings() {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx) {
    throw new Error('useStoreSettings must be used within StoreSettingsProvider');
  }
  return ctx;
}

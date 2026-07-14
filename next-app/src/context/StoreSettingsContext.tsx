"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createClient } from '../lib/supabase/client';

// Reads are public (anon key is fine); writes require an authenticated admin
// (RLS: store_settings_write_admin checks is_admin()), so this context talks
// to the admin-keyed client rather than the customer one.
const supabase = createClient('alwahab-admin-auth');

interface StoreSettings {
  bankTransfer: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branchCode: string;
  };
  shipping: {
    flatRate: number;
    freeShippingThreshold: number;
  };
}

const DEFAULT_SETTINGS: StoreSettings = {
  bankTransfer: { bankName: '', accountTitle: '', accountNumber: '', iban: '', branchCode: '' },
  shipping: { flatRate: 0, freeShippingThreshold: 0 }
};

interface SettingsRow {
  bank_name: string;
  account_title: string;
  account_number: string;
  iban: string;
  branch_code: string;
  flat_rate: number;
  free_shipping_threshold: number;
}

function fromRow(row: SettingsRow): StoreSettings {
  return {
    bankTransfer: {
      bankName: row.bank_name,
      accountTitle: row.account_title,
      accountNumber: row.account_number,
      iban: row.iban,
      branchCode: row.branch_code
    },
    shipping: {
      flatRate: row.flat_rate,
      freeShippingThreshold: row.free_shipping_threshold
    }
  };
}

function toRow(settings: StoreSettings): SettingsRow {
  return {
    bank_name: settings.bankTransfer.bankName,
    account_title: settings.bankTransfer.accountTitle,
    account_number: settings.bankTransfer.accountNumber,
    iban: settings.bankTransfer.iban,
    branch_code: settings.bankTransfer.branchCode,
    flat_rate: settings.shipping.flatRate,
    free_shipping_threshold: settings.shipping.freeShippingThreshold
  };
}

interface StoreSettingsContextValue {
  settings: StoreSettings;
  updateSettings: (patch: Partial<StoreSettings>) => Promise<string | null>;
}

const StoreSettingsContext = createContext<StoreSettingsContextValue | undefined>(
  undefined
);

export function StoreSettingsProvider({ children }: {children: ReactNode;}) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    supabase.from('store_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setSettings(fromRow(data as SettingsRow));
    });
  }, []);

  const updateSettings = async (patch: Partial<StoreSettings>) => {
    const next: StoreSettings = {
      bankTransfer: { ...settings.bankTransfer, ...patch.bankTransfer },
      shipping: { ...settings.shipping, ...patch.shipping }
    };
    const { error } = await supabase.from('store_settings').update(toRow(next)).eq('id', 1);
    if (error) return error.message;
    setSettings(next);
    return null;
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

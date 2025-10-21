import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gulfCurrencies, mockTransactions, portfolios } from '@/data/mockData';

// Currency precision mapping
const currencyDecimals: Record<string, number> = { 
  USD: 2, SAR: 2, AED: 2, QAR: 2, OMR: 2, KWD: 3, BHD: 3 
};

// Helper functions for currency formatting
export const dp = (c: string) => currencyDecimals[c] ?? 2;
export const fmt = (n: number, c?: string) => {
  const store = useGulfAcornsStore.getState();
  const currency = c || store.currency;
  return Number(n.toFixed(dp(currency)));
};

// Types
export type Language = 'en' | 'ar';
export type CurrencyCode = 'SAR' | 'AED' | 'OMR' | 'BHD' | 'KWD' | 'QAR' | 'USD';
export type RuleType = 'roundup' | 'fixed' | 'percent';

export interface SimulatedPurchase {
  id: string;
  amount: number;
  description: string;
  date: Date;
  roundUp: number;
  category: string;
}

export interface PendingInvestment {
  id: string;
  amount: number;
  date: Date;
  source: 'roundup' | 'manual';
}

export interface InvestmentRule {
  type: RuleType;
  value: number;
  multiplier: number;
}

// Store interface
interface GulfAcornsStore {
  // Language & Currency
  language: Language;
  currency: CurrencyCode;
  isRTL: boolean;
  
  // Investment Rules
  ruleType: RuleType;
  ruleValue: number;
  ruleMultiplier: number;
  
  // Simulated Data
  simulatedPurchases: SimulatedPurchase[];
  pendingSpare: number;
  totalInvested: number;
  totalReturns: number;
  
  // Pending Investments
  pendingInvestments: PendingInvestment[];
  
  // Actions
  setLanguage: (language: Language) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setRuleType: (type: RuleType) => void;
  setRuleValue: (value: number) => void;
  setRuleMultiplier: (multiplier: number) => void;
  addSimulatedPurchase: (purchase: Omit<SimulatedPurchase, 'id' | 'roundUp'>) => Promise<void>;
  addPendingInvestment: (amount: number, source: 'roundup' | 'manual') => void;
  investNow: () => Promise<void>;
  clearPendingInvestments: () => void;
  resetDemo: () => void;
  refreshFromAPI: () => Promise<void>;
  
  // Computed values
  getCurrencySymbol: () => string;
  getTotalBalance: () => number;
  getTodayRoundUps: () => number;
}

// Helper functions
const calculateRoundUp = (amount: number, rule: InvestmentRule, currency: string): number => {
  let roundUp = 0;
  
  switch (rule.type) {
    case 'roundup': {
      const remainder = amount % rule.value;
      roundUp = remainder === 0 ? 0 : rule.value - remainder;
      break;
    }
    case 'percent': {
      roundUp = amount * (rule.value / 100);
      break;
    }
    case 'fixed': {
      roundUp = rule.value;
      break;
    }
  }
  
  // Apply multiplier and format with correct decimal places
  const spare = roundUp * (rule.multiplier || 1);
  return fmt(spare, currency);
};

// Store implementation
export const useGulfAcornsStore = create<GulfAcornsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      language: 'en',
      currency: 'SAR',
      isRTL: false,
      ruleType: 'roundup',
      ruleValue: 5,
      ruleMultiplier: 2,
      simulatedPurchases: [],
      pendingSpare: 0,
      totalInvested: 2847.50,
      totalReturns: 284.75,
      pendingInvestments: [],

      // Actions
      setLanguage: (language) => {
        set({ 
          language, 
          isRTL: language === 'ar' 
        });
      },

      setCurrency: (currency) => {
        set({ currency });
      },

      setRuleType: (ruleType) => {
        set({ ruleType });
      },

      setRuleValue: (ruleValue) => {
        set({ ruleValue });
      },

      setRuleMultiplier: (ruleMultiplier) => {
        set({ ruleMultiplier });
      },

      addSimulatedPurchase: async (purchase) => {
        try {
          // Try API first
          const response = await fetch('/api/purchases', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              merchant: purchase.description,
              amount: purchase.amount,
              currency: get().currency,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Refresh data from API
            await get().refreshFromAPI();
            return;
          }
        } catch (error) {
          console.warn('API call failed, falling back to client state:', error);
        }

        // Fallback to client state
        const state = get();
        const rule: InvestmentRule = {
          type: state.ruleType,
          value: state.ruleValue,
          multiplier: state.ruleMultiplier
        };
        
        const roundUp = calculateRoundUp(purchase.amount, rule, state.currency);
        const newPurchase: SimulatedPurchase = {
          ...purchase,
          id: `purchase_${Date.now()}`,
          roundUp
        };

        set((state) => ({
          simulatedPurchases: [newPurchase, ...state.simulatedPurchases],
          pendingSpare: state.pendingSpare + roundUp
        }));
      },

      addPendingInvestment: (amount, source) => {
        const newInvestment: PendingInvestment = {
          id: `investment_${Date.now()}`,
          amount,
          date: new Date(),
          source
        };

        set((state) => ({
          pendingInvestments: [...state.pendingInvestments, newInvestment]
        }));
      },

      investNow: async () => {
        try {
          // Try API first
          const response = await fetch('/api/invest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              portfolio: 'balanced',
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Refresh data from API
            await get().refreshFromAPI();
            return;
          }
        } catch (error) {
          console.warn('API call failed, falling back to client state:', error);
        }

        // Fallback to client state
        const state = get();
        const totalPending = state.pendingInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        const totalRoundUps = state.simulatedPurchases.reduce((sum, purchase) => sum + purchase.roundUp, 0);
        
        if (totalPending > 0 || totalRoundUps > 0) {
          set((state) => ({
            totalInvested: state.totalInvested + totalPending + totalRoundUps,
            pendingSpare: 0,
            pendingInvestments: [],
            simulatedPurchases: state.simulatedPurchases.map(p => ({ ...p, roundUp: 0 }))
          }));
        }
      },

      clearPendingInvestments: () => {
        set({
          pendingInvestments: [],
          pendingSpare: 0
        });
      },

      resetDemo: () => {
        set({
          simulatedPurchases: [],
          pendingSpare: 0,
          pendingInvestments: [],
          totalInvested: 2847.50,
          totalReturns: 284.75
        });
      },

      refreshFromAPI: async () => {
        try {
          const response = await fetch('/api/feed');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const { purchases, investLots, pendingAmount, totalInvested, rule } = data.data;
              
              set({
                simulatedPurchases: purchases.map((p: any) => ({
                  id: p.id,
                  amount: p.amount,
                  description: p.merchant,
                  date: new Date(p.createdAt),
                  roundUp: p.roundup,
                  category: 'food'
                })),
                pendingSpare: pendingAmount,
                totalInvested: totalInvested,
                ruleType: rule?.type || 'roundup',
                ruleValue: rule?.value || 1,
                ruleMultiplier: rule?.multiplier || 1,
                currency: rule?.currency || 'USD'
              });
            }
          }
        } catch (error) {
          console.warn('Failed to refresh from API:', error);
        }
      },

      // Computed values
      getCurrencySymbol: () => {
        const currency = gulfCurrencies.find(c => c.code === get().currency);
        return currency?.symbol || get().currency;
      },

      getTotalBalance: () => {
        const state = get();
        return state.totalInvested + state.totalReturns + state.pendingSpare;
      },

      getTodayRoundUps: () => {
        const state = get();
        const today = new Date().toDateString();
        return state.simulatedPurchases
          .filter(p => p.date.toDateString() === today)
          .reduce((sum, p) => sum + p.roundUp, 0);
      }
    }),
    {
      name: 'gulf-acorns-store',
      partialize: (state) => ({
        language: state.language,
        currency: state.currency,
        ruleType: state.ruleType,
        ruleValue: state.ruleValue,
        ruleMultiplier: state.ruleMultiplier,
        totalInvested: state.totalInvested,
        totalReturns: state.totalReturns
      })
    }
  )
);

// Translation helper
export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    overview: "Overview",
    roundUps: "Round-Ups",
    investments: "Investments",
    settings: "Settings",
    
    // Metrics
    totalBalance: "Total Balance",
    totalInvested: "Total Invested",
    totalReturns: "Total Returns",
    roundUpBalance: "Round-Up Balance",
    pendingSpare: "Pending Spare",
    monthlyGrowth: "Monthly Growth",
    
    // Actions
    addPurchase: "Add Purchase",
    investNow: "Invest Now",
    clearPending: "Clear Pending",
    resetDemo: "Reset Demo",
    
    // Forms
    purchaseAmount: "Purchase Amount",
    purchaseDescription: "Description",
    purchaseCategory: "Category",
    ruleType: "Rule Type",
    ruleValue: "Rule Value",
    ruleMultiplier: "Multiplier",
    
    // Rule Types
    roundup: "Round Up",
    fixed: "Fixed Amount",
    percent: "Percentage",
    
    // Categories
    food: "Food & Dining",
    groceries: "Groceries",
    transportation: "Transportation",
    shopping: "Shopping",
    entertainment: "Entertainment",
    utilities: "Utilities",
    
    // Status
    pending: "Pending",
    invested: "Invested",
    active: "Active",
    
    // Messages
    purchaseAdded: "Purchase added successfully!",
    investmentCompleted: "Investment completed!",
    demoReset: "Demo reset successfully!",
    
    // Currency Names
    SAR: "Saudi Riyal",
    AED: "UAE Dirham", 
    OMR: "Omani Rial",
    BHD: "Bahraini Dinar",
    KWD: "Kuwaiti Dinar",
    QAR: "Qatari Riyal",
    USD: "US Dollar"
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    overview: "نظرة عامة",
    roundUps: "التقريب",
    investments: "الاستثمارات",
    settings: "الإعدادات",
    
    // Metrics
    totalBalance: "إجمالي الرصيد",
    totalInvested: "إجمالي الاستثمار",
    totalReturns: "إجمالي العوائد",
    roundUpBalance: "رصيد التقريب",
    pendingSpare: "فكة معلقة",
    monthlyGrowth: "النمو الشهري",
    
    // Actions
    addPurchase: "إضافة مشتريات",
    investNow: "استثمر الآن",
    clearPending: "مسح المعلق",
    resetDemo: "إعادة تعيين العرض",
    
    // Forms
    purchaseAmount: "مبلغ المشتريات",
    purchaseDescription: "الوصف",
    purchaseCategory: "الفئة",
    ruleType: "نوع القاعدة",
    ruleValue: "قيمة القاعدة",
    ruleMultiplier: "المضاعف",
    
    // Rule Types
    roundup: "التقريب",
    fixed: "مبلغ ثابت",
    percent: "نسبة مئوية",
    
    // Categories
    food: "الطعام والمطاعم",
    groceries: "البقالة",
    transportation: "النقل",
    shopping: "التسوق",
    entertainment: "الترفيه",
    utilities: "المرافق",
    
    // Status
    pending: "معلق",
    invested: "مستثمر",
    active: "نشط",
    
    // Messages
    purchaseAdded: "تم إضافة المشتريات بنجاح!",
    investmentCompleted: "تم الاستثمار بنجاح!",
    demoReset: "تم إعادة تعيين العرض بنجاح!",
    
    // Currency Names
    SAR: "الريال السعودي",
    AED: "الدرهم الإماراتي",
    OMR: "الريال العماني", 
    BHD: "الدينار البحريني",
    KWD: "الدينار الكويتي",
    QAR: "الريال القطري",
    USD: "الدولار الأمريكي"
  }
};

export const getTranslation = (key: string, language: Language): string => {
  return translations[language][key as keyof typeof translations.en] || key;
};

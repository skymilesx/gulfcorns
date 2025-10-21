import { RoundUpRule, Transaction, Currency } from '@/data/mockData';

// Core business logic for Gulf Acorns platform

export class RoundUpEngine {
  static calculateRoundUp(amount: number, rule: RoundUpRule): number {
    let roundUp = 0;
    
    switch (rule.type) {
      case 'nearest': {
        const remainder = amount % rule.value;
        roundUp = remainder === 0 ? 0 : rule.value - remainder;
        break;
      }
      
      case 'percentage': {
        roundUp = amount * (rule.value / 100);
        break;
      }
      
      case 'fixed': {
        roundUp = rule.value;
        break;
      }
    }
    
    return Math.round(roundUp * rule.multiplier * 100) / 100;
  }

  static formatCurrency(amount: number, currencyCode: string, currencies: Currency[]): string {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return `${amount.toFixed(2)} ${currencyCode}`;
    
    return `${currency.symbol} ${amount.toFixed(2)}`;
  }

  static convertCurrency(amount: number, fromCurrency: string, toCurrency: string, currencies: Currency[]): number {
    const from = currencies.find(c => c.code === fromCurrency);
    const to = currencies.find(c => c.code === toCurrency);
    
    if (!from || !to) return amount;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount * from.exchangeRate;
    return usdAmount / to.exchangeRate;
  }

  static calculatePortfolioValue(investments: { [key: string]: number }, portfolioAssets: { symbol: string; currentPrice: number }[]): number {
    return portfolioAssets.reduce((total, asset) => {
      const shares = investments[asset.symbol] || 0;
      return total + (shares * asset.currentPrice);
    }, 0);
  }

  static calculateReturns(invested: number, currentValue: number): { amount: number; percentage: number } {
    const amount = currentValue - invested;
    const percentage = invested > 0 ? (amount / invested) * 100 : 0;
    return { amount, percentage };
  }

  static getInvestmentAllocation(totalAmount: number, portfolioAssets: { symbol: string; allocation: number; currentPrice: number }[]): { [key: string]: number } {
    const allocation: { [key: string]: number } = {};
    
    portfolioAssets.forEach(asset => {
      const assetAmount = totalAmount * (asset.allocation / 100);
      allocation[asset.symbol] = assetAmount / asset.currentPrice;
    });
    
    return allocation;
  }

  static generatePerformanceData(days: number = 30): { date: string; value: number }[] {
    const data = [];
    const startValue = 2500;
    let currentValue = startValue;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate realistic market movements
      const change = (Math.random() - 0.5) * 0.02; // ±1% daily change
      currentValue *= (1 + change);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(currentValue * 100) / 100
      });
    }
    
    return data;
  }
}

export class LanguageManager {
  static isRTL(language: string): boolean {
    return language === 'ar';
  }

  static getDirection(language: string): 'ltr' | 'rtl' {
    return this.isRTL(language) ? 'rtl' : 'ltr';
  }

  static formatNumber(num: number, language: string): string {
    if (language === 'ar') {
      // Convert to Arabic numerals
      const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
      return num.toString().replace(/\d/g, (d) => arabicNumerals[parseInt(d)]);
    }
    return num.toString();
  }
}

export class NotificationManager {
  static createRoundUpNotification(amount: number, currency: string): string {
    return `Round-up of ${currency} ${amount.toFixed(2)} added to your investment wallet!`;
  }

  static createInvestmentNotification(amount: number, portfolio: string): string {
    return `Successfully invested ${amount.toFixed(2)} into your ${portfolio} portfolio!`;
  }

  static createGoalAchievedNotification(goal: string): string {
    return `Congratulations! You've reached your ${goal} investment goal!`;
  }
}

// Utility functions for data management
export const StorageManager = {
  saveUserData: (key: string, data: Record<string, unknown>) => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  getUserData: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  clearUserData: (key: string) => {
    localStorage.removeItem(key);
  }
};
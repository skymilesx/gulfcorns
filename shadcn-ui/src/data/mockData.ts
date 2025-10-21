// Mock data for Gulf Acorns platform

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  exchangeRate: number; // to USD
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  roundUp: number;
  category: string;
}

export interface Portfolio {
  id: string;
  name: string;
  nameAr: string;
  type: 'conservative' | 'balanced' | 'aggressive' | 'gold' | 'shariah';
  description: string;
  descriptionAr: string;
  expectedReturn: number;
  risk: 'low' | 'medium' | 'high';
  assets: Asset[];
}

export interface Asset {
  symbol: string;
  name: string;
  nameAr: string;
  allocation: number;
  currentPrice: number;
  change24h: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  totalInvested: number;
  totalRoundUps: number;
  totalReturns: number;
  currency: string;
  roundUpRule: RoundUpRule;
  selectedPortfolio: string;
}

export interface RoundUpRule {
  type: 'nearest' | 'percentage' | 'fixed';
  value: number; // for nearest: 1,5,10; for percentage: 2,5,10; for fixed: any amount
  multiplier: number; // 1x, 2x, 3x
}

// Gulf region currencies
export const gulfCurrencies: Currency[] = [
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', country: 'Saudi Arabia', exchangeRate: 0.267 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', country: 'UAE', exchangeRate: 0.272 },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', country: 'Oman', exchangeRate: 2.597 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب', country: 'Bahrain', exchangeRate: 2.653 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', country: 'Kuwait', exchangeRate: 3.277 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', country: 'Qatar', exchangeRate: 0.275 },
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'USA', exchangeRate: 1.0 }
];

// Sample portfolios
export const portfolios: Portfolio[] = [
  {
    id: 'conservative',
    name: 'Conservative Growth',
    nameAr: 'النمو المحافظ',
    type: 'conservative',
    description: 'Low-risk portfolio focused on stability and capital preservation',
    descriptionAr: 'محفظة منخفضة المخاطر تركز على الاستقرار والحفاظ على رأس المال',
    expectedReturn: 4.5,
    risk: 'low',
    assets: [
      { symbol: 'GOVT', name: 'Government Bonds', nameAr: 'السندات الحكومية', allocation: 60, currentPrice: 25.4, change24h: 0.2 },
      { symbol: 'TIPS', name: 'Inflation Protected Securities', nameAr: 'الأوراق المحمية من التضخم', allocation: 25, currentPrice: 118.5, change24h: -0.1 },
      { symbol: 'VTI', name: 'Total Stock Market', nameAr: 'إجمالي سوق الأسهم', allocation: 15, currentPrice: 285.2, change24h: 1.2 }
    ]
  },
  {
    id: 'balanced',
    name: 'Balanced Portfolio',
    nameAr: 'المحفظة المتوازنة',
    type: 'balanced',
    description: 'Moderate risk with balanced exposure to stocks and bonds',
    descriptionAr: 'مخاطر معتدلة مع تعرض متوازن للأسهم والسندات',
    expectedReturn: 7.2,
    risk: 'medium',
    assets: [
      { symbol: 'VTI', name: 'Total Stock Market', nameAr: 'إجمالي سوق الأسهم', allocation: 50, currentPrice: 285.2, change24h: 1.2 },
      { symbol: 'VXUS', name: 'International Stocks', nameAr: 'الأسهم الدولية', allocation: 20, currentPrice: 68.9, change24h: 0.8 },
      { symbol: 'BND', name: 'Total Bond Market', nameAr: 'إجمالي سوق السندات', allocation: 25, currentPrice: 74.1, change24h: -0.3 },
      { symbol: 'VNQ', name: 'Real Estate', nameAr: 'العقارات', allocation: 5, currentPrice: 98.7, change24h: 0.5 }
    ]
  },
  {
    id: 'aggressive',
    name: 'Growth Portfolio',
    nameAr: 'محفظة النمو',
    type: 'aggressive',
    description: 'High-growth potential with higher risk tolerance',
    descriptionAr: 'إمكانات نمو عالية مع تحمل مخاطر أعلى',
    expectedReturn: 10.8,
    risk: 'high',
    assets: [
      { symbol: 'VTI', name: 'US Total Market', nameAr: 'إجمالي السوق الأمريكي', allocation: 40, currentPrice: 285.2, change24h: 1.2 },
      { symbol: 'VGT', name: 'Technology Sector', nameAr: 'قطاع التكنولوجيا', allocation: 25, currentPrice: 542.8, change24h: 2.1 },
      { symbol: 'VWO', name: 'Emerging Markets', nameAr: 'الأسواق الناشئة', allocation: 20, currentPrice: 43.2, change24h: 1.8 },
      { symbol: 'QQQ', name: 'NASDAQ 100', nameAr: 'ناسداك 100', allocation: 15, currentPrice: 401.5, change24h: 1.9 }
    ]
  },
  {
    id: 'gold',
    name: 'Gold & Commodities',
    nameAr: 'الذهب والسلع',
    type: 'gold',
    description: 'Precious metals and commodity-focused investments',
    descriptionAr: 'استثمارات تركز على المعادن النفيسة والسلع',
    expectedReturn: 6.1,
    risk: 'medium',
    assets: [
      { symbol: 'GLD', name: 'Gold ETF', nameAr: 'صندوق الذهب', allocation: 50, currentPrice: 195.4, change24h: 0.7 },
      { symbol: 'SLV', name: 'Silver ETF', nameAr: 'صندوق الفضة', allocation: 20, currentPrice: 22.8, change24h: 1.2 },
      { symbol: 'DJP', name: 'Commodities', nameAr: 'السلع', allocation: 20, currentPrice: 28.9, change24h: 0.4 },
      { symbol: 'VTI', name: 'Stock Market', nameAr: 'سوق الأسهم', allocation: 10, currentPrice: 285.2, change24h: 1.2 }
    ]
  },
  {
    id: 'shariah',
    name: 'Shariah Compliant',
    nameAr: 'المتوافق مع الشريعة',
    type: 'shariah',
    description: 'Islamic finance principles compliant investments',
    descriptionAr: 'استثمارات متوافقة مع مبادئ التمويل الإسلامي',
    expectedReturn: 8.3,
    risk: 'medium',
    assets: [
      { symbol: 'HLAL', name: 'Halal ETF', nameAr: 'صندوق حلال', allocation: 40, currentPrice: 52.1, change24h: 1.1 },
      { symbol: 'SPUS', name: 'Shariah US Stocks', nameAr: 'الأسهم الأمريكية الشرعية', allocation: 30, currentPrice: 45.8, change24h: 0.9 },
      { symbol: 'ISUS', name: 'Islamic Sukuk', nameAr: 'الصكوك الإسلامية', allocation: 20, currentPrice: 25.6, change24h: 0.1 },
      { symbol: 'MSCI', name: 'Islamic World Index', nameAr: 'المؤشر الإسلامي العالمي', allocation: 10, currentPrice: 78.3, change24h: 0.8 }
    ]
  }
];

// Sample user data
export const mockUser: UserData = {
  id: 'user_001',
  name: 'Ahmed Al-Rashid',
  email: 'ahmed@example.com',
  totalInvested: 2847.50,
  totalRoundUps: 156.25,
  totalReturns: 284.75,
  currency: 'SAR',
  roundUpRule: {
    type: 'nearest',
    value: 5,
    multiplier: 2
  },
  selectedPortfolio: 'balanced'
};

// Sample transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    amount: 47.80,
    currency: 'SAR',
    description: 'Coffee Shop - Starbucks',
    date: new Date('2024-10-20'),
    roundUp: 2.20,
    category: 'Food & Dining'
  },
  {
    id: 'tx_002',
    amount: 125.30,
    currency: 'SAR',
    description: 'Grocery Store - Carrefour',
    date: new Date('2024-10-19'),
    roundUp: 4.70,
    category: 'Groceries'
  },
  {
    id: 'tx_003',
    amount: 89.15,
    currency: 'SAR',
    description: 'Gas Station - ADNOC',
    date: new Date('2024-10-18'),
    roundUp: 0.85,
    category: 'Transportation'
  },
  {
    id: 'tx_004',
    amount: 234.60,
    currency: 'SAR',
    description: 'Online Shopping - Amazon',
    date: new Date('2024-10-17'),
    roundUp: 5.40,
    category: 'Shopping'
  },
  {
    id: 'tx_005',
    amount: 67.25,
    currency: 'SAR',
    description: 'Restaurant - Al Baik',
    date: new Date('2024-10-16'),
    roundUp: 2.75,
    category: 'Food & Dining'
  }
];
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { RoundUpEngine, LanguageManager } from '@/lib/gulfAcorns';
import { Portfolio, gulfCurrencies } from '@/data/mockData';

interface InvestmentChartProps {
  performanceData: { date: string; value: number }[];
  portfolio: Portfolio;
  totalInvested: number;
  totalReturns: number;
  currency: string;
  language?: string;
}

export default function InvestmentChart({ 
  performanceData, 
  portfolio, 
  totalInvested, 
  totalReturns, 
  currency, 
  language = 'en' 
}: InvestmentChartProps) {
  const isRTL = LanguageManager.isRTL(language);
  const currencySymbol = gulfCurrencies.find(c => c.code === currency)?.symbol || currency;
  const currentValue = totalInvested + totalReturns;
  const returnPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  const texts = {
    en: {
      portfolioPerformance: "Portfolio Performance",
      thirtyDayTrend: "30-day performance trend",
      currentValue: "Current Value",
      totalInvested: "Total Invested",
      totalReturns: "Total Returns",
      assetAllocation: "Asset Allocation",
      portfolioBreakdown: "Portfolio breakdown by asset",
      expectedReturn: "Expected Annual Return",
      riskLevel: "Risk Level",
      low: "Low",
      medium: "Medium",
      high: "High"
    },
    ar: {
      portfolioPerformance: "أداء المحفظة",
      thirtyDayTrend: "اتجاه الأداء لمدة 30 يوماً",
      currentValue: "القيمة الحالية",
      totalInvested: "إجمالي الاستثمار",
      totalReturns: "إجمالي العوائد",
      assetAllocation: "توزيع الأصول",
      portfolioBreakdown: "تفصيل المحفظة حسب الأصول",
      expectedReturn: "العائد السنوي المتوقع",
      riskLevel: "مستوى المخاطر",
      low: "منخفض",
      medium: "متوسط",
      high: "عالي"
    }
  };

  const t = texts[language as keyof typeof texts] || texts.en;

  // Colors for pie chart
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Prepare pie chart data
  const pieData = portfolio.assets.map((asset, index) => ({
    name: language === 'ar' ? asset.nameAr : asset.name,
    value: asset.allocation,
    color: COLORS[index % COLORS.length]
  }));

  const formatTooltip = (value: number, name: string) => {
    if (name === 'value') {
      return [`${currencySymbol} ${value.toFixed(2)}`, t.currentValue];
    }
    return [value, name];
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return t.low;
      case 'medium': return t.medium;
      case 'high': return t.high;
      default: return risk;
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={LanguageManager.getDirection(language)}>
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.currentValue}</p>
                <p className="text-2xl font-bold">{currencySymbol} {currentValue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.totalInvested}</p>
                <p className="text-2xl font-bold">{currencySymbol} {totalInvested.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.totalReturns}</p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currencySymbol} {totalReturns.toFixed(2)}
                  </p>
                  <Badge variant={totalReturns >= 0 ? 'default' : 'destructive'} className="text-xs">
                    {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              {totalReturns >= 0 ? 
                <TrendingUp className="h-8 w-8 text-green-600" /> : 
                <TrendingDown className="h-8 w-8 text-red-600" />
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {t.portfolioPerformance}
          </CardTitle>
          <CardDescription>{t.thirtyDayTrend}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${currencySymbol}${value}`}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Asset Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-purple-600" />
            {t.assetAllocation}
          </CardTitle>
          <CardDescription>{t.portfolioBreakdown}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Asset List */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.expectedReturn}</p>
                  <p className="text-xl font-bold text-green-600">{portfolio.expectedReturn}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.riskLevel}</p>
                  <Badge className={getRiskColor(portfolio.risk)}>
                    {getRiskText(portfolio.risk)}
                  </Badge>
                </div>
              </div>

              {portfolio.assets.map((asset, index) => (
                <div key={asset.symbol} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {language === 'ar' ? asset.nameAr : asset.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{asset.allocation}%</p>
                    <p className={`text-xs ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
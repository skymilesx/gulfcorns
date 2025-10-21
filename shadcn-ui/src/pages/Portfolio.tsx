import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LanguageManager, StorageManager } from '@/lib/gulfAcorns';
import { portfolios, mockUser, gulfCurrencies, UserData } from '@/data/mockData';
import InvestmentChart from '@/components/InvestmentChart';
import { RoundUpEngine } from '@/lib/gulfAcorns';
import { 
  ArrowLeft, 
  PieChart, 
  TrendingUp, 
  Shield, 
  Target,
  Star,
  Info,
  CheckCircle
} from 'lucide-react';

export default function Portfolio() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [userData, setUserData] = useState<UserData>(mockUser);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(userData.selectedPortfolio);
  const isRTL = LanguageManager.isRTL(language);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handlePortfolioChange = (portfolioId: string) => {
    const updatedUser = { ...userData, selectedPortfolio: portfolioId };
    setUserData(updatedUser);
    setSelectedPortfolioId(portfolioId);
    StorageManager.saveUserData('gulfAcorns_user', updatedUser);
  };

  const currentPortfolio = portfolios.find(p => p.id === selectedPortfolioId) || portfolios[1];
  const currencySymbol = gulfCurrencies.find(c => c.code === userData.currency)?.symbol || userData.currency;
  const performanceData = RoundUpEngine.generatePerformanceData();

  const texts = {
    en: {
      portfolio: "Portfolio",
      overview: "Overview",
      assets: "Assets",
      performance: "Performance",
      rebalance: "Rebalance",
      currentPortfolio: "Current Portfolio",
      changePortfolio: "Change Portfolio",
      portfolioType: "Portfolio Type",
      expectedReturn: "Expected Annual Return",
      riskLevel: "Risk Level",
      totalAssets: "Total Assets",
      lastRebalance: "Last Rebalance",
      nextRebalance: "Next Rebalance",
      low: "Low",
      medium: "Medium",
      high: "High",
      conservative: "Conservative",
      balanced: "Balanced",
      aggressive: "Aggressive",
      gold: "Gold & Commodities",
      shariah: "Shariah Compliant",
      backToDashboard: "Back to Dashboard",
      language: "العربية",
      selectPortfolio: "Select Portfolio",
      applyChanges: "Apply Changes",
      allocation: "Allocation",
      currentPrice: "Current Price",
      change24h: "24h Change",
      holdings: "Holdings",
      value: "Value"
    },
    ar: {
      portfolio: "المحفظة",
      overview: "نظرة عامة",
      assets: "الأصول",
      performance: "الأداء",
      rebalance: "إعادة التوازن",
      currentPortfolio: "المحفظة الحالية",
      changePortfolio: "تغيير المحفظة",
      portfolioType: "نوع المحفظة",
      expectedReturn: "العائد السنوي المتوقع",
      riskLevel: "مستوى المخاطر",
      totalAssets: "إجمالي الأصول",
      lastRebalance: "آخر إعادة توازن",
      nextRebalance: "إعادة التوازن التالية",
      low: "منخفض",
      medium: "متوسط",
      high: "عالي",
      conservative: "محافظ",
      balanced: "متوازن",
      aggressive: "عدواني",
      gold: "الذهب والسلع",
      shariah: "متوافق مع الشريعة",
      backToDashboard: "العودة للوحة التحكم",
      language: "English",
      selectPortfolio: "اختر المحفظة",
      applyChanges: "تطبيق التغييرات",
      allocation: "التوزيع",
      currentPrice: "السعر الحالي",
      change24h: "تغيير 24 ساعة",
      holdings: "الحيازات",
      value: "القيمة"
    }
  };

  const t = texts[language];

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

  const getPortfolioTypeText = (type: string) => {
    switch (type) {
      case 'conservative': return t.conservative;
      case 'balanced': return t.balanced;
      case 'aggressive': return t.aggressive;
      case 'gold': return t.gold;
      case 'shariah': return t.shariah;
      default: return type;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={LanguageManager.getDirection(language)}>
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <PieChart className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-bold">{t.portfolio}</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">{t.language}</span>
                <Switch checked={language === 'ar'} onCheckedChange={toggleLanguage} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Portfolio Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t.currentPortfolio}</CardTitle>
            <CardDescription>{t.changePortfolio}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((portfolio) => (
                      <SelectItem key={portfolio.id} value={portfolio.id}>
                        {language === 'ar' ? portfolio.nameAr : portfolio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedPortfolioId !== userData.selectedPortfolio && (
                  <Button onClick={() => handlePortfolioChange(selectedPortfolioId)} className="w-full">
                    {t.applyChanges}
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.portfolioType}</span>
                  <span className="font-medium">{getPortfolioTypeText(currentPortfolio.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.expectedReturn}</span>
                  <span className="font-medium text-green-600">{currentPortfolio.expectedReturn}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.riskLevel}</span>
                  <Badge className={getRiskColor(currentPortfolio.risk)}>
                    {getRiskText(currentPortfolio.risk)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Details */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="assets">{t.assets}</TabsTrigger>
            <TabsTrigger value="performance">{t.performance}</TabsTrigger>
            <TabsTrigger value="rebalance">{t.rebalance}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InvestmentChart
                  performanceData={performanceData}
                  portfolio={currentPortfolio}
                  totalInvested={userData.totalInvested}
                  totalReturns={userData.totalReturns}
                  currency={userData.currency}
                  language={language}
                />
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.portfolioType}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{language === 'ar' ? currentPortfolio.nameAr : currentPortfolio.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? currentPortfolio.descriptionAr : currentPortfolio.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Portfolio Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{t.totalAssets}</span>
                      <span className="font-medium">{currentPortfolio.assets.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{t.lastRebalance}</span>
                      <span className="font-medium">Oct 1, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{t.nextRebalance}</span>
                      <span className="font-medium">Jan 1, 2025</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assets">
            <Card>
              <CardHeader>
                <CardTitle>{t.assets}</CardTitle>
                <CardDescription>Detailed breakdown of your portfolio assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPortfolio.assets.map((asset, index) => (
                    <div key={asset.symbol} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">{asset.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{language === 'ar' ? asset.nameAr : asset.name}</h4>
                          <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{t.allocation}</p>
                            <p className="font-medium">{asset.allocation}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t.currentPrice}</p>
                            <p className="font-medium">${asset.currentPrice}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t.change24h}</p>
                            <p className={`font-medium ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                            </p>
                          </div>
                        </div>
                        <Progress value={asset.allocation} className="w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <InvestmentChart
              performanceData={performanceData}
              portfolio={currentPortfolio}
              totalInvested={userData.totalInvested}
              totalReturns={userData.totalReturns}
              currency={userData.currency}
              language={language}
            />
          </TabsContent>

          <TabsContent value="rebalance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t.rebalance}
                </CardTitle>
                <CardDescription>Maintain optimal asset allocation in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">Your portfolio is currently well-balanced</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Current Allocation</h4>
                      {currentPortfolio.assets.map((asset) => (
                        <div key={asset.symbol} className="flex justify-between py-1">
                          <span className="text-sm">{asset.symbol}</span>
                          <span className="text-sm font-medium">{asset.allocation}%</span>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Target Allocation</h4>
                      {currentPortfolio.assets.map((asset) => (
                        <div key={asset.symbol} className="flex justify-between py-1">
                          <span className="text-sm">{asset.symbol}</span>
                          <span className="text-sm font-medium">{asset.allocation}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" disabled>
                    Portfolio is Balanced
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
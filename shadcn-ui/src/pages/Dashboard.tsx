import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoundUpEngine, LanguageManager, StorageManager } from '@/lib/gulfAcorns';
import { mockUser, mockTransactions, portfolios, gulfCurrencies, UserData, RoundUpRule } from '@/data/mockData';
import RoundUpEngineComponent from '@/components/RoundUpEngine';
import InvestmentChart from '@/components/InvestmentChart';
import { 
  Wallet, 
  TrendingUp, 
  Coins, 
  Settings, 
  Bell, 
  CreditCard, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Dashboard() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [userData, setUserData] = useState<UserData>(mockUser);
  const [activeTab, setActiveTab] = useState('overview');
  const isRTL = LanguageManager.isRTL(language);

  useEffect(() => {
    // Load user data from localStorage
    const savedData = StorageManager.getUserData('gulfAcorns_user');
    if (savedData) {
      setUserData(savedData);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleRuleChange = (newRule: RoundUpRule) => {
    const updatedUser = { ...userData, roundUpRule: newRule };
    setUserData(updatedUser);
    StorageManager.saveUserData('gulfAcorns_user', updatedUser);
  };

  const currentPortfolio = portfolios.find(p => p.id === userData.selectedPortfolio) || portfolios[1];
  const currencySymbol = gulfCurrencies.find(c => c.code === userData.currency)?.symbol || userData.currency;
  const performanceData = RoundUpEngine.generatePerformanceData();

  const texts = {
    en: {
      dashboard: "Dashboard",
      overview: "Overview",
      roundUps: "Round-Ups",
      investments: "Investments",
      settings: "Settings",
      totalBalance: "Total Balance",
      totalInvested: "Total Invested",
      totalReturns: "Total Returns",
      roundUpBalance: "Round-Up Balance",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
      addFunds: "Add Funds",
      withdraw: "Withdraw",
      viewPortfolio: "View Portfolio",
      notifications: "Notifications",
      language: "العربية",
      welcomeBack: "Welcome back",
      todaysRoundUps: "Today's Round-Ups",
      monthlyGoal: "Monthly Goal",
      portfolioPerformance: "Portfolio Performance",
      linkedAccounts: "Linked Accounts",
      primaryCard: "Primary Card",
      active: "Active",
      invest: "Invest",
      pending: "Pending"
    },
    ar: {
      dashboard: "لوحة التحكم",
      overview: "نظرة عامة",
      roundUps: "التقريب",
      investments: "الاستثمارات",
      settings: "الإعدادات",
      totalBalance: "إجمالي الرصيد",
      totalInvested: "إجمالي الاستثمار",
      totalReturns: "إجمالي العوائد",
      roundUpBalance: "رصيد التقريب",
      recentActivity: "النشاط الأخير",
      quickActions: "إجراءات سريعة",
      addFunds: "إضافة أموال",
      withdraw: "سحب",
      viewPortfolio: "عرض المحفظة",
      notifications: "الإشعارات",
      language: "English",
      welcomeBack: "مرحباً بعودتك",
      todaysRoundUps: "تقريب اليوم",
      monthlyGoal: "الهدف الشهري",
      portfolioPerformance: "أداء المحفظة",
      linkedAccounts: "الحسابات المربوطة",
      primaryCard: "البطاقة الأساسية",
      active: "نشط",
      invest: "استثمر",
      pending: "معلق"
    }
  };

  const t = texts[language];

  const totalBalance = userData.totalInvested + userData.totalReturns + userData.totalRoundUps;
  const todaysRoundUps = mockTransactions.slice(0, 2).reduce((sum, tx) => 
    sum + RoundUpEngine.calculateRoundUp(tx.amount, userData.roundUpRule), 0
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={LanguageManager.getDirection(language)}>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Coins className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-green-600">Gulf Acorns</span>
              </div>
              <Badge variant="secondary">{t.dashboard}</Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm">{t.language}</span>
                <Switch checked={language === 'ar'} onCheckedChange={toggleLanguage} />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="text-sm font-medium">{userData.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {t.welcomeBack}, {userData.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.totalBalance}</p>
                  <p className="text-2xl font-bold">{currencySymbol} {totalBalance.toFixed(2)}</p>
                </div>
                <Wallet className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.totalInvested}</p>
                  <p className="text-2xl font-bold">{currencySymbol} {userData.totalInvested.toFixed(2)}</p>
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
                    <p className={`text-2xl font-bold ${userData.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {currencySymbol} {userData.totalReturns.toFixed(2)}
                    </p>
                  </div>
                </div>
                {userData.totalReturns >= 0 ? 
                  <ArrowUpRight className="h-8 w-8 text-green-600" /> : 
                  <ArrowDownRight className="h-8 w-8 text-red-600" />
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.roundUpBalance}</p>
                  <p className="text-2xl font-bold">{currencySymbol} {userData.totalRoundUps.toFixed(2)}</p>
                  <Badge variant="secondary" className="mt-1">
                    {t.pending}
                  </Badge>
                </div>
                <Coins className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="roundups">{t.roundUps}</TabsTrigger>
            <TabsTrigger value="investments">{t.investments}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.todaysRoundUps}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {currencySymbol} {todaysRoundUps.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      From {mockTransactions.slice(0, 2).length} transactions today
                    </p>
                  </CardContent>
                </Card>

                <InvestmentChart
                  performanceData={performanceData}
                  portfolio={currentPortfolio}
                  totalInvested={userData.totalInvested}
                  totalReturns={userData.totalReturns}
                  currency={userData.currency}
                  language={language}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.quickActions}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start">
                      <Coins className="mr-2 h-4 w-4" />
                      {t.invest} {currencySymbol} {userData.totalRoundUps.toFixed(2)}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {t.addFunds}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <PieChart className="mr-2 h-4 w-4" />
                      {t.viewPortfolio}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.linkedAccounts}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{t.primaryCard}</p>
                          <p className="text-xs text-muted-foreground">**** 4532</p>
                        </div>
                      </div>
                      <Badge variant="default">{t.active}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roundups">
            <RoundUpEngineComponent
              transactions={mockTransactions}
              currentRule={userData.roundUpRule}
              currency={userData.currency}
              language={language}
              onRuleChange={handleRuleChange}
            />
          </TabsContent>

          <TabsContent value="investments">
            <InvestmentChart
              performanceData={performanceData}
              portfolio={currentPortfolio}
              totalInvested={userData.totalInvested}
              totalReturns={userData.totalReturns}
              currency={userData.currency}
              language={language}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t.settings}
                </CardTitle>
                <CardDescription>Manage your account preferences and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
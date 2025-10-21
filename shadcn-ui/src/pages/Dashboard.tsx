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
import TopBarControls from '@/components/TopBarControls';
import RuleCard from '@/components/RuleCard';
import SimulatePurchase from '@/components/SimulatePurchase';
import InvestWidget from '@/components/InvestWidget';
import InvestedChart from '@/components/InvestedChart';
import { useGulfAcornsStore, getTranslation } from '@/lib/store';
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
  const [userData, setUserData] = useState<UserData>(mockUser);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use Zustand store
  const {
    language,
    currency,
    isRTL,
    setLanguage,
    getCurrencySymbol,
    getTotalBalance,
    getTodayRoundUps,
    simulatedPurchases,
    pendingSpare,
    totalInvested,
    totalReturns
  } = useGulfAcornsStore();

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
  const performanceData = RoundUpEngine.generatePerformanceData();

  const t = (key: string) => getTranslation(key, language);
  const currencySymbol = getCurrencySymbol();
  const totalBalance = getTotalBalance();
  const todaysRoundUps = getTodayRoundUps();

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
              <Badge variant="secondary">{t('dashboard')}</Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <TopBarControls />
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
            {language === 'ar' ? 'مرحباً بعودتك' : 'Welcome back'}, {userData.name.split(' ')[0]}!
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
                  <p className="text-sm font-medium text-muted-foreground">{t('totalBalance')}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">{t('totalInvested')}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">{t('totalReturns')}</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {currencySymbol} {totalReturns.toFixed(2)}
                    </p>
                  </div>
                </div>
                {totalReturns >= 0 ? 
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
                  <p className="text-sm font-medium text-muted-foreground">{t('pendingSpare')}</p>
                  <p className="text-2xl font-bold">{currencySymbol} {pendingSpare.toFixed(2)}</p>
                  <Badge variant="secondary" className="mt-1">
                    {t('pending')}
                  </Badge>
                </div>
                <Coins className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="simulate">{t('addPurchase')}</TabsTrigger>
            <TabsTrigger value="rules">{t('ruleType')}</TabsTrigger>
            <TabsTrigger value="invest">{t('investNow')}</TabsTrigger>
            <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('todaysRoundUps')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {currencySymbol} {todaysRoundUps.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      From {simulatedPurchases.filter(p => p.date.toDateString() === new Date().toDateString()).length} simulated purchases today
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

                <InvestedChart investLots={[]} />
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start">
                      <Coins className="mr-2 h-4 w-4" />
                      {t('investNow')} {currencySymbol} {pendingSpare.toFixed(2)}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {t('addFunds')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <PieChart className="mr-2 h-4 w-4" />
                      {t('viewPortfolio')}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('linkedAccounts')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{t('primaryCard')}</p>
                          <p className="text-xs text-muted-foreground">**** 4532</p>
                        </div>
                      </div>
                      <Badge variant="default">{t('active')}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="simulate">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimulatePurchase />
              <Card>
                <CardHeader>
                  <CardTitle>Recent Simulated Purchases</CardTitle>
                  <CardDescription>Your latest test purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {simulatedPurchases.slice(0, 5).map((purchase) => (
                      <div key={purchase.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg" data-testid="purchase-row">
                        <div>
                          <p className="font-medium text-sm">{purchase.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {purchase.date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{currencySymbol} {purchase.amount.toFixed(2)}</div>
                          <div className="text-xs text-green-600">+{currencySymbol} {purchase.roundUp.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                    {simulatedPurchases.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        {language === 'ar' ? 'لا توجد مشتريات محاكاة بعد' : 'No simulated purchases yet'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rules">
            <RuleCard />
          </TabsContent>

          <TabsContent value="invest">
            <InvestWidget />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t('settings')}
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
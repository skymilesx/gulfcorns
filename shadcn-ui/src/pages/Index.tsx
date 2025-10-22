import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, TrendingUp, Shield, Globe, Smartphone, PieChart, Wallet, ArrowUpRight } from 'lucide-react';
import { gulfCurrencies, mockUser } from '@/data/mockData';
import { useGulfAcornsStore, getTranslation } from '@/lib/store';
import TopBarControls from '@/components/TopBarControls';
import QAPanel from '@/components/QAPanel';

export default function Index() {
  const { language, isRTL, getCurrencySymbol } = useGulfAcornsStore();

  const handleGetStarted = () => {
    window.location.href = '/dashboard';
  };

  const handleTryDemo = () => {
    window.location.href = '/dashboard';
  };


  const t = (key: string) => getTranslation(key, language);
  const currencySymbol = getCurrencySymbol();

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-green-600">{language === 'ar' ? 'جلف أكورنز' : 'Gulf Acorns'}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <TopBarControls />
            <Button variant="outline" onClick={handleTryDemo}>{language === 'ar' ? 'جرب العرض التوضيحي' : 'Try Demo'}</Button>
            <Button onClick={handleGetStarted}>{language === 'ar' ? 'ابدأ الآن' : 'Get Started'}</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {language === 'ar' ? 'جلف أكورنز' : 'Gulf Acorns'}
          </h1>
          <p className="text-xl text-muted-foreground mb-2">{language === 'ar' ? 'فكة النقود تبني مستقبلك' : 'Your spare change builds your future'}</p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'استثمر فكة النقود من مشترياتك اليومية تلقائياً في محافظ متنوعة مصممة خصيصاً لمنطقة الخليج'
              : 'Automatically invest spare change from everyday purchases into diversified portfolios tailored for the Gulf region'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="px-8" onClick={handleGetStarted}>
              <Smartphone className="mr-2 h-5 w-5" />
              {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              {language === 'ar' ? 'اعرف المزيد' : 'Learn More'}
            </Button>
          </div>

          {/* Currency Support */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {gulfCurrencies.slice(0, 6).map((currency) => (
              <Badge key={currency.code} variant="secondary" className="px-3 py-1">
                {currency.symbol} {currency.code}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{language === 'ar' ? 'عرض توضيحي مباشر' : 'Live Demo'}</h2>
          
          {/* Demo Dashboard */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{language === 'ar' ? 'إجمالي الرصيد' : 'Total Balance'}</p>
                      <p className="text-2xl font-bold">{currencySymbol} {(mockUser.totalInvested + mockUser.totalReturns + mockUser.totalRoundUps).toFixed(2)}</p>
                    </div>
                    <Wallet className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{language === 'ar' ? 'إجمالي الاستثمار' : 'Total Invested'}</p>
                      <p className="text-2xl font-bold">{currencySymbol} {mockUser.totalInvested.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{language === 'ar' ? 'رصيد التقريب' : 'Round-Up Balance'}</p>
                      <p className="text-2xl font-bold">{currencySymbol} {mockUser.totalRoundUps.toFixed(2)}</p>
                      <Badge variant="secondary" className="mt-1">Pending</Badge>
                    </div>
                    <Coins className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{language === 'ar' ? 'النمو الشهري' : 'Monthly Growth'}</p>
                      <p className="text-2xl font-bold text-green-600">+{((mockUser.totalReturns / mockUser.totalInvested) * 100).toFixed(1)}%</p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Portfolio Performance */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'أداء المحفظة' : 'Portfolio Performance'}</CardTitle>
                <CardDescription>Balanced Portfolio - Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Conservative Growth</span>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="w-20" />
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>US Total Market</span>
                    <div className="flex items-center gap-2">
                      <Progress value={50} className="w-20" />
                      <span className="text-sm">50%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>International Stocks</span>
                    <div className="flex items-center gap-2">
                      <Progress value={20} className="w-20" />
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Real Estate</span>
                    <div className="flex items-center gap-2">
                      <Progress value={5} className="w-20" />
                      <span className="text-sm">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Recent Round-Ups */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'التقريب الأخير' : 'Recent Round-Ups'}</CardTitle>
                <CardDescription>Your latest spare change investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Coffee Shop - Starbucks</p>
                      <p className="text-xs text-muted-foreground">{currencySymbol} 47.80</p>
                    </div>
                    <Badge variant="secondary">+{currencySymbol} 2.20</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Grocery Store - Carrefour</p>
                      <p className="text-xs text-muted-foreground">{currencySymbol} 125.30</p>
                    </div>
                    <Badge variant="secondary">+{currencySymbol} 4.70</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Gas Station - ADNOC</p>
                      <p className="text-xs text-muted-foreground">{currencySymbol} 89.15</p>
                    </div>
                    <Badge variant="secondary">+{currencySymbol} 0.85</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Button size="lg" onClick={handleTryDemo}>
                <PieChart className="mr-2 h-5 w-5" />
                {language === 'ar' ? 'جرب العرض التوضيحي' : 'Try Demo'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{language === 'ar' ? 'كيف يعمل' : 'How It Works'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>{language === 'ar' ? 'اربط بطاقتك' : 'Link Your Card'}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{language === 'ar' ? 'اربط بطاقتك المصرفية أو حسابك بأمان' : 'Securely connect your bank card or account'}</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>{language === 'ar' ? 'اضبط قواعد التقريب' : 'Set Round-Up Rules'}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{language === 'ar' ? 'اختر كيفية تقريب مشترياتك' : 'Choose how to round up your purchases'}</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>{language === 'ar' ? 'الاستثمار التلقائي' : 'Auto-Invest'}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{language === 'ar' ? 'يتم استثمار فكة النقود تلقائياً' : 'Your spare change is automatically invested'}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{language === 'ar' ? 'المميزات' : 'Features'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">{language === 'ar' ? 'تركيز على منطقة الخليج' : 'Gulf Region Focus'}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{language === 'ar' ? 'دعم للعملات: ريال، درهم، ريال عماني، دينار بحريني، دينار كويتي، ريال قطري' : 'Support for SAR, AED, OMR, BHD, KWD, QAR currencies'}</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">{language === 'ar' ? 'متوافق مع الشريعة' : 'Shariah Compliant'}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{language === 'ar' ? 'خيارات استثمارية متوافقة مع التمويل الإسلامي' : 'Islamic finance compliant investment options'}</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <PieChart className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">{language === 'ar' ? 'محافظ ذكية' : 'Smart Portfolios'}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{language === 'ar' ? 'محافظ متنوعة من المحافظة إلى العدوانية' : 'Diversified portfolios from conservative to aggressive'}</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg">{language === 'ar' ? 'آمن ومنظم' : 'Secure & Regulated'}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{language === 'ar' ? 'أمان بمستوى البنوك والامتثال التنظيمي' : 'Bank-level security and regulatory compliance'}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* QA Panel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <QAPanel />
        </div>
      </section>

      {/* Supported Countries */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{language === 'ar' ? 'الدول المدعومة' : 'Supported Countries'}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {(language === 'ar' 
              ? ['السعودية', 'الإمارات', 'عمان', 'البحرين', 'الكويت', 'قطر']
              : ['Saudi Arabia', 'UAE', 'Oman', 'Bahrain', 'Kuwait', 'Qatar']
            ).map((country, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 text-base">
                {country}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">{language === 'ar' ? 'جلف أكورنز' : 'Gulf Acorns'}</span>
          </div>
          <p className="text-gray-400 mb-8">{language === 'ar' ? 'فكة النقود تبني مستقبلك' : 'Your spare change builds your future'}</p>
          <p className="text-sm text-gray-500">
            © 2024 Gulf Acorns. All rights reserved. | Built with MGX Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
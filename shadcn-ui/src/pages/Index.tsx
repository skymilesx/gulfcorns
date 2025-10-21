import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Coins, TrendingUp, Shield, Globe, Smartphone, PieChart, Wallet, ArrowUpRight } from 'lucide-react';
import { LanguageManager } from '@/lib/gulfAcorns';
import { gulfCurrencies, mockUser } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const navigate = useNavigate();
  const isRTL = LanguageManager.isRTL(language);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleTryDemo = () => {
    navigate('/dashboard');
  };

  const texts = {
    en: {
      title: "Gulf Acorns",
      subtitle: "Your spare change builds your future",
      description: "Automatically invest spare change from everyday purchases into diversified portfolios tailored for the Gulf region",
      getStarted: "Get Started",
      learnMore: "Learn More",
      howItWorks: "How It Works",
      step1Title: "Link Your Card",
      step1Desc: "Securely connect your bank card or account",
      step2Title: "Set Round-Up Rules",
      step2Desc: "Choose how to round up your purchases",
      step3Title: "Auto-Invest",
      step3Desc: "Your spare change is automatically invested",
      features: "Features",
      feature1Title: "Gulf Region Focus",
      feature1Desc: "Support for SAR, AED, OMR, BHD, KWD, QAR currencies",
      feature2Title: "Shariah Compliant",
      feature2Desc: "Islamic finance compliant investment options",
      feature3Title: "Smart Portfolios",
      feature3Desc: "Diversified portfolios from conservative to aggressive",
      feature4Title: "Secure & Regulated",
      feature4Desc: "Bank-level security and regulatory compliance",
      supportedCountries: "Supported Countries",
      countries: ["Saudi Arabia", "UAE", "Oman", "Bahrain", "Kuwait", "Qatar"],
      demo: "Try Demo",
      language: "العربية",
      demoTitle: "Live Demo",
      totalBalance: "Total Balance",
      totalInvested: "Total Invested",
      roundUpBalance: "Round-Up Balance",
      monthlyGrowth: "Monthly Growth",
      portfolioPerformance: "Portfolio Performance",
      recentRoundUps: "Recent Round-Ups"
    },
    ar: {
      title: "جلف أكورنز",
      subtitle: "فكة النقود تبني مستقبلك",
      description: "استثمر فكة النقود من مشترياتك اليومية تلقائياً في محافظ متنوعة مصممة خصيصاً لمنطقة الخليج",
      getStarted: "ابدأ الآن",
      learnMore: "اعرف المزيد",
      howItWorks: "كيف يعمل",
      step1Title: "اربط بطاقتك",
      step1Desc: "اربط بطاقتك المصرفية أو حسابك بأمان",
      step2Title: "اضبط قواعد التقريب",
      step2Desc: "اختر كيفية تقريب مشترياتك",
      step3Title: "الاستثمار التلقائي",
      step3Desc: "يتم استثمار فكة النقود تلقائياً",
      features: "المميزات",
      feature1Title: "تركيز على منطقة الخليج",
      feature1Desc: "دعم للعملات: ريال، درهم، ريال عماني، دينار بحريني، دينار كويتي، ريال قطري",
      feature2Title: "متوافق مع الشريعة",
      feature2Desc: "خيارات استثمارية متوافقة مع التمويل الإسلامي",
      feature3Title: "محافظ ذكية",
      feature3Desc: "محافظ متنوعة من المحافظة إلى العدوانية",
      feature4Title: "آمن ومنظم",
      feature4Desc: "أمان بمستوى البنوك والامتثال التنظيمي",
      supportedCountries: "الدول المدعومة",
      countries: ["السعودية", "الإمارات", "عمان", "البحرين", "الكويت", "قطر"],
      demo: "جرب العرض التوضيحي",
      language: "English",
      demoTitle: "عرض توضيحي مباشر",
      totalBalance: "إجمالي الرصيد",
      totalInvested: "إجمالي الاستثمار",
      roundUpBalance: "رصيد التقريب",
      monthlyGrowth: "النمو الشهري",
      portfolioPerformance: "أداء المحفظة",
      recentRoundUps: "التقريب الأخير"
    }
  };

  const t = texts[language];
  const currencySymbol = gulfCurrencies.find(c => c.code === mockUser.currency)?.symbol || mockUser.currency;

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`} dir={LanguageManager.getDirection(language)}>
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-green-600">{t.title}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">{t.language}</span>
              <Switch checked={language === 'ar'} onCheckedChange={toggleLanguage} />
            </div>
            <Button variant="outline" onClick={handleTryDemo}>{t.demo}</Button>
            <Button onClick={handleGetStarted}>{t.getStarted}</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-2">{t.subtitle}</p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="px-8" onClick={handleGetStarted}>
              <Smartphone className="mr-2 h-5 w-5" />
              {t.getStarted}
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              {t.learnMore}
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
          <h2 className="text-3xl font-bold text-center mb-12">{t.demoTitle}</h2>
          
          {/* Demo Dashboard */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t.totalBalance}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">{t.totalInvested}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">{t.roundUpBalance}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">{t.monthlyGrowth}</p>
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
                <CardTitle>{t.portfolioPerformance}</CardTitle>
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
                <CardTitle>{t.recentRoundUps}</CardTitle>
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
                {t.demo}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.howItWorks}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>{t.step1Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{t.step1Desc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>{t.step2Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{t.step2Desc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>{t.step3Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{t.step3Desc}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.features}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">{t.feature1Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.feature1Desc}</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">{t.feature2Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.feature2Desc}</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <PieChart className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">{t.feature3Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.feature3Desc}</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg">{t.feature4Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.feature4Desc}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Supported Countries */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{t.supportedCountries}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {t.countries.map((country, index) => (
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
            <span className="text-xl font-bold">{t.title}</span>
          </div>
          <p className="text-gray-400 mb-8">{t.subtitle}</p>
          <p className="text-sm text-gray-500">
            © 2024 Gulf Acorns. All rights reserved. | Built with MGX Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
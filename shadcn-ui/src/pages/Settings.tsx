import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LanguageManager, StorageManager } from '@/lib/gulfAcorns';
import { mockUser, gulfCurrencies, UserData } from '@/data/mockData';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Globe,
  Smartphone,
  Mail,
  Lock,
  Trash2
} from 'lucide-react';

export default function Settings() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [userData, setUserData] = useState<UserData>(mockUser);
  const [notifications, setNotifications] = useState({
    roundUps: true,
    investments: true,
    portfolio: false,
    marketing: false
  });
  const isRTL = LanguageManager.isRTL(language);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleCurrencyChange = (newCurrency: string) => {
    const updatedUser = { ...userData, currency: newCurrency };
    setUserData(updatedUser);
    StorageManager.saveUserData('gulfAcorns_user', updatedUser);
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications({ ...notifications, [type]: value });
  };

  const texts = {
    en: {
      settings: "Settings",
      backToDashboard: "Back to Dashboard",
      language: "العربية",
      account: "Account",
      profile: "Profile",
      security: "Security",
      notifications: "Notifications",
      preferences: "Preferences",
      personalInfo: "Personal Information",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      currency: "Preferred Currency",
      linkedAccounts: "Linked Accounts",
      primaryCard: "Primary Card",
      addCard: "Add New Card",
      twoFactor: "Two-Factor Authentication",
      enabled: "Enabled",
      disabled: "Disabled",
      enable: "Enable",
      changePassword: "Change Password",
      notificationSettings: "Notification Settings",
      roundUpNotifications: "Round-up Notifications",
      roundUpDesc: "Get notified when round-ups are collected",
      investmentNotifications: "Investment Notifications",
      investmentDesc: "Updates on your investment performance",
      portfolioNotifications: "Portfolio Updates",
      portfolioDesc: "Monthly portfolio rebalancing notifications",
      marketingNotifications: "Marketing Communications",
      marketingDesc: "Product updates and promotional offers",
      appPreferences: "App Preferences",
      defaultLanguage: "Default Language",
      darkMode: "Dark Mode",
      biometric: "Biometric Authentication",
      dangerZone: "Danger Zone",
      deleteAccount: "Delete Account",
      deleteWarning: "Permanently delete your account and all data",
      saveChanges: "Save Changes",
      active: "Active"
    },
    ar: {
      settings: "الإعدادات",
      backToDashboard: "العودة للوحة التحكم",
      language: "English",
      account: "الحساب",
      profile: "الملف الشخصي",
      security: "الأمان",
      notifications: "الإشعارات",
      preferences: "التفضيلات",
      personalInfo: "المعلومات الشخصية",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      currency: "العملة المفضلة",
      linkedAccounts: "الحسابات المربوطة",
      primaryCard: "البطاقة الأساسية",
      addCard: "إضافة بطاقة جديدة",
      twoFactor: "المصادقة الثنائية",
      enabled: "مفعل",
      disabled: "معطل",
      enable: "تفعيل",
      changePassword: "تغيير كلمة المرور",
      notificationSettings: "إعدادات الإشعارات",
      roundUpNotifications: "إشعارات التقريب",
      roundUpDesc: "احصل على إشعار عند جمع التقريب",
      investmentNotifications: "إشعارات الاستثمار",
      investmentDesc: "تحديثات حول أداء استثماراتك",
      portfolioNotifications: "تحديثات المحفظة",
      portfolioDesc: "إشعارات إعادة توازن المحفظة الشهرية",
      marketingNotifications: "التواصل التسويقي",
      marketingDesc: "تحديثات المنتج والعروض الترويجية",
      appPreferences: "تفضيلات التطبيق",
      defaultLanguage: "اللغة الافتراضية",
      darkMode: "الوضع المظلم",
      biometric: "المصادقة البيومترية",
      dangerZone: "منطقة الخطر",
      deleteAccount: "حذف الحساب",
      deleteWarning: "حذف حسابك وجميع البيانات نهائياً",
      saveChanges: "حفظ التغييرات",
      active: "نشط"
    }
  };

  const t = texts[language];

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
                <SettingsIcon className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-bold">{t.settings}</h1>
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

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t.profile}
              </CardTitle>
              <CardDescription>{t.personalInfo}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.name}</Label>
                  <Input id="name" value={userData.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input id="email" type="email" value={userData.email} readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input id="phone" value="+966 50 123 4567" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{t.currency}</Label>
                  <Select value={userData.currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gulfCurrencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Linked Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t.linkedAccounts}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{t.primaryCard}</p>
                      <p className="text-sm text-muted-foreground">Visa •••• 4532</p>
                    </div>
                  </div>
                  <Badge variant="default">{t.active}</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  {t.addCard}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t.security}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.twoFactor}</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{t.disabled}</Badge>
                  <Button variant="outline" size="sm">{t.enable}</Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.biometric}</p>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <Button variant="outline" className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                {t.changePassword}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t.notifications}
              </CardTitle>
              <CardDescription>{t.notificationSettings}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.roundUpNotifications}</p>
                  <p className="text-sm text-muted-foreground">{t.roundUpDesc}</p>
                </div>
                <Switch 
                  checked={notifications.roundUps} 
                  onCheckedChange={(value) => handleNotificationChange('roundUps', value)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.investmentNotifications}</p>
                  <p className="text-sm text-muted-foreground">{t.investmentDesc}</p>
                </div>
                <Switch 
                  checked={notifications.investments} 
                  onCheckedChange={(value) => handleNotificationChange('investments', value)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.portfolioNotifications}</p>
                  <p className="text-sm text-muted-foreground">{t.portfolioDesc}</p>
                </div>
                <Switch 
                  checked={notifications.portfolio} 
                  onCheckedChange={(value) => handleNotificationChange('portfolio', value)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.marketingNotifications}</p>
                  <p className="text-sm text-muted-foreground">{t.marketingDesc}</p>
                </div>
                <Switch 
                  checked={notifications.marketing} 
                  onCheckedChange={(value) => handleNotificationChange('marketing', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                {t.preferences}
              </CardTitle>
              <CardDescription>{t.appPreferences}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.defaultLanguage}</p>
                  <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                </div>
                <Select value={language} onValueChange={(value: 'en' | 'ar') => setLanguage(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.darkMode}</p>
                  <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                {t.dangerZone}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">{t.deleteAccount}</p>
                  <p className="text-sm text-muted-foreground">{t.deleteWarning}</p>
                </div>
                <Button variant="destructive" size="sm">
                  {t.deleteAccount}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="px-8">
              {t.saveChanges}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
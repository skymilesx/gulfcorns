import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RoundUpEngine as Engine, LanguageManager } from '@/lib/gulfAcorns';
import { RoundUpRule, Transaction, gulfCurrencies } from '@/data/mockData';
import { Calculator, TrendingUp, Coins } from 'lucide-react';

interface RoundUpEngineProps {
  transactions: Transaction[];
  currentRule: RoundUpRule;
  currency: string;
  language?: string;
  onRuleChange: (rule: RoundUpRule) => void;
}

export default function RoundUpEngineComponent({ 
  transactions, 
  currentRule, 
  currency, 
  language = 'en',
  onRuleChange 
}: RoundUpEngineProps) {
  const [tempRule, setTempRule] = useState<RoundUpRule>(currentRule);
  const isRTL = LanguageManager.isRTL(language);

  const calculateTotalRoundUps = () => {
    return transactions.reduce((total, transaction) => {
      const roundUp = Engine.calculateRoundUp(transaction.amount, tempRule);
      return total + roundUp;
    }, 0);
  };

  const handleRuleTypeChange = (type: 'nearest' | 'percentage' | 'fixed') => {
    const newRule = { ...tempRule, type };
    if (type === 'nearest') newRule.value = 5;
    if (type === 'percentage') newRule.value = 2;
    if (type === 'fixed') newRule.value = 1;
    setTempRule(newRule);
  };

  const handleValueChange = (value: number[]) => {
    setTempRule({ ...tempRule, value: value[0] });
  };

  const handleMultiplierChange = (multiplier: string) => {
    setTempRule({ ...tempRule, multiplier: parseInt(multiplier) });
  };

  const applyRule = () => {
    onRuleChange(tempRule);
  };

  const totalRoundUps = calculateTotalRoundUps();
  const currencySymbol = gulfCurrencies.find(c => c.code === currency)?.symbol || currency;

  const texts = {
    en: {
      title: "Round-Up Engine",
      description: "Configure how your spare change gets invested",
      ruleType: "Round-Up Type",
      nearest: "Round to Nearest",
      percentage: "Percentage of Purchase",
      fixed: "Fixed Amount",
      multiplier: "Multiplier",
      value: "Value",
      preview: "Preview",
      totalRoundUps: "Total Round-Ups",
      recentTransactions: "Recent Transactions",
      apply: "Apply Settings",
      sar: "SAR",
      monthly: "Monthly Projection"
    },
    ar: {
      title: "محرك التقريب",
      description: "اضبط كيفية استثمار فكة النقود",
      ruleType: "نوع التقريب",
      nearest: "تقريب إلى أقرب",
      percentage: "نسبة من المشتريات",
      fixed: "مبلغ ثابت",
      multiplier: "المضاعف",
      value: "القيمة",
      preview: "معاينة",
      totalRoundUps: "إجمالي التقريب",
      recentTransactions: "المعاملات الأخيرة",
      apply: "تطبيق الإعدادات",
      sar: "ريال",
      monthly: "التوقع الشهري"
    }
  };

  const t = texts[language as keyof typeof texts] || texts.en;

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={LanguageManager.getDirection(language)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            {t.title}
          </CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rule Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.ruleType}</label>
            <Select value={tempRule.type} onValueChange={handleRuleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nearest">{t.nearest}</SelectItem>
                <SelectItem value="percentage">{t.percentage}</SelectItem>
                <SelectItem value="fixed">{t.fixed}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Value Configuration */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t.value} ({tempRule.type === 'nearest' ? t.sar : tempRule.type === 'percentage' ? '%' : t.sar})
            </label>
            <div className="px-3">
              <Slider
                value={[tempRule.value]}
                onValueChange={handleValueChange}
                max={tempRule.type === 'nearest' ? 10 : tempRule.type === 'percentage' ? 10 : 20}
                min={tempRule.type === 'nearest' ? 1 : tempRule.type === 'percentage' ? 1 : 0.5}
                step={tempRule.type === 'nearest' ? 1 : tempRule.type === 'percentage' ? 0.5 : 0.25}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{tempRule.type === 'nearest' ? '1' : tempRule.type === 'percentage' ? '1%' : '0.5'}</span>
                <span className="font-medium">{tempRule.value}{tempRule.type === 'percentage' ? '%' : ''}</span>
                <span>{tempRule.type === 'nearest' ? '10' : tempRule.type === 'percentage' ? '10%' : '20'}</span>
              </div>
            </div>
          </div>

          {/* Multiplier */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.multiplier}</label>
            <Select value={tempRule.multiplier.toString()} onValueChange={handleMultiplierChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="3">3x</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={applyRule} className="w-full">
            {t.apply}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {t.preview}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {currencySymbol} {totalRoundUps.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">{t.totalRoundUps}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currencySymbol} {(totalRoundUps * 12).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">{t.monthly}</div>
            </div>
          </div>

          {/* Recent Transactions Preview */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{t.recentTransactions}</h4>
            {transactions.slice(0, 3).map((transaction) => {
              const roundUp = Engine.calculateRoundUp(transaction.amount, tempRule);
              return (
                <div key={transaction.id} className="flex justify-between items-center py-2 px-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {currencySymbol} {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Coins className="h-3 w-3" />
                    +{currencySymbol} {roundUp.toFixed(2)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
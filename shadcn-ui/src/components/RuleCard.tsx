import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useGulfAcornsStore, getTranslation, type RuleType } from '@/lib/store';
import { Settings } from 'lucide-react';

export default function RuleCard() {
  const {
    language,
    currency,
    ruleType,
    ruleValue,
    ruleMultiplier,
    setRuleType,
    setRuleValue,
    setRuleMultiplier,
    getCurrencySymbol
  } = useGulfAcornsStore();

  const t = (key: string) => getTranslation(key, language);
  const currencySymbol = getCurrencySymbol();

  const handleRuleTypeChange = (type: RuleType) => {
    setRuleType(type);
    // Reset value when changing type
    if (type === 'roundup') {
      setRuleValue(5);
    } else if (type === 'percent') {
      setRuleValue(2);
    } else {
      setRuleValue(1);
    }
  };

  const handleValueChange = (value: number) => {
    setRuleValue(value);
  };

  const handleMultiplierChange = (multiplier: number[]) => {
    setRuleMultiplier(multiplier[0]);
  };

  const getRuleDescription = () => {
    switch (ruleType) {
      case 'roundup':
        return language === 'ar' 
          ? `تقريب المشتريات إلى أقرب ${ruleValue} ${currencySymbol}`
          : `Round purchases to nearest ${ruleValue} ${currencySymbol}`;
      case 'percent':
        return language === 'ar'
          ? `إضافة ${ruleValue}% من قيمة كل مشتريات`
          : `Add ${ruleValue}% of each purchase value`;
      case 'fixed':
        return language === 'ar'
          ? `إضافة ${ruleValue} ${currencySymbol} لكل مشتريات`
          : `Add ${ruleValue} ${currencySymbol} to each purchase`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('ruleType')}
        </CardTitle>
        <CardDescription>
          {getRuleDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rule Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="rule-type">{t('ruleType')}</Label>
          <Select value={ruleType} onValueChange={handleRuleTypeChange}>
            <SelectTrigger data-testid="rule-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roundup">{t('roundup')}</SelectItem>
              <SelectItem value="fixed">{t('fixed')}</SelectItem>
              <SelectItem value="percent">{t('percent')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rule Value */}
        <div className="space-y-2">
          <Label htmlFor="rule-value">{t('ruleValue')}</Label>
          {ruleType === 'roundup' ? (
            <Select value={ruleValue.toString()} onValueChange={(value) => handleValueChange(Number(value))}>
              <SelectTrigger data-testid="rule-value">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 {currencySymbol}</SelectItem>
                <SelectItem value="5">5 {currencySymbol}</SelectItem>
                <SelectItem value="10">10 {currencySymbol}</SelectItem>
                <SelectItem value="25">25 {currencySymbol}</SelectItem>
              </SelectContent>
            </Select>
          ) : ruleType === 'percent' ? (
            <div className="space-y-2">
              <Input
                type="number"
                value={ruleValue}
                onChange={(e) => handleValueChange(Number(e.target.value))}
                min="0.1"
                max="10"
                step="0.1"
                className="w-full"
                data-testid="rule-value"
              />
              <div className="text-sm text-muted-foreground">
                {ruleValue}% of purchase amount
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="number"
                value={ruleValue}
                onChange={(e) => handleValueChange(Number(e.target.value))}
                min="0.1"
                step="0.1"
                className="w-full"
                data-testid="rule-value"
              />
              <div className="text-sm text-muted-foreground">
                Fixed amount per purchase
              </div>
            </div>
          )}
        </div>

        {/* Multiplier */}
        <div className="space-y-2">
          <Label htmlFor="rule-multiplier">{t('ruleMultiplier')}</Label>
          <div className="space-y-2">
            <Slider
              value={[ruleMultiplier]}
              onValueChange={handleMultiplierChange}
              min={1}
              max={5}
              step={1}
              className="w-full"
              data-testid="rule-multiplier"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1x</span>
              <span className="font-medium">{ruleMultiplier}x</span>
              <span>5x</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-2">
            {language === 'ar' ? 'معاينة القاعدة:' : 'Rule Preview:'}
          </div>
          <div className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? `مشتريات بقيمة 50 ${currencySymbol} → إضافة ${calculateExampleRoundUp(50)} ${currencySymbol}`
              : `Purchase of 50 ${currencySymbol} → Add ${calculateExampleRoundUp(50)} ${currencySymbol}`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );

  function calculateExampleRoundUp(amount: number): number {
    let roundUp = 0;
    
    switch (ruleType) {
      case 'roundup': {
        const remainder = amount % ruleValue;
        roundUp = remainder === 0 ? 0 : ruleValue - remainder;
        break;
      }
      case 'percent': {
        roundUp = amount * (ruleValue / 100);
        break;
      }
      case 'fixed': {
        roundUp = ruleValue;
        break;
    }
    }
    
    return Math.round(roundUp * ruleMultiplier * 100) / 100;
  }
}

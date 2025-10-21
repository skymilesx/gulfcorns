import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGulfAcornsStore, getTranslation } from '@/lib/store';
import { ShoppingCart, Plus } from 'lucide-react';

export default function SimulatePurchase() {
  const {
    language,
    currency,
    addSimulatedPurchase,
    getCurrencySymbol
  } = useGulfAcornsStore();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');

  const t = (key: string) => getTranslation(key, language);
  const currencySymbol = getCurrencySymbol();

  const categories = [
    { value: 'food', label: t('food') },
    { value: 'groceries', label: t('groceries') },
    { value: 'transportation', label: t('transportation') },
    { value: 'shopping', label: t('shopping') },
    { value: 'entertainment', label: t('entertainment') },
    { value: 'utilities', label: t('utilities') }
  ];

  const handleAddPurchase = () => {
    if (!amount || !description) return;

    const purchaseAmount = parseFloat(amount);
    if (purchaseAmount <= 0) return;

    addSimulatedPurchase({
      amount: purchaseAmount,
      description,
      date: new Date(),
      category
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('food');
  };

  const quickAmounts = [10, 25, 50, 100, 250];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {t('addPurchase')}
        </CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? 'محاكاة مشتريات لاختبار نظام التقريب'
            : 'Simulate purchases to test the round-up system'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">{t('purchaseAmount')}</Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`0.00 ${currencySymbol}`}
              className="flex-1"
              data-testid="amount-input"
            />
            <div className="text-sm text-muted-foreground flex items-center">
              {currencySymbol}
            </div>
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                className="text-xs"
              >
                {quickAmount} {currencySymbol}
              </Button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t('purchaseDescription')}</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={language === 'ar' ? 'مثال: قهوة من ستاربكس' : 'e.g., Coffee from Starbucks'}
            data-testid="merchant-input"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">{t('purchaseCategory')}</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Button */}
        <Button 
          onClick={handleAddPurchase}
          className="w-full"
          disabled={!amount || !description || parseFloat(amount) <= 0}
          data-testid="add-purchase-btn"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('addPurchase')}
        </Button>

        {/* Preview */}
        {amount && description && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-1">
              {language === 'ar' ? 'معاينة المشتريات:' : 'Purchase Preview:'}
            </div>
            <div className="text-sm text-muted-foreground">
              {description} - {amount} {currencySymbol}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

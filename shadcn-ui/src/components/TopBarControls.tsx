import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGulfAcornsStore, getTranslation, type Language, type CurrencyCode } from '@/lib/store';
import { Globe, Coins } from 'lucide-react';

export default function TopBarControls() {
  const {
    language,
    currency,
    setLanguage,
    setCurrency,
    getCurrencySymbol
  } = useGulfAcornsStore();

  const t = (key: string) => getTranslation(key, language);

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Language Toggle */}
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleLanguageToggle}
          className="min-w-[80px]"
          data-testid="lang-select"
        >
          {language === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      {/* Currency Selector */}
      <div className="flex items-center gap-2">
        <Coins className="h-4 w-4 text-muted-foreground" />
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-[120px]" data-testid="currency-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SAR">ر.س SAR</SelectItem>
            <SelectItem value="AED">د.إ AED</SelectItem>
            <SelectItem value="OMR">ر.ع. OMR</SelectItem>
            <SelectItem value="BHD">د.ب BHD</SelectItem>
            <SelectItem value="KWD">د.ك KWD</SelectItem>
            <SelectItem value="QAR">ر.ق QAR</SelectItem>
            <SelectItem value="USD">$ USD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

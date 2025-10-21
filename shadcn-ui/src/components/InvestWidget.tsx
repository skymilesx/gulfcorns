import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGulfAcornsStore, getTranslation } from '@/lib/store';
import { TrendingUp, Coins, Clock, CheckCircle } from 'lucide-react';

export default function InvestWidget() {
  const {
    language,
    currency,
    pendingSpare,
    pendingInvestments,
    totalInvested,
    totalReturns,
    investNow,
    clearPendingInvestments,
    getCurrencySymbol,
    getTotalBalance
  } = useGulfAcornsStore();

  const t = (key: string) => getTranslation(key, language);
  const currencySymbol = getCurrencySymbol();
  const totalBalance = getTotalBalance();

  const handleInvestNow = () => {
    investNow();
  };

  const handleClearPending = () => {
    clearPendingInvestments();
  };

  const totalPendingAmount = pendingInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const hasPendingInvestments = totalPendingAmount > 0 || pendingSpare > 0;

  return (
    <div className="space-y-4">
      {/* Pending Spare Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-purple-600" />
            {t('pendingSpare')}
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'فكة النقود المعلقة من المشتريات المحاكاة'
              : 'Pending spare change from simulated purchases'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600" data-testid="pending-amount">
                {currencySymbol} {pendingSpare.toFixed(2)}
              </div>
              <Badge variant="secondary" className="mt-1">
                <Clock className="mr-1 h-3 w-3" />
                {t('pending')}
              </Badge>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {language === 'ar' ? 'من المشتريات' : 'From purchases'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Investments List */}
      {pendingInvestments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              {language === 'ar' ? 'الاستثمارات المعلقة' : 'Pending Investments'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'الاستثمارات في انتظار التنفيذ'
                : 'Investments waiting to be executed'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvestments.map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {currencySymbol} {investment.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {investment.date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {investment.source === 'roundup' 
                      ? (language === 'ar' ? 'تقريب' : 'Round-up')
                      : (language === 'ar' ? 'يدوي' : 'Manual')
                    }
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invest Now Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {t('investNow')}
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'استثمر جميع الأموال المعلقة الآن'
              : 'Invest all pending funds now'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total Pending Amount */}
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-green-800">
                  {language === 'ar' ? 'إجمالي المعلق' : 'Total Pending'}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {currencySymbol} {(totalPendingAmount + pendingSpare).toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600">
                  {language === 'ar' ? 'جاهز للاستثمار' : 'Ready to invest'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleInvestNow}
              disabled={!hasPendingInvestments}
              className="flex-1"
              data-testid="invest-now-btn"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              {t('investNow')}
            </Button>
            
            {hasPendingInvestments && (
              <Button 
                variant="outline"
                onClick={handleClearPending}
              >
                {t('clearPending')}
              </Button>
            )}
          </div>

          {/* Statement Download */}
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                const currentMonth = new Date().toISOString().slice(0, 7);
                window.open(`/api/statement?month=${currentMonth}`, '_blank');
              }}
            >
              📄 Download Statement
            </Button>
          </div>

          {/* Investment Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                {t('totalInvested')}
              </div>
              <div className="text-lg font-bold">
                {currencySymbol} {totalInvested.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                {t('totalReturns')}
              </div>
              <div className={`text-lg font-bold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currencySymbol} {totalReturns.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

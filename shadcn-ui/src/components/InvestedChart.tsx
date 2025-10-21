import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGulfAcornsStore, getTranslation } from '@/lib/store';

interface InvestedChartProps {
  investLots: Array<{
    id: string;
    amount: number;
    currency: string;
    portfolio: string;
    createdAt: string;
  }>;
}

export default function InvestedChart({ investLots }: InvestedChartProps) {
  const { language, getCurrencySymbol } = useGulfAcornsStore();
  const t = (key: string) => getTranslation(key, language);
  const currencySymbol = getCurrencySymbol();

  // Process data for cumulative chart
  const chartData = React.useMemo(() => {
    if (investLots.length === 0) return [];

    // Sort by date and calculate cumulative amounts
    const sortedLots = [...investLots].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let cumulative = 0;
    return sortedLots.map((lot, index) => {
      cumulative += lot.amount;
      return {
        date: new Date(lot.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
          month: 'short',
          day: 'numeric'
        }),
        amount: Number(cumulative.toFixed(2)),
        investment: lot.amount,
      };
    });
  }, [investLots, language]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('investmentGrowth')}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'نمو استثماراتك مع مرور الوقت'
              : 'Your investment growth over time'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            {language === 'ar' 
              ? 'لا توجد استثمارات بعد'
              : 'No investments yet'
            }
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('investmentGrowth')}</CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? 'نمو استثماراتك مع مرور الوقت'
            : 'Your investment growth over time'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${currencySymbol}${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`${currencySymbol}${value.toFixed(2)}`, 'Total Invested']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

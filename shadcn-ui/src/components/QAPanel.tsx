import React from 'react';
import { useGulfAcornsStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QAPanel: React.FC = () => {
  const { 
    setRuleType, 
    setRuleValue, 
    setRuleMultiplier, 
    addSimulatedPurchase, 
    simulatedPurchases,
    pendingSpare 
  } = useGulfAcornsStore();

  const runScenario = async (merchant: string, amount: number, expected: number) => {
    // Set rule to roundup with value 1 and multiplier 1
    setRuleType('roundup');
    setRuleValue(1);
    setRuleMultiplier(1);
    
    // Add the purchase
    await addSimulatedPurchase({
      amount,
      description: merchant,
      date: new Date(),
      category: 'food'
    });
  };

  const scenarios = [
    { merchant: 'Starbucks', amount: 4.50, expected: 0.50 },
    { merchant: 'Carrefour', amount: 23.75, expected: 0.25 },
    { merchant: 'ADNOC', amount: 15.30, expected: 0.70 }
  ];

  const lastPurchase = simulatedPurchases[0];
  const lastSpare = lastPurchase?.roundUp || 0;

  return (
    <Card data-testid="qa-panel" className="mt-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium">QA Test Scenarios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {scenarios.map((scenario, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => runScenario(scenario.merchant, scenario.amount, scenario.expected)}
              className="text-xs"
            >
              {scenario.merchant} ${scenario.amount} → ${scenario.expected}
            </Button>
          ))}
        </div>
        
        {lastPurchase && (
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
            Last: {lastPurchase.description} ${lastPurchase.amount} → Spare: ${lastSpare.toFixed(2)}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Pending Total: ${pendingSpare.toFixed(2)}
        </div>
      </CardContent>
    </Card>
  );
};

export default QAPanel;

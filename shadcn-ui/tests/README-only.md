# Test Stubs (No Dependencies)

If package installation is blocked, use these manual test procedures:

## Manual Unit Tests

### Currency Precision Tests
```javascript
// Test in browser console
const currencyDecimals = { USD:2, SAR:2, AED:2, QAR:2, OMR:2, KWD:3, BHD:3 };
const dp = (c) => currencyDecimals[c] ?? 2;
const fmt = (n, c) => Number(n.toFixed(dp(c)));

// Test cases
console.log('USD 4.555:', fmt(4.555, 'USD')); // Should be 4.56
console.log('KWD 4.555:', fmt(4.555, 'KWD')); // Should be 4.555
console.log('BHD 4.555:', fmt(4.555, 'BHD')); // Should be 4.555
```

### Roundup Calculation Tests
```javascript
// Test in browser console
const calculateRoundUp = (amount, rule, currency) => {
  let roundUp = 0;
  switch (rule.type) {
    case 'roundup': {
      const remainder = amount % rule.value;
      roundUp = remainder === 0 ? 0 : rule.value - remainder;
      break;
    }
    case 'percent': {
      roundUp = amount * (rule.value / 100);
      break;
    }
    case 'fixed': {
      roundUp = rule.value;
      break;
    }
  }
  const spare = roundUp * (rule.multiplier || 1);
  return Number(spare.toFixed(currency === 'KWD' || currency === 'BHD' ? 3 : 2));
};

// Test scenarios
console.log('Starbucks 4.50:', calculateRoundUp(4.50, {type:'roundup', value:1, multiplier:1}, 'USD')); // 0.50
console.log('Carrefour 23.75:', calculateRoundUp(23.75, {type:'roundup', value:1, multiplier:1}, 'USD')); // 0.25
console.log('ADNOC 15.30:', calculateRoundUp(15.30, {type:'roundup', value:1, multiplier:1}, 'USD')); // 0.70
console.log('Fixed 1.00:', calculateRoundUp(23.75, {type:'fixed', value:1.00, multiplier:1}, 'USD')); // 1.00
console.log('Percent 1%:', calculateRoundUp(23.75, {type:'percent', value:1, multiplier:1}, 'USD')); // 0.24
console.log('KWD 4.500:', calculateRoundUp(4.500, {type:'roundup', value:1, multiplier:1}, 'KWD')); // 0.500
```

## Manual E2E Tests

### Test Steps
1. Open http://localhost:3000
2. Click language toggle, verify RTL
3. Switch currency to KWD, verify 3 decimal places
4. Go to dashboard
5. Set rule to roundup(1)
6. Add Starbucks 4.50, verify pending shows 0.50
7. Add Carrefour 23.75, verify pending shows 0.75
8. Click Invest Now, verify pending resets to 0

### Expected Results
- Language toggle works with RTL
- Currency switching works with correct decimal places
- Roundup calculations are accurate
- Investment flow works end-to-end
- QA Panel scenarios work correctly

## Data Test IDs Available
- `lang-select` - Language toggle
- `currency-select` - Currency dropdown  
- `rule-type` - Rule type selector
- `rule-value` - Rule value input
- `rule-multiplier` - Multiplier slider
- `merchant-input` - Merchant name input
- `amount-input` - Purchase amount input
- `add-purchase-btn` - Add purchase button
- `pending-amount` - Pending spare amount
- `invest-now-btn` - Invest now button
- `purchase-row` - Purchase transaction rows
- `qa-panel` - QA testing panel

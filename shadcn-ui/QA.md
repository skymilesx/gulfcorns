# QA Testing Guide

## Manual Testing Checklist

### Language & Currency Testing
- [ ] **Language Toggle**: Click EN/AR button, verify RTL layout in Arabic
- [ ] **Currency Switch**: Test all currencies (SAR, AED, OMR, BHD, KWD, QAR, USD)
- [ ] **Decimal Places**: Verify KWD/BHD show 3 decimal places, others show 2

### Roundup Rule Testing
- [ ] **Roundup Rule**: Set to roundup, value=1, test scenarios below
- [ ] **Fixed Rule**: Set to fixed, value=1.00, should add exactly 1.00
- [ ] **Percent Rule**: Set to percent, value=1%, should add 1% of purchase
- [ ] **Multiplier**: Test 2x multiplier doubles the roundup amount

### Test Scenarios

#### Scenario 1: Starbucks
- **Input**: Merchant="Starbucks", Amount=4.50
- **Expected**: Roundup=0.50 (rounds to 5.00)
- **Currency**: USD (2 decimal places)

#### Scenario 2: Carrefour
- **Input**: Merchant="Carrefour", Amount=23.75
- **Expected**: Roundup=0.25 (rounds to 24.00)
- **Currency**: USD (2 decimal places)

#### Scenario 3: ADNOC
- **Input**: Merchant="ADNOC", Amount=15.30
- **Expected**: Roundup=0.70 (rounds to 16.00)
- **Currency**: USD (2 decimal places)

#### Scenario 4: KWD Currency
- **Input**: Merchant="Test Store", Amount=4.500
- **Expected**: Roundup=0.500 (3 decimal places)
- **Currency**: KWD (3 decimal places)

### Investment Flow Testing
- [ ] **Add Purchases**: Add multiple purchases, verify pending amount accumulates
- [ ] **Invest Now**: Click Invest Now, verify pending resets to 0
- [ ] **Total Invested**: Verify total invested amount increases

## Expected Values Table

| Scenario | Amount | Rule | Expected Roundup | Currency | Decimal Places |
|----------|--------|------|------------------|----------|----------------|
| Starbucks | 4.50 | roundup(1) | 0.50 | USD | 2 |
| Carrefour | 23.75 | roundup(1) | 0.25 | USD | 2 |
| ADNOC | 15.30 | roundup(1) | 0.70 | USD | 2 |
| Fixed Test | 23.75 | fixed(1.00) | 1.00 | USD | 2 |
| Percent Test | 23.75 | percent(1%) | 0.24 | USD | 2 |
| KWD Test | 4.500 | roundup(1) | 0.500 | KWD | 3 |
| Multiplier Test | 4.50 | roundup(1)×2 | 1.00 | USD | 2 |

## Running Tests

### Unit Tests (Vitest)
```bash
npm install
npm run test
```

### E2E Tests (Playwright)
```bash
npm install
npx playwright install
npm run e2e
```

### Development Server
```bash
npm run dev
```

## Test Commands

- `npm run test` - Run unit tests
- `npm run test:ui` - Run unit tests with UI
- `npm run e2e` - Run E2E tests
- `npx playwright test --ui` - Run E2E tests with UI

## QA Panel Usage

The QA Panel on the homepage provides quick scenario testing:
1. Click scenario buttons to automatically set rules and add purchases
2. Verify expected roundup amounts in the display
3. Check pending total accumulation

## Data Test IDs

Key elements for automated testing:
- `lang-select` - Language toggle button
- `currency-select` - Currency dropdown
- `rule-type` - Rule type selector
- `rule-value` - Rule value input
- `rule-multiplier` - Multiplier slider
- `merchant-input` - Merchant name input
- `amount-input` - Purchase amount input
- `add-purchase-btn` - Add purchase button
- `pending-amount` - Pending spare amount display
- `invest-now-btn` - Invest now button
- `qa-panel` - QA testing panel

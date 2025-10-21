import { test, expect } from '@playwright/test';

test.describe('Gulf Acorns E2E Flow', () => {
  test('should complete full user flow', async ({ page }) => {
    // Go to the homepage
    await page.goto('/');

    // Test language toggle
    await page.click('[data-testid="lang-select"]');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Switch back to English
    await page.click('[data-testid="lang-select"]');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

    // Test currency switching
    await page.click('[data-testid="currency-select"]');
    await page.selectOption('[data-testid="currency-select"]', 'SAR');
    
    // Switch to KWD to test 3 decimal places
    await page.selectOption('[data-testid="currency-select"]', 'KWD');

    // Go to dashboard
    await page.click('text=Get Started');
    await expect(page).toHaveURL('/dashboard');

    // Set rule to roundup with value 1
    await page.selectOption('[data-testid="rule-type"]', 'roundup');
    await page.selectOption('[data-testid="rule-value"]', '1');

    // Add Starbucks purchase
    await page.fill('[data-testid="merchant-input"]', 'Starbucks');
    await page.fill('[data-testid="amount-input"]', '4.50');
    await page.click('[data-testid="add-purchase-btn"]');

    // Check that pending amount shows 0.50
    await expect(page.locator('[data-testid="pending-amount"]')).toContainText('0.50');

    // Add Carrefour purchase
    await page.fill('[data-testid="merchant-input"]', 'Carrefour');
    await page.fill('[data-testid="amount-input"]', '23.75');
    await page.click('[data-testid="add-purchase-btn"]');

    // Check that pending amount shows 0.75 (0.50 + 0.25)
    await expect(page.locator('[data-testid="pending-amount"]')).toContainText('0.75');

    // Click Invest Now
    await page.click('[data-testid="invest-now-btn"]');

    // Check that pending amount resets to 0
    await expect(page.locator('[data-testid="pending-amount"]')).toContainText('0.00');

    // Verify that investment was created (check for success message or UI change)
    await expect(page.locator('text=Invested')).toBeVisible();
  });

  test('should handle KWD currency with 3 decimal places', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Set currency to KWD
    await page.selectOption('[data-testid="currency-select"]', 'KWD');
    
    // Set rule to roundup
    await page.selectOption('[data-testid="rule-type"]', 'roundup');
    await page.selectOption('[data-testid="rule-value"]', '1');

    // Add purchase with 3 decimal places
    await page.fill('[data-testid="merchant-input"]', 'Test Store');
    await page.fill('[data-testid="amount-input"]', '4.500');
    await page.click('[data-testid="add-purchase-btn"]');

    // Check that pending amount shows 3 decimal places
    await expect(page.locator('[data-testid="pending-amount"]')).toContainText('0.500');
  });
});

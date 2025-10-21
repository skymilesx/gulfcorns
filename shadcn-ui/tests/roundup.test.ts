import { describe, it, expect } from 'vitest';
import { fmt, dp } from '../src/lib/store';

describe('Currency Precision and Rounding', () => {
  it('should format USD with 2 decimal places', () => {
    expect(fmt(4.50, 'USD')).toBe(4.50);
    expect(fmt(4.555, 'USD')).toBe(4.56);
  });

  it('should format KWD with 3 decimal places', () => {
    expect(fmt(4.500, 'KWD')).toBe(4.500);
    expect(fmt(4.5555, 'KWD')).toBe(4.556);
  });

  it('should format BHD with 3 decimal places', () => {
    expect(fmt(4.500, 'BHD')).toBe(4.500);
    expect(fmt(4.5555, 'BHD')).toBe(4.556);
  });

  it('should default to 2 decimal places for unknown currencies', () => {
    expect(fmt(4.555, 'UNKNOWN')).toBe(4.56);
  });
});

describe('Roundup Calculations', () => {
  const calculateRoundUp = (amount: number, rule: any, currency: string): number => {
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
    return fmt(spare, currency);
  };

  it('should calculate roundup correctly for Starbucks scenario', () => {
    const rule = { type: 'roundup', value: 1, multiplier: 1 };
    const result = calculateRoundUp(4.50, rule, 'USD');
    expect(result).toBe(0.50);
  });

  it('should calculate roundup correctly for Carrefour scenario', () => {
    const rule = { type: 'roundup', value: 1, multiplier: 1 };
    const result = calculateRoundUp(23.75, rule, 'USD');
    expect(result).toBe(0.25);
  });

  it('should calculate roundup correctly for ADNOC scenario', () => {
    const rule = { type: 'roundup', value: 1, multiplier: 1 };
    const result = calculateRoundUp(15.30, rule, 'USD');
    expect(result).toBe(0.70);
  });

  it('should handle fixed rule correctly', () => {
    const rule = { type: 'fixed', value: 1.00, multiplier: 1 };
    const result = calculateRoundUp(23.75, rule, 'USD');
    expect(result).toBe(1.00);
  });

  it('should handle percent rule correctly', () => {
    const rule = { type: 'percent', value: 1, multiplier: 1 };
    const result = calculateRoundUp(23.75, rule, 'USD');
    expect(result).toBe(0.24); // 23.75 * 0.01 = 0.2375, rounded to 0.24
  });

  it('should apply multiplier correctly', () => {
    const rule = { type: 'roundup', value: 1, multiplier: 2 };
    const result = calculateRoundUp(4.50, rule, 'USD');
    expect(result).toBe(1.00); // 0.50 * 2 = 1.00
  });

  it('should handle KWD currency with 3 decimal places', () => {
    const rule = { type: 'roundup', value: 1, multiplier: 1 };
    const result = calculateRoundUp(4.500, rule, 'KWD');
    expect(result).toBe(0.500);
  });
});

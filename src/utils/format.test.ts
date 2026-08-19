import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate, formatDateTime, initials, isPast, truncate } from './format';

describe('formatCurrency', () => {
  it('uses the taka symbol by default', () => {
    expect(formatCurrency(1200)).toBe('৳1,200');
  });

  it('groups thousands', () => {
    expect(formatCurrency(1234567)).toBe('৳1,234,567');
  });

  it('drops fractional digits', () => {
    expect(formatCurrency(1200.6)).toBe('৳1,201');
  });

  it('falls back to a dollar sign for any other currency', () => {
    expect(formatCurrency(50, 'USD')).toBe('$50');
    expect(formatCurrency(50, 'usd')).toBe('$50');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('৳0');
  });
});

describe('formatDate', () => {
  it('renders a readable day, month and year', () => {
    expect(formatDate('2026-09-15T09:30:00.000Z')).toMatch(/Sep \d{1,2}, 2026/);
  });

  it('accepts a Date instance', () => {
    expect(formatDate(new Date('2026-01-02T00:00:00.000Z'))).toMatch(/2026/);
  });
});

describe('formatDateTime', () => {
  it('includes both the date and the time', () => {
    const out = formatDateTime('2026-09-15T09:30:00.000Z');
    expect(out).toMatch(/Sep \d{1,2}, 2026/);
    expect(out).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  });
});

describe('isPast', () => {
  it('is true for a moment already gone', () => {
    expect(isPast(new Date(Date.now() - 60_000))).toBe(true);
  });

  it('is false for a future moment', () => {
    expect(isPast(new Date(Date.now() + 60_000))).toBe(false);
  });
});

describe('initials', () => {
  it('takes the first letter of the first two words', () => {
    expect(initials('Demo Vendor')).toBe('DV');
  });

  it('caps at two letters', () => {
    expect(initials('Md Al Amin Miah')).toBe('MA');
  });

  it('handles a single word', () => {
    expect(initials('Ayesha')).toBe('A');
  });

  it('ignores repeated spaces rather than emitting undefined', () => {
    expect(initials('Demo   Vendor')).toBe('DV');
  });

  it('returns an empty string for an empty name', () => {
    expect(initials('')).toBe('');
  });
});

describe('truncate', () => {
  it('leaves short text untouched', () => {
    expect(truncate('Dhaka to Sylhet', 60)).toBe('Dhaka to Sylhet');
  });

  it('appends an ellipsis once the limit is passed', () => {
    expect(truncate('a'.repeat(70), 60)).toBe(`${'a'.repeat(60)}…`);
  });

  it('does not truncate text exactly at the limit', () => {
    expect(truncate('a'.repeat(60), 60)).toBe('a'.repeat(60));
  });
});

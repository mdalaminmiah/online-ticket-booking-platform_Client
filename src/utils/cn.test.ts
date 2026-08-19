import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class names with a single space', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('drops false, null and undefined so conditionals stay inline', () => {
    expect(cn('card', false, null, undefined, 'p-5')).toBe('card p-5');
  });

  it('returns an empty string when nothing is truthy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });

  it('handles no arguments', () => {
    expect(cn()).toBe('');
  });

  it('keeps the caller order so later classes can override earlier ones', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-sm text-lg');
  });
});

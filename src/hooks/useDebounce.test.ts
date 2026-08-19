import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('dhaka', 400));
    expect(result.current).toBe('dhaka');
  });

  it('holds the previous value until the delay elapses', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 400), {
      initialProps: { v: 'dhaka' },
    });

    rerender({ v: 'sylhet' });
    expect(result.current).toBe('dhaka');

    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(result.current).toBe('dhaka');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('sylhet');
  });

  it('restarts the timer on every keystroke so only the final value lands', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 400), {
      initialProps: { v: 'd' },
    });

    rerender({ v: 'dh' });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    rerender({ v: 'dha' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('d');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('dha');
  });

  it('honours a custom delay', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 50), {
      initialProps: { v: 'a' },
    });

    rerender({ v: 'b' });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe('b');
  });

  it('works with non-string values', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 100), {
      initialProps: { v: 1 },
    });

    rerender({ v: 2 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(2);
  });
});

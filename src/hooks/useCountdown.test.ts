import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCountdown } from './useCountdown';

const BASE = new Date('2026-09-01T00:00:00.000Z').getTime();

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('breaks the remaining time into days, hours, minutes and seconds', () => {
    const target = new Date(BASE + ((2 * 24 + 3) * 60 * 60 + 4 * 60 + 5) * 1000);
    const { result } = renderHook(() => useCountdown(target));

    expect(result.current).toMatchObject({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      isPast: false,
    });
  });

  it('reports isPast for a departure that already happened', () => {
    const { result } = renderHook(() => useCountdown(new Date(BASE - 1000)));
    expect(result.current.isPast).toBe(true);
    expect(result.current).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('treats the exact departure moment as past', () => {
    const { result } = renderHook(() => useCountdown(new Date(BASE)));
    expect(result.current.isPast).toBe(true);
  });

  it('ticks down once per second', () => {
    const { result } = renderHook(() => useCountdown(new Date(BASE + 10_000)));
    expect(result.current.seconds).toBe(10);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.seconds).toBe(9);

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(result.current.seconds).toBe(5);
  });

  it('flips to isPast once the target is crossed while mounted', () => {
    const { result } = renderHook(() => useCountdown(new Date(BASE + 2000)));
    expect(result.current.isPast).toBe(false);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.isPast).toBe(true);
  });

  it('accepts an ISO string as well as a Date', () => {
    const { result } = renderHook(() => useCountdown(new Date(BASE + 60_000).toISOString()));
    expect(result.current.minutes).toBe(1);
  });

  it('clears its interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = renderHook(() => useCountdown(new Date(BASE + 60_000)));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});

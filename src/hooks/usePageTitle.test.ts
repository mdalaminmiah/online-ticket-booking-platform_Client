import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { usePageTitle } from './usePageTitle';
import { APP_NAME } from '@/constants';

afterEach(() => {
  document.title = '';
});

describe('usePageTitle', () => {
  it('suffixes the brand name', () => {
    renderHook(() => usePageTitle('All Tickets'));
    expect(document.title).toBe(`All Tickets — ${APP_NAME}`);
  });

  it('uses the brand name alone when no title is given', () => {
    renderHook(() => usePageTitle());
    expect(document.title).toBe(APP_NAME);
  });

  it('updates when the title changes', () => {
    const { rerender } = renderHook(({ t }) => usePageTitle(t), {
      initialProps: { t: 'One' },
    });
    expect(document.title).toBe(`One — ${APP_NAME}`);

    rerender({ t: 'Two' });
    expect(document.title).toBe(`Two — ${APP_NAME}`);
  });

  it('restores the previous title on unmount', () => {
    document.title = 'Original';
    const { unmount } = renderHook(() => usePageTitle('Temporary'));
    expect(document.title).toBe(`Temporary — ${APP_NAME}`);

    unmount();
    expect(document.title).toBe('Original');
  });
});

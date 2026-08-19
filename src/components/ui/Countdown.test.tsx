import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Countdown } from './Countdown';

const BASE = new Date('2026-09-01T00:00:00.000Z').getTime();
const inFuture = (ms: number) => new Date(BASE + ms);

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('labels each unit in the full variant', () => {
    render(<Countdown target={inFuture(90_000)} />);
    ['Days', 'Hrs', 'Min', 'Sec'].forEach((label) =>
      expect(screen.getByText(label)).toBeVisible(),
    );
  });

  it('zero-pads the unit values', () => {
    render(<Countdown target={inFuture(5000)} />);
    expect(screen.getAllByText('00').length).toBeGreaterThan(0);
    expect(screen.getByText('05')).toBeVisible();
  });

  it('renders a single compact string when asked', () => {
    render(<Countdown target={inFuture((26 * 60 + 5) * 60 * 1000 + 9000)} compact />);
    expect(screen.getByText('1d 02:05:09')).toBeVisible();
    expect(screen.queryByText('Days')).toBeNull();
  });

  it('shows a departed badge once the target has passed', () => {
    render(<Countdown target={new Date(BASE - 1000)} />);
    expect(screen.getByText('Departed')).toBeVisible();
    expect(screen.queryByText('Days')).toBeNull();
  });

  it('treats the exact departure instant as departed', () => {
    render(<Countdown target={new Date(BASE)} />);
    expect(screen.getByText('Departed')).toBeVisible();
  });

  it('accepts an ISO string target', () => {
    render(<Countdown target={inFuture(3600_000).toISOString()} compact />);
    expect(screen.getByText('0d 01:00:00')).toBeVisible();
  });
});

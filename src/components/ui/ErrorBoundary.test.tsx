import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

function Boom({ explode }: { explode: boolean }): React.ReactElement {
  if (explode) throw new Error('render failed');
  return <p>all good</p>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children while nothing throws', () => {
    render(
      <ErrorBoundary>
        <Boom explode={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('all good')).toBeVisible();
  });

  it('shows a recovery panel instead of unmounting the app', () => {
    render(
      <ErrorBoundary>
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeVisible();
    expect(screen.getByRole('button', { name: /try again/i })).toBeVisible();
  });

  it('renders a custom fallback when one is supplied', () => {
    render(
      <ErrorBoundary fallback={<p>custom fallback</p>}>
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(screen.getByText('custom fallback')).toBeVisible();
  });

  it('clears the error when Try again is pressed', async () => {
    function Host() {
      return (
        <ErrorBoundary>
          <Boom explode={false} />
        </ErrorBoundary>
      );
    }

    const { rerender } = render(
      <ErrorBoundary>
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    rerender(<Host />);
    expect(screen.getByText('all good')).toBeVisible();
  });
});

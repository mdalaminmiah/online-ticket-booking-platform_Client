import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SmartImage } from './SmartImage';
import { PLACEHOLDER_IMAGE } from '@/constants/images';

const REMOTE = 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800';
const FALLBACK = 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=800';

describe('SmartImage', () => {
  it('renders the supplied source', () => {
    render(<SmartImage src={REMOTE} alt="Subarna Express" />);
    expect(screen.getByAltText('Subarna Express')).toHaveAttribute('src', REMOTE);
  });

  it('falls back to the local placeholder when no source is given', () => {
    render(<SmartImage alt="missing" />);
    expect(screen.getByAltText('missing')).toHaveAttribute('src', PLACEHOLDER_IMAGE);
  });

  it('swaps to the fallback when the remote image fails', () => {
    render(<SmartImage src={REMOTE} alt="broken" fallback={FALLBACK} />);
    const img = screen.getByAltText('broken');
    expect(img).toHaveAttribute('src', REMOTE);

    fireEvent.error(img);
    expect(screen.getByAltText('broken')).toHaveAttribute('src', FALLBACK);
  });

  it('does not loop when the fallback itself fails', () => {
    render(<SmartImage src={REMOTE} alt="both broken" fallback={FALLBACK} />);
    const img = screen.getByAltText('both broken');

    fireEvent.error(img);
    fireEvent.error(screen.getByAltText('both broken'));

    expect(screen.getByAltText('both broken')).toHaveAttribute('src', FALLBACK);
  });

  it('drops srcSet once it has fallen back, so the dead set is not reused', () => {
    render(
      <SmartImage src={REMOTE} alt="srcset" fallback={FALLBACK} srcSet={`${REMOTE} 800w`} />,
    );
    const img = screen.getByAltText('srcset');
    expect(img).toHaveAttribute('srcset');

    fireEvent.error(img);
    expect(screen.getByAltText('srcset')).not.toHaveAttribute('srcset');
  });

  it('reserves a fixed aspect box so the grid does not shift while loading', () => {
    const { container } = render(<SmartImage src={REMOTE} alt="ratio" ratio="16/10" />);
    expect(container.firstElementChild).toHaveClass('aspect-16/10');
  });

  it('lazy-loads by default and eagerly loads when marked priority', () => {
    const { rerender } = render(<SmartImage src={REMOTE} alt="p" />);
    expect(screen.getByAltText('p')).toHaveAttribute('loading', 'lazy');

    rerender(<SmartImage src={REMOTE} alt="p" priority />);
    expect(screen.getByAltText('p')).toHaveAttribute('loading', 'eager');
  });

  it('clears the failed state when a new src arrives', () => {
    const { rerender } = render(<SmartImage src={REMOTE} alt="swap" fallback={FALLBACK} />);
    fireEvent.error(screen.getByAltText('swap'));
    expect(screen.getByAltText('swap')).toHaveAttribute('src', FALLBACK);

    const next = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800';
    rerender(<SmartImage src={next} alt="swap" fallback={FALLBACK} />);
    expect(screen.getByAltText('swap')).toHaveAttribute('src', next);
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders every page when the count is small', () => {
    render(<Pagination page={1} totalPages={3} onChange={vi.fn()} />);
    ['1', '2', '3'].forEach((n) => expect(screen.getByRole('button', { name: n })).toBeVisible());
  });

  it('collapses distant pages behind an ellipsis', () => {
    render(<Pagination page={5} totalPages={10} onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '1' })).toBeVisible();
    expect(screen.getByRole('button', { name: '10' })).toBeVisible();
    expect(screen.getByRole('button', { name: '4' })).toBeVisible();
    expect(screen.getByRole('button', { name: '6' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '2' })).toBeNull();
    expect(screen.getAllByText('…')).toHaveLength(2);
  });

  it('disables Previous on the first page and Next on the last', () => {
    const { rerender } = render(<Pagination page={1} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeEnabled();

    rerender(<Pagination page={5} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Previous page')).toBeEnabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('reports the page the user picked', async () => {
    const onChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('steps one page at a time with the arrows', async () => {
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('Previous page'));
    expect(onChange).toHaveBeenLastCalledWith(2);

    await userEvent.click(screen.getByLabelText('Next page'));
    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it('exposes itself as a labelled navigation landmark', () => {
    render(<Pagination page={1} totalPages={4} onChange={vi.fn()} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });
});

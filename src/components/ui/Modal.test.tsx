import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

function Fixture({ onClose = vi.fn(), open = true }: { onClose?: () => void; open?: boolean }) {
  return (
    <Modal open={open} onClose={onClose} title="Update Ticket">
      <input aria-label="Ticket title" />
      <button>Save Changes</button>
    </Modal>
  );
}

describe('Modal', () => {
  it('renders nothing while closed', () => {
    render(<Fixture open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('is a modal dialog labelled by its heading', () => {
    render(<Fixture />);
    expect(screen.getByRole('dialog', { name: 'Update Ticket' })).toHaveAttribute(
      'aria-modal',
      'true',
    );
  });

  it('moves focus to the dialog on open so it is announced', () => {
    render(<Fixture />);
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(<Fixture onClose={onClose} />);

    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the backdrop is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(<Fixture onClose={onClose} />);

    await userEvent.click(container.querySelector('[aria-hidden]') as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps Tab inside the dialog and cycles back to the start', async () => {
    render(<Fixture />);
    const dialog = screen.getByRole('dialog');
    const close = screen.getByRole('button', { name: 'Close' });
    const input = screen.getByLabelText('Ticket title');
    const save = screen.getByRole('button', { name: 'Save Changes' });

    await userEvent.tab();
    expect(close).toHaveFocus();
    await userEvent.tab();
    expect(input).toHaveFocus();
    await userEvent.tab();
    expect(save).toHaveFocus();

    await userEvent.tab();
    expect(close).toHaveFocus();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('wraps backwards out of the dialog to the last element', async () => {
    render(<Fixture />);
    expect(screen.getByRole('dialog')).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Save Changes' })).toHaveFocus();
  });

  it('locks body scroll while open and restores it on close', () => {
    const { rerender } = render(<Fixture />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Fixture open={false} />);
    expect(document.body.style.overflow).toBe('');
  });

  it('returns focus to the element that opened it', () => {
    function Host({ open }: { open: boolean }) {
      return (
        <>
          <button>Open</button>
          <Modal open={open} onClose={vi.fn()} title="Update Ticket">
            <button>Save Changes</button>
          </Modal>
        </>
      );
    }

    const { rerender } = render(<Host open={false} />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    expect(opener).toHaveFocus();

    rerender(<Host open />);
    expect(screen.getByRole('dialog')).toHaveFocus();

    rerender(<Host open={false} />);
    expect(opener).toHaveFocus();
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TicketCard } from './TicketCard';
import type { Ticket } from '@/types';

const BASE: Ticket = {
  _id: 'tkt_1',
  title: 'Dhaka → Chittagong Subarna Express',
  from: 'Dhaka',
  to: 'Chittagong',
  transportType: 'Train',
  price: 850,
  quantity: 57,
  departureAt: '2026-09-28T03:30:00.000Z',
  perks: ['AC', 'Breakfast'],
  image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
  vendorId: 'v1',
  vendorName: 'Demo Vendor',
  vendorEmail: 'vendor@ticketbari.com',
  verificationStatus: 'approved',
  isAdvertised: false,
  isHidden: false,
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-01T00:00:00.000Z',
};

const renderCard = (overrides: Partial<Ticket> = {}) =>
  render(
    <MemoryRouter>
      <TicketCard ticket={{ ...BASE, ...overrides }} />
    </MemoryRouter>,
  );

describe('TicketCard', () => {
  it('shows the route, transport type and formatted price', () => {
    renderCard();
    expect(screen.getByText(BASE.title)).toBeVisible();
    expect(screen.getByText('Dhaka')).toBeVisible();
    expect(screen.getByText('Chittagong')).toBeVisible();
    expect(screen.getByText('Train')).toBeVisible();
    expect(screen.getByText('৳850')).toBeVisible();
  });

  it('links through to the ticket detail route', () => {
    renderCard();
    expect(screen.getByRole('link', { name: /see details/i })).toHaveAttribute(
      'href',
      '/tickets/tkt_1',
    );
  });

  it('reports remaining stock', () => {
    renderCard();
    expect(screen.getByText('57 left')).toBeVisible();
  });

  it('marks a sold-out ticket instead of showing a count', () => {
    renderCard({ quantity: 0 });
    expect(screen.getAllByText(/sold out/i).length).toBeGreaterThan(0);
    expect(screen.queryByText('57 left')).toBeNull();
  });

  it('flags advertised tickets as featured', () => {
    renderCard({ isAdvertised: true });
    expect(screen.getByText('Featured')).toBeVisible();
  });

  it('does not flag ordinary tickets', () => {
    renderCard();
    expect(screen.queryByText('Featured')).toBeNull();
  });

  it('caps the perk list and counts the overflow', () => {
    renderCard({ perks: ['AC', 'WiFi', 'Snacks', 'Blanket', 'Water'] });
    expect(screen.getByText('AC')).toBeVisible();
    expect(screen.getByText('+2')).toBeVisible();
    expect(screen.queryByText('Water')).toBeNull();
  });

  it('hides the route line when the parent already provides it', () => {
    render(
      <MemoryRouter>
        <TicketCard ticket={BASE} showRoute={false} />
      </MemoryRouter>,
    );
    expect(screen.queryByText('Chittagong')).toBeNull();
  });

  it('gives the image the ticket title as alt text', () => {
    renderCard();
    expect(screen.getByAltText(BASE.title)).toBeInTheDocument();
  });
});

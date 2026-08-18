import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  MapPin,
  Calendar,
  Ticket as TicketIcon,
  CheckCircle2,
  Store,
  AlertCircle,
} from 'lucide-react';
import { ticketsApi } from '@/api/tickets';
import { useAuth } from '@/context/AuthContext';
import { TransportIcon } from '@/components/tickets/TransportIcon';
import { BookingModal } from '@/components/tickets/BookingModal';
import { Countdown } from '@/components/ui/Countdown';
import { SmartImage } from '@/components/ui/SmartImage';
import { fallbackFor } from '@/constants/images';
import { PageLoader } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/Badge';
import { useCountdown } from '@/hooks/useCountdown';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { ROLES } from '@/constants';
import type { Ticket } from '@/types';

/** Book-now action, isolated so the live countdown disables the button the
 *  instant departure passes without needing a parent re-render. */
function BookNowAction({ ticket, onBook }: { ticket: Ticket; onBook: () => void }) {
  const { isPast: departed } = useCountdown(ticket.departureAt);
  const soldOut = ticket.quantity <= 0;
  const disabled = departed || soldOut;

  return (
    <div className="mt-8">
      <button onClick={onBook} disabled={disabled} className="btn-primary w-full text-base">
        {departed ? 'Departure Passed' : soldOut ? 'Sold Out' : 'Book Now'}
      </button>
      {disabled && (
        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-400">
          <StatusBadge status={departed ? 'rejected' : 'pending'} />
          {departed ? 'This trip has already departed.' : 'No tickets remaining.'}
        </p>
      )}
    </div>
  );
}

export default function TicketDetails() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: ticket, isLoading, isError } = useQuery({
    queryKey: ['tickets', 'detail', id],
    queryFn: () => ticketsApi.detail(id),
    enabled: Boolean(id),
  });

  if (isLoading) return <PageLoader label="Loading ticket…" />;
  if (isError || !ticket)
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<AlertCircle size={26} />}
          title="Ticket not found"
          description="This ticket may have been removed or is no longer available."
          action={
            <Link to="/tickets" className="btn-primary">
              Browse tickets
            </Link>
          }
        />
      </div>
    );

  const soldOut = ticket.quantity <= 0;
  const canBook = user?.role === ROLES.USER;

  return (
    <div className="container-page py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to="/tickets" className="hover:text-brand-600">All Tickets</Link>
        <span>/</span>
        <span className="truncate text-slate-700 dark:text-slate-300">{ticket.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <SmartImage
          src={ticket.image}
          alt={ticket.title}
          ratio="4/3"
          sizes="(min-width: 1024px) 46vw, 92vw"
          fallback={fallbackFor(ticket.transportType)}
          className="rounded-3xl"
          priority
        />

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              <TransportIcon type={ticket.transportType} size={14} /> {ticket.transportType}
            </span>
            {ticket.verificationStatus === 'approved' && (
              <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <CheckCircle2 size={14} /> Verified
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold">{ticket.title}</h1>

          <div className="mt-4 flex items-center gap-2 text-lg">
            <MapPin size={18} className="text-brand-500" />
            <span className="font-semibold">{ticket.from}</span>
            <ArrowRight size={18} className="text-slate-400" />
            <span className="font-semibold">{ticket.to}</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="card p-4">
              <p className="text-xs text-slate-400">Price / unit</p>
              <p className="text-2xl font-bold text-brand-600 dark:text-brand-300">{formatCurrency(ticket.price)}</p>
            </div>
            <div className="card p-4">
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <TicketIcon size={13} /> Available
              </p>
              <p className="text-2xl font-bold">{soldOut ? 'Sold out' : ticket.quantity}</p>
            </div>
          </div>

          <div className="mt-4 card p-4">
            <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Calendar size={15} /> Departure
            </p>
            <p className="mt-1 font-semibold">{formatDateTime(ticket.departureAt)}</p>
            <div className="mt-3">
              <Countdown target={ticket.departureAt} />
            </div>
          </div>

          {ticket.perks.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold">Perks & Amenities</p>
              <div className="flex flex-wrap gap-2">
                {ticket.perks.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <CheckCircle2 size={14} className="text-emerald-500" /> {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Store size={15} /> Sold by <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.vendorName}</span>
          </div>

          {/* Book Now */}
          {!user ? (
            <div className="mt-8">
              <Link to="/login" className="btn-primary w-full text-base">
                Login to Book
              </Link>
            </div>
          ) : !canBook ? (
            <div className="mt-8">
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                Only travellers (user accounts) can book tickets.
              </p>
            </div>
          ) : (
            <BookNowAction ticket={ticket} onBook={() => setBookingOpen(true)} />
          )}
        </div>
      </div>

      {canBook && <BookingModal ticket={ticket} open={bookingOpen} onClose={() => setBookingOpen(false)} />}
    </div>
  );
}

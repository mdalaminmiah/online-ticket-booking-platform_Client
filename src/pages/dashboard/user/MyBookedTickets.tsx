import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { bookingsApi } from '@/api/bookings';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TicketCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import type { Booking } from '@/types';

export default function MyBookedTickets() {
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: bookingsApi.mine,
  });

  return (
    <div>
      <PageHeader title="My Booked Tickets" subtitle="Track your bookings, pay for accepted requests and view status." />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TicketCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Couldn't load your bookings"
          description="There was a problem fetching your bookings. Please try again."
          onRetry={() => refetch()}
        />
      ) : data && data.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((b) => (
            <BookingCard key={b._id} booking={b} onPay={setPayingBooking} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Ticket size={26} />}
          title="No bookings yet"
          description="Browse tickets and book your first journey."
          action={
            <Link to="/tickets" className="btn-primary">
              Browse Tickets
            </Link>
          }
        />
      )}

      {payingBooking && (
        <PaymentModal booking={payingBooking} open={Boolean(payingBooking)} onClose={() => setPayingBooking(null)} />
      )}
    </div>
  );
}

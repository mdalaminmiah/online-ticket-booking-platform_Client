import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ticketsApi } from '@/api/tickets';
import { TicketCard } from '@/components/tickets/TicketCard';
import { TicketCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SectionHeading } from '@/components/ui/SectionHeading';

const MAX_LATEST = 8;

export function LatestTickets() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tickets', 'latest'],
    queryFn: ticketsApi.latest,
  });
  const tickets = (data ?? []).slice(0, MAX_LATEST);

  return (
    <section className="bg-white py-16 dark:bg-slate-900/40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Just Added"
          title="Latest Tickets"
          description="Freshly listed routes from our verified vendors."
          action={
            <Link to="/tickets" className="btn-outline">
              View all <ArrowRight size={16} />
            </Link>
          }
        />
        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: MAX_LATEST }).map((_, i) => (
                <TicketCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : tickets.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tickets.map((t) => (
                <TicketCard key={t._id} ticket={t} />
              ))}
            </div>
          ) : (
            <EmptyState title="No tickets available yet" description="New routes are added daily. Please check back soon." />
          )}
        </div>
      </div>
    </section>
  );
}

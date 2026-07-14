import { useQuery } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import { ticketsApi } from '@/api/tickets';
import { TicketCard } from '@/components/tickets/TicketCard';
import { TicketCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SectionHeading } from '@/components/ui/SectionHeading';

const MAX_ADS = 6;

export function AdvertisementSection() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tickets', 'advertised'],
    queryFn: ticketsApi.advertised,
  });
  const ads = (data ?? []).slice(0, MAX_ADS);

  return (
    <section className="container-page py-16">
      <SectionHeading
        eyebrow="Featured"
        title="Top Picks for You"
        description="Hand-picked tickets featured by our team — grab them before they're gone."
      />
      <div className="mt-10">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: MAX_ADS }).map((_, i) => (
              <TicketCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : ads.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((t) => (
              <TicketCard key={t._id} ticket={t} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Megaphone size={26} />}
            title="No featured tickets yet"
            description="Check back soon — our team is curating the best routes for you."
          />
        )}
      </div>
    </section>
  );
}

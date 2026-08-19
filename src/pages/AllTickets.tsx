import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ticketsApi, type TicketQuery } from '@/api/tickets';
import { TicketCard } from '@/components/tickets/TicketCard';
import { TicketCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useDebounce } from '@/hooks/useDebounce';
import { PAGE_SIZE, TRANSPORT_TYPES } from '@/constants';
import { usePageTitle } from '@/hooks/usePageTitle';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
] as const;

export default function AllTickets() {
  usePageTitle('All Tickets');
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [transportType, setTransportType] = useState(searchParams.get('transport') ?? '');
  const [sort, setSort] = useState<TicketQuery['sort']>(
    (searchParams.get('sort') as TicketQuery['sort']) ?? 'newest',
  );
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const debouncedSearch = useDebounce(search, 450);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, transportType, sort]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (debouncedSearch) next.set('search', debouncedSearch);
    if (transportType) next.set('transport', transportType);
    if (sort && sort !== 'newest') next.set('sort', sort);
    if (page > 1) next.set('page', String(page));
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, transportType, sort, page, setSearchParams]);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['tickets', 'list', { debouncedSearch, transportType, sort, page }],
    queryFn: () =>
      ticketsApi.list({
        search: debouncedSearch || undefined,
        transportType: transportType || undefined,
        sort,
        page,
        limit: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const tickets = data?.items ?? [];
  const meta = data?.meta;
  const hasFilters = Boolean(search || transportType || sort !== 'newest');

  const clearFilters = () => {
    setSearch('');
    setTransportType('');
    setSort('newest');
  };

  return (
    <div className="container-page py-10">
      <SectionHeading
        eyebrow="Browse"
        title="All Tickets"
        description="Search, filter and sort through every admin-approved ticket."
      />

      <div className="card mt-8 flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by From or To location…"
            className="input pl-11"
            aria-label="Search tickets"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
              className="input min-w-[10rem] pl-9"
              aria-label="Filter by transport type"
            >
              <option value="">All Transport</option>
              {TRANSPORT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as TicketQuery['sort'])}
            className="input min-w-[12rem]"
            aria-label="Sort tickets"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="btn-ghost" aria-label="Clear filters">
              <X size={16} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <TicketCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Couldn't load tickets"
            description="There was a problem fetching tickets. Please try again."
            onRetry={() => refetch()}
          />
        ) : tickets.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {tickets.length} of {meta?.total ?? 0} tickets
              </span>
              {isFetching && <span className="text-brand-500">Updating…</span>}
            </div>
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-60' : ''}`}>
              {tickets.map((t) => (
                <TicketCard key={t._id} ticket={t} />
              ))}
            </div>
            <div className="mt-10">
              <Pagination page={page} totalPages={meta?.totalPages ?? 1} onChange={setPage} />
            </div>
          </>
        ) : (
          <EmptyState
            icon={<Search size={26} />}
            title="No tickets found"
            description="Try adjusting your search or filters to find more routes."
            action={
              hasFilters ? (
                <button onClick={clearFilters} className="btn-primary">
                  Clear filters
                </button>
              ) : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

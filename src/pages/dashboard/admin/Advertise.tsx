import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '@/api/admin';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { TransportIcon } from '@/components/tickets/TransportIcon';
import { SmartImage } from '@/components/ui/SmartImage';
import { fallbackFor } from '@/constants/images';
import { getErrorMessage } from '@/lib/axios';
import { formatCurrency } from '@/utils/format';
import { MAX_ADVERTISED } from '@/constants';
import { cn } from '@/utils/cn';
import type { Ticket } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

function Toggle({ on, disabled, onClick }: { on: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-40',
        on ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700',
      )}
    >
      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', on ? 'translate-x-6' : 'translate-x-1')} />
    </button>
  );
}

export default function Advertise() {
  usePageTitle('Advertise Tickets');
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'advertise'],
    queryFn: adminApi.advertiseList,
  });

  const advertisedCount = (data ?? []).filter((t) => t.isAdvertised).length;
  const limitReached = advertisedCount >= MAX_ADVERTISED;

  const mutation = useMutation({
    mutationFn: ({ id, isAdvertised }: { id: string; isAdvertised: boolean }) => adminApi.toggleAdvertise(id, isAdvertised),
    onSuccess: (_d, v) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'advertise'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'advertised'] });
      toast.success(v.isAdvertised ? 'Ticket advertised' : 'Removed from advertisements');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const columns: Column<Ticket>[] = [
    {
      key: 'title',
      header: 'Ticket',
      render: (t) => (
        <div className="flex items-center gap-3">
          <SmartImage
            src={t.image}
            alt=""
            fallback={fallbackFor(t.transportType)}
            className="h-10 w-14 shrink-0 rounded-lg"
          />
          <div>
            <p className="line-clamp-1 font-medium">{t.title}</p>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <TransportIcon type={t.transportType} size={12} /> {t.from} → {t.to}
            </p>
          </div>
        </div>
      ),
    },
    { key: 'price', header: 'Price', align: 'right', render: (t) => formatCurrency(t.price) },
    { key: 'quantity', header: 'Qty', align: 'center' },
    {
      key: 'advertise',
      header: 'Advertise',
      align: 'right',
      render: (t) => (
        <div className="flex justify-end">
          <Toggle
            on={t.isAdvertised}
            disabled={mutation.isPending || (!t.isAdvertised && limitReached)}
            onClick={() => mutation.mutate({ id: t._id, isAdvertised: !t.isAdvertised })}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Advertise Tickets"
        subtitle="Feature approved tickets on the homepage."
        action={
          <span
            className={cn(
              'badge',
              limitReached ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
            )}
          >
            {advertisedCount} / {MAX_ADVERTISED} advertised
          </span>
        }
      />

      {limitReached && (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          You've reached the maximum of {MAX_ADVERTISED} advertised tickets. Unadvertise one to feature another.
        </p>
      )}

      {isLoading ? (
        <div className="card p-6">
          <TableSkeleton rows={6} cols={4} />
        </div>
      ) : isError ? (
        <ErrorState
          title="Couldn't load tickets"
          description="There was a problem fetching approved tickets. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          keyField={(t) => t._id}
          empty={<EmptyState icon={<Megaphone size={26} />} title="No approved tickets" description="Approve vendor tickets first to advertise them." />}
        />
      )}
    </div>
  );
}

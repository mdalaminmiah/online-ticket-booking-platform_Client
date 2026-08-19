import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingsApi } from '@/api/bookings';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { StatusBadge } from '@/components/ui/Badge';
import { getErrorMessage } from '@/lib/axios';
import { formatCurrency } from '@/utils/format';
import { BOOKING_STATUS } from '@/constants';
import type { Booking } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function RequestedBookings() {
  usePageTitle('Requested Bookings');
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings', 'requested'],
    queryFn: bookingsApi.requested,
  });

  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'accept' | 'reject' }) =>
      action === 'accept' ? bookingsApi.accept(id) : bookingsApi.reject(id),
    onSuccess: (_d, v) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'requested'] });
      toast.success(`Booking ${v.action === 'accept' ? 'accepted' : 'rejected'}`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const columns: Column<Booking>[] = [
    {
      key: 'user',
      header: 'User',
      render: (b) => (
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-200">{b.userName}</p>
          <p className="text-xs text-slate-400">{b.userEmail}</p>
        </div>
      ),
    },
    { key: 'ticketTitle', header: 'Ticket', render: (b) => <span className="line-clamp-1">{b.ticketTitle}</span> },
    { key: 'quantity', header: 'Qty', align: 'center' },
    {
      key: 'totalPrice',
      header: 'Total',
      align: 'right',
      render: (b) => <span className="font-semibold text-brand-600 dark:text-brand-300">{formatCurrency(b.totalPrice)}</span>,
    },
    { key: 'status', header: 'Status', align: 'center', render: (b) => <StatusBadge status={b.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (b) =>
        b.status === BOOKING_STATUS.PENDING ? (
          <div className="flex justify-end gap-2">
            <button
              className="btn-primary btn-sm"
              disabled={mutation.isPending && mutation.variables?.id === b._id}
              onClick={() => mutation.mutate({ id: b._id, action: 'accept' })}
            >
              <Check size={14} /> Accept
            </button>
            <button
              className="btn-danger btn-sm"
              disabled={mutation.isPending && mutation.variables?.id === b._id}
              onClick={() => mutation.mutate({ id: b._id, action: 'reject' })}
            >
              <X size={14} /> Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="Requested Bookings" subtitle="Review and respond to booking requests for your tickets." />
      {isLoading ? (
        <div className="card p-6">
          <TableSkeleton rows={5} cols={6} />
        </div>
      ) : isError ? (
        <ErrorState
          title="Couldn't load booking requests"
          description="There was a problem fetching booking requests. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          keyField={(b) => b._id}
          empty={
            <EmptyState icon={<ClipboardList size={26} />} title="No booking requests yet" description="Requests from travellers will appear here." />
          }
        />
      )}
    </div>
  );
}

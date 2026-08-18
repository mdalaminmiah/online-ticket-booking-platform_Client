import { useState } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Check, X, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '@/api/admin';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { StatusBadge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { TransportIcon } from '@/components/tickets/TransportIcon';
import { SmartImage } from '@/components/ui/SmartImage';
import { fallbackFor } from '@/constants/images';
import { getErrorMessage } from '@/lib/axios';
import { formatCurrency } from '@/utils/format';
import { TICKET_STATUS } from '@/constants';
import type { Ticket } from '@/types';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function ManageTickets() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'tickets', { status, page }],
    queryFn: () => adminApi.listTickets({ status: status || undefined, page, limit: 10 }),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) =>
      action === 'approve' ? adminApi.approveTicket(id) : adminApi.rejectTicket(id),
    onSuccess: (_d, v) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'advertise'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success(`Ticket ${v.action === 'approve' ? 'approved' : 'rejected'}`);
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
    {
      key: 'vendorName',
      header: 'Vendor',
      render: (t) => (
        <div>
          <p className="text-sm font-medium">{t.vendorName}</p>
          <p className="text-xs text-slate-400">{t.vendorEmail}</p>
        </div>
      ),
    },
    { key: 'price', header: 'Price', align: 'right', render: (t) => formatCurrency(t.price) },
    { key: 'quantity', header: 'Qty', align: 'center' },
    { key: 'status', header: 'Status', align: 'center', render: (t) => <StatusBadge status={t.verificationStatus} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (t) => (
        <div className="flex justify-end gap-2">
          <button
            className="btn-primary btn-sm"
            disabled={
              (mutation.isPending && mutation.variables?.id === t._id) ||
              t.verificationStatus === TICKET_STATUS.APPROVED
            }
            onClick={() => mutation.mutate({ id: t._id, action: 'approve' })}
          >
            <Check size={14} /> Approve
          </button>
          <button
            className="btn-danger btn-sm"
            disabled={
              (mutation.isPending && mutation.variables?.id === t._id) ||
              t.verificationStatus === TICKET_STATUS.REJECTED
            }
            onClick={() => mutation.mutate({ id: t._id, action: 'reject' })}
          >
            <X size={14} /> Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Manage Tickets"
        subtitle="Approve or reject vendor-submitted tickets."
        action={
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input w-40">
            {FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        }
      />

      {isLoading ? (
        <div className="card p-6">
          <TableSkeleton rows={6} cols={6} />
        </div>
      ) : isError ? (
        <ErrorState
          title="Couldn't load tickets"
          description="There was a problem fetching tickets. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.items ?? []}
            keyField={(t) => t._id}
            empty={<EmptyState icon={<ShieldCheck size={26} />} title="No tickets found" description="No tickets match this filter." />}
          />
          <div className="mt-6">
            <Pagination page={page} totalPages={data?.meta.totalPages ?? 1} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}

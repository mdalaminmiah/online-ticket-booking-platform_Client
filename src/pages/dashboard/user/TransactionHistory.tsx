import { useQuery } from '@tanstack/react-query';
import { Receipt } from 'lucide-react';
import { paymentsApi } from '@/api/payments';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatCurrency, formatDateTime } from '@/utils/format';
import type { Transaction } from '@/types';

export default function TransactionHistory() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['transactions', 'mine'],
    queryFn: paymentsApi.mine,
  });

  const columns: Column<Transaction>[] = [
    {
      key: 'stripePaymentIntentId',
      header: 'Transaction ID',
      render: (t) => <span className="font-mono text-xs">{t.stripePaymentIntentId}</span>,
    },
    { key: 'ticketTitle', header: 'Ticket', render: (t) => <span className="font-medium">{t.ticketTitle}</span> },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (t) => <span className="font-semibold text-brand-600 dark:text-brand-300">{formatCurrency(t.amount)}</span>,
    },
    { key: 'paidAt', header: 'Payment Date', render: (t) => formatDateTime(t.paidAt) },
  ];

  return (
    <div>
      <PageHeader title="Transaction History" subtitle="A record of all your Stripe payments." />

      {isLoading ? (
        <div className="card p-6">
          <TableSkeleton rows={5} cols={4} />
        </div>
      ) : isError ? (
        <ErrorState
          title="Couldn't load transactions"
          description="There was a problem fetching your payment history. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          keyField={(t) => t._id}
          empty={
            <EmptyState
              icon={<Receipt size={26} />}
              title="No transactions yet"
              description="Your completed payments will appear here."
            />
          }
        />
      )}
    </div>
  );
}

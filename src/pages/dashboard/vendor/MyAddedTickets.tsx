import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Pencil, Trash2, Ticket as TicketIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { ticketsApi, type CreateTicketInput } from '@/api/tickets';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TicketCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TicketForm } from '@/components/dashboard/TicketForm';
import { TransportIcon } from '@/components/tickets/TransportIcon';
import { SmartImage } from '@/components/ui/SmartImage';
import { fallbackFor } from '@/constants/images';
import { getErrorMessage } from '@/lib/axios';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { TICKET_STATUS } from '@/constants';
import type { Ticket } from '@/types';

export default function MyAddedTickets() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [deleting, setDeleting] = useState<Ticket | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['tickets', 'mine'], queryFn: ticketsApi.mine });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tickets', 'mine'] });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateTicketInput> }) => ticketsApi.update(id, input),
    onSuccess: () => {
      invalidate();
      toast.success('Ticket updated');
      setEditing(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ticketsApi.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success('Ticket deleted');
      setDeleting(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div>
      <PageHeader
        title="My Added Tickets"
        subtitle="Manage your listings. Rejected tickets cannot be edited or deleted."
        action={
          <Link to="/dashboard/add-ticket" className="btn-primary">
            + Add Ticket
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TicketCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((t) => {
            const rejected = t.verificationStatus === TICKET_STATUS.REJECTED;
            return (
              <article key={t._id} className="card flex h-full flex-col overflow-hidden">
                <div className="relative">
                  <SmartImage
                    src={t.image}
                    alt={t.title}
                    ratio="16/10"
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                    fallback={fallbackFor(t.transportType)}
                  />
                  <div className="pointer-events-none absolute right-3 top-3">
                    <StatusBadge status={t.verificationStatus} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 min-h-11 font-semibold leading-snug">{t.title}</h3>
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <TransportIcon type={t.transportType} size={14} /> {t.from} <ArrowRight size={12} /> {t.to}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">{formatDateTime(t.departureAt)}</p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="font-bold text-brand-600 dark:text-brand-300">{formatCurrency(t.price)}</span>
                    <span className="text-slate-500">{t.quantity} left</span>
                  </div>

                  <div className="mt-auto flex gap-2 pt-4">
                    <button
                      className="btn-outline btn-sm flex-1"
                      disabled={rejected}
                      onClick={() => setEditing(t)}
                    >
                      <Pencil size={14} /> Update
                    </button>
                    <button
                      className="btn-danger btn-sm flex-1"
                      disabled={rejected}
                      onClick={() => setDeleting(t)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<TicketIcon size={26} />}
          title="No tickets yet"
          description="Add your first ticket to start selling."
          action={
            <Link to="/dashboard/add-ticket" className="btn-primary">
              Add Ticket
            </Link>
          }
        />
      )}

      {/* Edit modal */}
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Update Ticket" size="lg">
        {editing && (
          <TicketForm
            defaultValues={editing}
            submitting={updateMutation.isPending}
            submitLabel="Save Changes"
            onSubmit={(input) => updateMutation.mutate({ id: editing._id, input })}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete ticket?"
        message={`"${deleting?.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting._id)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

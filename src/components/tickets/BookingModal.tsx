import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { bookingsApi } from '@/api/bookings';
import { getErrorMessage } from '@/lib/axios';
import { formatCurrency } from '@/utils/format';
import type { Ticket } from '@/types';

export function BookingModal({
  ticket,
  open,
  onClose,
}: {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const schema = z.object({
    quantity: z.coerce
      .number()
      .int('Must be a whole number')
      .min(1, 'At least 1 ticket')
      .max(ticket.quantity, `Only ${ticket.quantity} available`),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1 },
  });

  const quantity = watch('quantity') || 0;
  const total = ticket.price * (Number(quantity) || 0);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => bookingsApi.create({ ticketId: ticket._id, quantity: values.quantity }),
    onSuccess: () => {
      toast.success('Booking requested! Track it under My Booked Tickets.');
      queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] });
      reset();
      onClose();
      navigate('/dashboard/bookings');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Booking failed')),
  });

  return (
    <Modal open={open} onClose={onClose} title="Book Your Ticket">
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <p className="font-semibold">{ticket.title}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {ticket.from} → {ticket.to} · {formatCurrency(ticket.price)} / unit
          </p>
        </div>

        <div>
          <label className="label" htmlFor="quantity">
            Ticket Quantity <span className="text-slate-400">(max {ticket.quantity})</span>
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={ticket.quantity}
            className="input"
            {...register('quantity')}
          />
          {errors.quantity && <p className="mt-1 text-sm text-rose-600">{errors.quantity.message}</p>}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800">
          <span className="text-sm text-slate-500">Total Amount</span>
          <span className="text-xl font-bold text-brand-600 dark:text-brand-300">{formatCurrency(total)}</span>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" className="btn-outline" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={mutation.isPending}>
            {mutation.isPending && <Spinner size={16} className="text-white" />}
            Confirm Booking
          </button>
        </div>
      </form>
    </Modal>
  );
}

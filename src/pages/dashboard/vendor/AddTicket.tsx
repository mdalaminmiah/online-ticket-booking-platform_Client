import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ticketsApi, type CreateTicketInput } from '@/api/tickets';
import { TicketForm } from '@/components/dashboard/TicketForm';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { getErrorMessage } from '@/lib/axios';

export default function AddTicket() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateTicketInput) => ticketsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'mine'] });
      toast.success('Ticket added — pending admin approval');
      navigate('/dashboard/my-tickets');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div>
      <PageHeader title="Add Ticket" subtitle="List a new route. It will be reviewed by an admin before going live." />
      <div className="card p-6">
        <TicketForm onSubmit={(v) => mutation.mutate(v)} submitting={mutation.isPending} submitLabel="Add Ticket" />
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { getStripePromise } from '@/lib/stripe';
import { paymentsApi } from '@/api/payments';
import { getErrorMessage } from '@/lib/axios';
import { formatCurrency } from '@/utils/format';
import { useTheme } from '@/context/ThemeContext';
import type { Booking } from '@/types';

function CheckoutForm({ booking, onDone }: { booking: Booking; onDone: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const confirmMutation = useMutation({
    mutationFn: (paymentIntentId: string) =>
      paymentsApi.confirm({ bookingId: booking._id, paymentIntentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Payment successful! Your ticket is confirmed.');
      onDone();
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Payment recording failed')),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message ?? 'Payment failed');
      return;
    }
    if (paymentIntent?.status === 'succeeded') {
      confirmMutation.mutate(paymentIntent.id);
    }
  };

  const busy = submitting || confirmMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
        <span className="text-sm text-slate-500">Amount to pay</span>
        <span className="text-xl font-bold text-brand-600 dark:text-brand-300">
          {formatCurrency(booking.totalPrice)}
        </span>
      </div>

      <PaymentElement />

      <button type="submit" disabled={!stripe || busy} className="btn-primary w-full text-base">
        {busy ? <Spinner size={18} className="text-white" /> : <Lock size={16} />}
        Pay {formatCurrency(booking.totalPrice)}
      </button>
      <p className="text-center text-xs text-slate-400">Payments are securely processed by Stripe.</p>
    </form>
  );
}

export function PaymentModal({
  booking,
  open,
  onClose,
}: {
  booking: Booking;
  open: boolean;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setClientSecret(null);
      setError(null);
      return;
    }
    let active = true;
    paymentsApi
      .createIntent(booking._id)
      .then((res) => active && setClientSecret(res.clientSecret))
      .catch((err) => active && setError(getErrorMessage(err, 'Could not start payment')));
    return () => {
      active = false;
    };
  }, [open, booking._id]);

  return (
    <Modal open={open} onClose={onClose} title="Complete Payment">
      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
          {error}
        </p>
      ) : !clientSecret ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <Spinner size={32} />
          <p className="text-sm text-slate-500">Preparing secure checkout…</p>
        </div>
      ) : (
        <Elements
          stripe={getStripePromise()}
          options={{
            clientSecret,
            appearance: { theme: theme === 'dark' ? 'night' : 'stripe', variables: { colorPrimary: '#4f46e5' } },
          }}
        >
          <CheckoutForm booking={booking} onDone={onClose} />
        </Elements>
      )}
    </Modal>
  );
}

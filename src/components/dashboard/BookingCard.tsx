import { ArrowRight, Calendar, CreditCard, Ticket as TicketIcon } from 'lucide-react';
import type { Booking } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { IMAGE_SIZES } from '@/constants/images';
import { Countdown } from '@/components/ui/Countdown';
import { useCountdown } from '@/hooks/useCountdown';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { BOOKING_STATUS } from '@/constants';

export function BookingCard({ booking, onPay }: { booking: Booking; onPay: (b: Booking) => void }) {
  const { isPast: departed } = useCountdown(booking.departureAt);
  const canPay = booking.status === BOOKING_STATUS.ACCEPTED && !departed;
  const showCountdown = booking.status !== BOOKING_STATUS.REJECTED;

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative">
        <SmartImage
          src={booking.ticketImage}
          alt={booking.ticketTitle}
          ratio="16/10"
          sizes={IMAGE_SIZES.dashboardGrid}
        />
        <div className="pointer-events-none absolute right-3 top-3">
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-11 font-semibold leading-snug">{booking.ticketTitle}</h3>
        <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          {booking.from} <ArrowRight size={13} /> {booking.to}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <TicketIcon size={14} /> Qty: <span className="font-semibold text-slate-700 dark:text-slate-200">{booking.quantity}</span>
          </div>
          <div className="text-right font-bold text-brand-600 dark:text-brand-300">
            {formatCurrency(booking.totalPrice)}
          </div>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar size={13} /> {formatDateTime(booking.departureAt)}
        </p>

        {showCountdown && (
          <div className="mt-3">
            <Countdown target={booking.departureAt} compact />
          </div>
        )}

        <div className="mt-auto pt-4">
          {booking.status === BOOKING_STATUS.PAID ? (
            <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <CreditCard size={16} /> Paid
            </div>
          ) : canPay ? (
            <button onClick={() => onPay(booking)} className="btn-accent w-full">
              <CreditCard size={16} /> Pay Now
            </button>
          ) : booking.status === BOOKING_STATUS.ACCEPTED && departed ? (
            <div className="rounded-xl bg-rose-50 py-2.5 text-center text-xs font-medium text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">
              Departure passed — payment closed
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 py-2.5 text-center text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {booking.status === BOOKING_STATUS.REJECTED ? 'Booking rejected' : 'Awaiting vendor approval'}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Ticket as TicketIcon } from 'lucide-react';
import type { Ticket } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { TransportIcon } from './TransportIcon';
import { Badge } from '@/components/ui/Badge';

export function TicketCard({ ticket, showRoute = true }: { ticket: Ticket; showRoute?: boolean }) {
  const soldOut = ticket.quantity <= 0;
  return (
    <article className="card group flex flex-col overflow-hidden hover:shadow-lg">
      <div className="relative h-44 overflow-hidden">
        <img
          src={ticket.image}
          alt={ticket.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge tone="brand" className="bg-white/90 text-brand-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-brand-200">
            <TransportIcon type={ticket.transportType} size={14} /> {ticket.transportType}
          </Badge>
        </div>
        {ticket.isAdvertised && (
          <div className="absolute right-3 top-3">
            <Badge className="bg-accent-500 text-slate-900">Featured</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-semibold">{ticket.title}</h3>

        {showRoute && (
          <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <MapPin size={14} className="text-brand-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{ticket.from}</span>
            <ArrowRight size={13} />
            <span className="font-medium text-slate-700 dark:text-slate-300">{ticket.to}</span>
          </p>
        )}

        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Calendar size={13} /> {formatDateTime(ticket.departureAt)}
        </p>

        {ticket.perks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ticket.perks.slice(0, 3).map((perk) => (
              <span
                key={perk}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {perk}
              </span>
            ))}
            {ticket.perks.length > 3 && (
              <span className="text-[11px] font-medium text-slate-400">+{ticket.perks.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <p className="text-xs text-slate-400">Price / unit</p>
            <p className="text-xl font-bold text-brand-600 dark:text-brand-300">
              {formatCurrency(ticket.price)}
            </p>
          </div>
          <p className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <TicketIcon size={13} /> {soldOut ? 'Sold out' : `${ticket.quantity} left`}
          </p>
        </div>

        <Link to={`/tickets/${ticket._id}`} className="btn-primary mt-4 w-full">
          See details <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

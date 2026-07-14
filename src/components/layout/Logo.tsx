import { Link } from 'react-router-dom';
import { BusFront } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className={cn('flex items-center gap-2', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        <BusFront size={20} />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        <span className="text-slate-900 dark:text-white">Ticket</span>
        <span className="text-brand-600">Bari</span>
      </span>
    </Link>
  );
}

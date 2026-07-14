import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/utils/cn';

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="min-w-[2.5rem] rounded-lg bg-slate-900 px-2 py-1 text-center font-mono text-base font-bold text-white tabular-nums dark:bg-slate-800">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
    </div>
  );
}

export function Countdown({
  target,
  className,
  compact = false,
}: {
  target: string | Date;
  className?: string;
  compact?: boolean;
}) {
  const t = useCountdown(target);

  if (t.isPast) {
    return (
      <span className={cn('badge bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300', className)}>
        Departed
      </span>
    );
  }

  if (compact) {
    return (
      <span className={cn('font-mono text-sm font-semibold tabular-nums text-brand-600 dark:text-brand-300', className)}>
        {t.days}d {String(t.hours).padStart(2, '0')}:{String(t.minutes).padStart(2, '0')}:
        {String(t.seconds).padStart(2, '0')}
      </span>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Unit value={t.days} label="Days" />
      <Unit value={t.hours} label="Hrs" />
      <Unit value={t.minutes} label="Min" />
      <Unit value={t.seconds} label="Sec" />
    </div>
  );
}

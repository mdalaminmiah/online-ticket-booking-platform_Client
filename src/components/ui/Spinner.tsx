import { cn } from '@/utils/cn';

export function Spinner({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-block animate-spin rounded-full border-[3px] border-current border-t-transparent text-brand-600', className)}
      style={{ width: size, height: size }}
    />
  );
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4">
      <Spinner size={40} />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={44} />
        <p className="font-display text-lg font-semibold text-brand-600">TicketBari</p>
      </div>
    </div>
  );
}

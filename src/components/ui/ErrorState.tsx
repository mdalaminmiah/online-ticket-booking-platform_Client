import { AlertTriangle, RotateCw } from 'lucide-react';

export function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this content. Please check your connection and try again.",
  onRetry,
  compact = false,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-rose-300 bg-rose-50/50 px-6 text-center dark:border-rose-800/60 dark:bg-rose-900/10 ${
        compact ? 'py-10' : 'py-16'
      }`}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
        <AlertTriangle size={28} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-5">
          <RotateCw size={16} /> Try again
        </button>
      )}
    </div>
  );
}

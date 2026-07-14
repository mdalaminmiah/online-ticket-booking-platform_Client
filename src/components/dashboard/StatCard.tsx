import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

const TONES: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'brand',
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  hint?: string;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={cn('flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl', TONES[tone])}>
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="truncate text-2xl font-bold">{value}</p>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

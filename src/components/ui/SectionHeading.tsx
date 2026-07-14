import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', center && 'sm:flex-col sm:items-center text-center', className)}>
      <div className={cn(center && 'mx-auto max-w-2xl')}>
        {eyebrow && (
          <span className="mb-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h2>
        {description && <p className="mt-2 text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

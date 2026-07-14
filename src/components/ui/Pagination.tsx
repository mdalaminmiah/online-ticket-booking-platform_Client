import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const items: (number | '…')[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push('…');
    items.push(p);
  });

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        className="btn-outline btn-sm h-9 w-9 !px-0"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {items.map((it, i) =>
        it === '…' ? (
          <span key={`e${i}`} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={it}
            onClick={() => onChange(it)}
            className={cn(
              'h-9 w-9 rounded-xl text-sm font-semibold transition-colors',
              it === page
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
          >
            {it}
          </button>
        ),
      )}
      <button
        className="btn-outline btn-sm h-9 w-9 !px-0"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export function formatCurrency(amount: number, currency = 'BDT'): string {
  const symbol = currency.toUpperCase() === 'BDT' ? '৳' : '$';
  return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function formatDate(value: string | Date): string {
  const d = new Date(value);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(value: string | Date): string {
  const d = new Date(value);
  return d.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function isPast(value: string | Date): boolean {
  return new Date(value).getTime() <= Date.now();
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function truncate(text: string, length = 60): string {
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

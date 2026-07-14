import { useState } from 'react';
import { initials } from '@/utils/format';
import { cn } from '@/utils/cn';

export function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const showImg = src && !error;
  return (
    <span
      className={cn(
        'inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-600 font-semibold text-white',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {showImg ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        initials(name || '?')
      )}
    </span>
  );
}

import { useEffect, useState } from 'react';
import { PLACEHOLDER_IMAGE } from '@/constants/images';
import { cn } from '@/utils/cn';

const RATIO_CLASS = {
  '16/10': 'aspect-16/10',
  '16/9': 'aspect-video',
  '4/3': 'aspect-4/3',
  '3/2': 'aspect-3/2',
  '1/1': 'aspect-square',
} as const;

export type ImageRatio = keyof typeof RATIO_CLASS;

interface SmartImageProps {
  src?: string;
  alt: string;
  ratio?: ImageRatio;
  fallback?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  srcSet?: string;
  priority?: boolean;
}

export function SmartImage({
  src,
  alt,
  ratio,
  fallback = PLACEHOLDER_IMAGE,
  className,
  imgClassName,
  sizes,
  srcSet,
  priority = false,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const resolved = !src || failed ? fallback : src;
  const isFallback = resolved === fallback;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-100 dark:bg-slate-800',
        ratio && RATIO_CLASS[ratio],
        className,
      )}
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />}

      <img
        src={resolved}
        alt={alt}
        srcSet={isFallback ? undefined : srcSet}
        sizes={isFallback ? undefined : sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!isFallback) setFailed(true);
          else setLoaded(true);
        }}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  );
}

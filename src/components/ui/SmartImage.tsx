import { useEffect, useState } from 'react';
import { PLACEHOLDER_IMAGE } from '@/constants/images';
import { cn } from '@/utils/cn';

/** Tailwind aspect-ratio classes, so every card in a grid crops identically. */
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
  /** Fixed crop box. Omit only when the parent already constrains height. */
  ratio?: ImageRatio;
  /** Shown when `src` is missing or fails to load. */
  fallback?: string;
  className?: string;
  /** Extra classes for the <img> itself, e.g. a group-hover zoom. */
  imgClassName?: string;
  sizes?: string;
  srcSet?: string;
  /** First-paint images (hero, detail page) should not be lazy. */
  priority?: boolean;
}

/**
 * Image wrapper used by every ticket card, tile and thumbnail.
 *
 * It guarantees three things the raw <img> tags did not:
 *  - a reserved, fixed-ratio box, so grids never shift while loading (no CLS)
 *    and all cards in a row share one image height;
 *  - `object-cover` centring, so nothing is stretched or squashed;
 *  - a graceful fallback, so a dead vendor URL shows on-brand artwork rather
 *    than the browser's broken-image glyph.
 */
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

  // A new src is a new load: clear the previous error/loaded state, otherwise
  // an edited ticket keeps showing the old image's fallback.
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
      {/* Shimmer placeholder, removed once the real file paints. */}
      {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />}

      <img
        src={resolved}
        alt={alt}
        // srcSet is only valid for the real CDN source, never the local SVG.
        srcSet={isFallback ? undefined : srcSet}
        sizes={isFallback ? undefined : sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => {
          // Guard against an infinite loop if the fallback itself is missing.
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

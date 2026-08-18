/**
 * Central image library.
 *
 * Every URL below was verified to return HTTP 200 and to actually depict its
 * subject — several of the previously hard-coded photos either 404'd or showed
 * unrelated content (a landfill on a "deluxe coach" listing, the Taj Mahal on a
 * Chittagong route tile). Keep new entries in this file so they can be checked
 * in one place rather than scattered across components.
 */

const UNSPLASH_BASE = 'https://images.unsplash.com';

/** Widths we request from the CDN, shared by every responsive image. */
export const IMAGE_WIDTHS = [400, 600, 800, 1200, 1600, 2000] as const;

/**
 * Builds a CDN URL. `auto=format` lets Unsplash serve WebP/AVIF to browsers
 * that accept it, and `fit=crop` guarantees the delivered file already matches
 * the aspect ratio we render at, so `object-cover` never has to crop much.
 */
export function unsplashUrl(id: string, width: number, aspect?: number): string {
  const params = new URLSearchParams({
    w: String(width),
    q: '80',
    auto: 'format',
    fit: 'crop',
  });
  if (aspect) params.set('h', String(Math.round(width / aspect)));
  return `${UNSPLASH_BASE}/${id}?${params.toString()}`;
}

/** `srcset` string so the browser can pick the cheapest adequate file. */
export function unsplashSrcSet(id: string, aspect?: number): string {
  return IMAGE_WIDTHS.map((w) => `${unsplashUrl(id, w, aspect)} ${w}w`).join(', ');
}

/** Local, bundled SVG — cannot 404, used as the last-resort fallback. */
export const PLACEHOLDER_IMAGE = '/placeholder-ticket.svg';

/* ── Verified photo IDs ─────────────────────────────────────── */

export const PHOTOS = {
  busNight: 'photo-1544620347-c4fd4a3d5957',
  busCoachSunset: 'photo-1570125909232-eb263c188f7e',
  busCoachDawn: 'photo-1570125909517-53cb21c89ff2',
  busInterior: 'photo-1494515843206-f3117d3f51b7',
  trainTracks: 'photo-1474487548417-781cb71495f3',
  trainScenic: 'photo-1541427468627-a89a96e5ca1d',
  planeWing: 'photo-1436491865332-7a61a109cc05',
  planeGate: 'photo-1542296332-2e4473faf563',
  shipPort: 'photo-1548574505-5e239809ee19',
  boatRiver: 'photo-1476514525535-07fb3b4ae5f1',
  beachSunset: 'photo-1507525428034-b723cf961d3e',
  hillsRiver: 'photo-1533692328991-08159ff19fca',
  greenHills: 'photo-1470071459604-3b5ec3a7fe05',
} as const;

/**
 * Per-transport fallback used when a vendor-supplied image fails to load, so a
 * broken listing still shows something on-brand and on-topic.
 */
export const TRANSPORT_FALLBACK: Record<string, string> = {
  Bus: unsplashUrl(PHOTOS.busCoachSunset, 800, 16 / 10),
  Train: unsplashUrl(PHOTOS.trainScenic, 800, 16 / 10),
  Launch: unsplashUrl(PHOTOS.shipPort, 800, 16 / 10),
  Plane: unsplashUrl(PHOTOS.planeGate, 800, 16 / 10),
};

/** Resolves the best fallback for a ticket-shaped record. */
export function fallbackFor(transportType?: string): string {
  return (transportType && TRANSPORT_FALLBACK[transportType]) || PLACEHOLDER_IMAGE;
}

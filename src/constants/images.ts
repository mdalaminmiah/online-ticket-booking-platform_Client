const UNSPLASH_BASE = 'https://images.unsplash.com';

export const IMAGE_WIDTHS = [400, 600, 800, 1200, 1600, 2000] as const;

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

export function unsplashSrcSet(id: string, aspect?: number): string {
  return IMAGE_WIDTHS.map((w) => `${unsplashUrl(id, w, aspect)} ${w}w`).join(', ');
}

export const PLACEHOLDER_IMAGE = '/placeholder-ticket.svg';

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

export const TRANSPORT_FALLBACK: Record<string, string> = {
  Bus: unsplashUrl(PHOTOS.busCoachSunset, 800, 16 / 10),
  Train: unsplashUrl(PHOTOS.trainScenic, 800, 16 / 10),
  Launch: unsplashUrl(PHOTOS.shipPort, 800, 16 / 10),
  Plane: unsplashUrl(PHOTOS.planeGate, 800, 16 / 10),
};

export function fallbackFor(transportType?: string): string {
  return (transportType && TRANSPORT_FALLBACK[transportType]) || PLACEHOLDER_IMAGE;
}

export const IMAGE_SIZES = {
  cardGrid: '(min-width: 1280px) 23vw, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw',
  dashboardGrid: '(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw',
  routeTile: '(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw',
  detail: '(min-width: 1024px) 46vw, 92vw',
  full: '100vw',
  half: '50vw',
} as const;

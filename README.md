# TicketBari — Client (Web App)

React 19 + TypeScript single-page app for the TicketBari platform, styled with Tailwind CSS v4.

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS v4 · React Router 7 · TanStack Query 5 · React Hook Form + Zod · Recharts · Swiper · react-hot-toast · Axios · BetterAuth client · Stripe.js · lucide-react · Vitest + Testing Library.

## Structure

```
src/
├── api/          typed endpoint functions (tickets, bookings, payments, admin, vendor, me, upload)
├── components/   ui/ · layout/ · home/ · tickets/ · dashboard/ · payment/ · auth/
├── config/       env
├── context/      ThemeContext, AuthContext
├── hooks/        useCountdown, useDebounce, usePageTitle
├── layouts/      RootLayout, AuthLayout, DashboardLayout
├── lib/          authClient (BetterAuth), axios, token, stripe
├── pages/        public + dashboard/{user,vendor,admin}
├── providers/    QueryProvider
├── routes/       router, ProtectedRoute, RoleRoute
├── test/         vitest setup
├── types/ utils/ constants/
├── App.tsx  main.tsx  index.css
```

## Environment

Copy `.env.example` → `.env`:

| Variable                      | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| `VITE_API_URL`                | Base URL of the API server (no trailing slash) |
| `VITE_BETTER_AUTH_URL`        | BetterAuth base URL (usually = API server)     |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_...`)              |
| `VITE_IMGBB_API_KEY`          | imgbb API key for image uploads                |

Vite inlines `VITE_*` variables at build time, so changing one on a host
requires a fresh deploy before it takes effect.

## Scripts

```bash
npm run dev            # Vite dev server → http://localhost:5173
npm run build          # tsc -b && vite build
npm run preview        # preview the production build
npm run typecheck      # tsc --noEmit
npm test               # run the vitest suite once
npm run test:watch     # re-run tests on change
npm run test:coverage  # v8 coverage report
```

Requires Node 20.19 or newer (see `.nvmrc`).

## Highlights

- **Refresh-safe auth**: a loading state re-hydrates the session so private routes never flash to `/login` on reload.
- **Dark/Light mode**: class-based, persisted, applied before first paint (no flash).
- **Data layer**: TanStack Query for caching, loading/error states and invalidation.
- **Forms**: React Hook Form + Zod validation everywhere.
- **Code-split routes and vendor chunks**: only Home and All Tickets ship in the initial bundle; every other route loads on navigation.
- **Resilient images**: `SmartImage` reserves a fixed aspect box to avoid layout shift and falls back to on-brand artwork when a vendor URL is dead, so a dead link never renders a broken-image glyph.
- **Accessible dialogs**: focus moves into the modal, is trapped while open and restored to the trigger on close; a skip link jumps past the navbar.
- **Per-route titles** so tabs, history and bookmarks are distinguishable.
- **Error boundary** around routed content, so a render failure is recoverable without a reload.

## Testing

Vitest with jsdom and Testing Library. The suite covers the formatting and
class-name helpers, the debounce and countdown hooks (including the departure
boundary that gates Book Now and Pay Now), the SmartImage fallback chain,
Pagination windowing, modal focus trapping and the shared ticket card.

```bash
npm test
```

## Deployment

- Build with `npm run build` and serve `dist/` on any static host.
- `vercel.json` rewrites all paths to `index.html`, so **reloading any route works** (no 404).
- Set the `VITE_*` env vars on the host, then point `VITE_API_URL` to the deployed server.

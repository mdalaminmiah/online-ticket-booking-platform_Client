# TicketBari — Client (Web App)

React 19 + TypeScript single-page app for the TicketBari platform, styled with Tailwind CSS v4.

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS v4 · React Router 7 · TanStack Query 5 · React Hook Form + Zod · Recharts · Swiper · react-hot-toast · Axios · BetterAuth client · Stripe.js · lucide-react.

## Structure

```
src/
├── api/          typed endpoint functions (tickets, bookings, payments, admin, vendor, me, upload)
├── components/   ui/ · layout/ · home/ · tickets/ · dashboard/ · payment/ · auth/
├── config/       env
├── context/      ThemeContext, AuthContext
├── hooks/        useCountdown, useDebounce
├── layouts/      RootLayout, AuthLayout, DashboardLayout
├── lib/          authClient (BetterAuth), axios, token, stripe
├── pages/        public + dashboard/{user,vendor,admin}
├── providers/    QueryProvider
├── routes/       router, ProtectedRoute, RoleRoute
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

## Scripts

```bash
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # tsc -b && vite build
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
```

## Highlights

- **Refresh-safe auth**: a loading state re-hydrates the session so private routes never flash to `/login` on reload.
- **Dark/Light mode**: class-based, persisted, applied before first paint (no flash).
- **Data layer**: TanStack Query for caching, loading/error states and invalidation.
- **Forms**: React Hook Form + Zod validation everywhere.
- **Code-split** vendor chunks (react, charts, stripe, swiper) for faster loads.

## Deployment

- Build with `npm run build` and serve `dist/` on any static host.
- `vercel.json` rewrites all paths to `index.html`, so **reloading any route works** (no 404).
- Set the `VITE_*` env vars on the host, then point `VITE_API_URL` to the deployed server.

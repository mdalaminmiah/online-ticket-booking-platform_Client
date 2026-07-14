export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
  authUrl: import.meta.env.VITE_BETTER_AUTH_URL ?? 'http://localhost:5000',
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '',
  imgbbApiKey: import.meta.env.VITE_IMGBB_API_KEY ?? '',
} as const;

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error(
    '[TicketBari] VITE_API_URL is not set — the deployed app is pointing at localhost:5000.',
  );
}

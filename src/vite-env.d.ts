/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_BETTER_AUTH_URL: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_IMGBB_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

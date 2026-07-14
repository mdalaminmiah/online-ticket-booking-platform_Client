import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { tokenStore } from '@/lib/token';
import { authClient } from '@/lib/authClient';

export const api = axios.create({
  baseURL: `${env.apiUrl}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the BetterAuth JWT to every request.
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Re-mint the JWT from the live BetterAuth session (the cached token expires).
 * Concurrent 401s share a single in-flight refresh so we only hit the token
 * endpoint once.
 */
let refreshPromise: Promise<string | null> | null = null;
function refreshToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = authClient
      .token()
      .then((res) => {
        const token = res.data?.token ?? null;
        tokenStore.set(token);
        return token;
      })
      .catch(() => {
        tokenStore.clear();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// On a 401 (expired token), refresh once and replay the original request so a
// long-lived session doesn't start silently failing after the JWT lapses.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const token = await refreshToken();
      if (token) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);

/** Normalise API errors into readable messages for toasts. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

const STORAGE_KEY = 'ticketbari-jwt';

let inMemoryToken: string | null = null;

/** Small JWT holder shared between the auth provider and the axios interceptor. */
export const tokenStore = {
  get(): string | null {
    if (inMemoryToken) return inMemoryToken;
    try {
      inMemoryToken = localStorage.getItem(STORAGE_KEY);
    } catch {
      inMemoryToken = null;
    }
    return inMemoryToken;
  },
  set(token: string | null): void {
    inMemoryToken = token;
    try {
      if (token) localStorage.setItem(STORAGE_KEY, token);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore storage errors (private mode) */
    }
  },
  clear(): void {
    this.set(null);
  },
};

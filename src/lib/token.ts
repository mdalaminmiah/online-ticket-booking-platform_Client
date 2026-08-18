const STORAGE_KEY = 'ticketbari-jwt';

let inMemoryToken: string | null = null;

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
    }
  },
  clear(): void {
    this.set(null);
  },
};

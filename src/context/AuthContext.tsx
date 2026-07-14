import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/authClient';
import { tokenStore } from '@/lib/token';
import { meApi } from '@/api/me';
import type { AppUser } from '@/types';
import type { Role } from '@/constants';

/** True only for auth failures that mean the session is genuinely invalid. */
function isAuthError(err: unknown): boolean {
  const status = err instanceof AxiosError ? err.response?.status : undefined;
  return status === 401 || status === 403;
}

/** Load the current user, retrying transient network/5xx errors so a blip on
 *  reload doesn't masquerade as a logout. A 401/403 fails fast. */
async function loadMe(): Promise<AppUser> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await meApi.get();
    } catch (err) {
      if (isAuthError(err)) throw err;
      lastErr = err;
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  throw lastErr;
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: AppUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  hasRole: (...roles: Role[]) => boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const queryClient = useQueryClient();

  /** Fetch a fresh JWT from BetterAuth and store it for the axios interceptor. */
  const syncToken = useCallback(async (): Promise<boolean> => {
    try {
      const res = await authClient.token();
      const token = res.data?.token;
      if (token) {
        tokenStore.set(token);
        return true;
      }
    } catch {
      /* no active session */
    }
    return false;
  }, []);

  /** Hydrate the user from the live session — runs on load & after auth changes. */
  const bootstrap = useCallback(async () => {
    const hasToken = await syncToken();
    if (!hasToken) {
      tokenStore.clear();
      setUser(null);
      setStatus('unauthenticated');
      return;
    }
    try {
      const me = await loadMe();
      setUser(me);
      setStatus('authenticated');
    } catch (err) {
      // Only wipe the token when the session is genuinely invalid. On a
      // transient/network error keep it so the next reload can recover instead
      // of forcing a real re-login.
      if (isAuthError(err)) tokenStore.clear();
      setUser(null);
      setStatus('unauthenticated');
    }
  }, [syncToken]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await authClient.signUp.email({ name, email, password });
      if (res.error) throw new Error(res.error.message ?? 'Registration failed');
      await bootstrap();
    },
    [bootstrap],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) throw new Error(res.error.message ?? 'Login failed');
      await bootstrap();
    },
    [bootstrap],
  );

  const loginWithGoogle = useCallback(async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/auth/callback`,
    });
  }, []);

  const logout = useCallback(async () => {
    await authClient.signOut();
    tokenStore.clear();
    setUser(null);
    setStatus('unauthenticated');
    // Drop all cached queries so the next account can't see this user's data.
    queryClient.clear();
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    try {
      const me = await meApi.get();
      setUser(me);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      hasRole: (...roles: Role[]) => (user ? roles.includes(user.role) : false),
      register,
      login,
      loginWithGoogle,
      logout,
      refreshUser,
    }),
    [user, status, register, login, loginWithGoogle, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

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

function isAuthError(err: unknown): boolean {
  const status = err instanceof AxiosError ? err.response?.status : undefined;
  return status === 401 || status === 403;
}

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

  const syncToken = useCallback(async (): Promise<boolean> => {
    try {
      const res = await authClient.token();
      const token = res.data?.token;
      if (token) {
        tokenStore.set(token);
        return true;
      }
    } catch {
    }
    return false;
  }, []);

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
    queryClient.clear();
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    try {
      const me = await meApi.get();
      setUser(me);
    } catch {
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

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

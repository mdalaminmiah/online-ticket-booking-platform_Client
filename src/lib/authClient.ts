import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';
import { env } from '@/config/env';

export const authClient = createAuthClient({
  baseURL: env.authUrl,
  basePath: '/api/auth',
  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;

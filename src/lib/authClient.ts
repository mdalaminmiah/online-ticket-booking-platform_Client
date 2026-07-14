import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';
import { env } from '@/config/env';

/**
 * BetterAuth React client — talks to the server's /api/auth endpoints.
 * The `jwtClient` plugin exposes `authClient.token()` which returns the
 * signed JWT our API uses for authorization.
 */
export const authClient = createAuthClient({
  baseURL: env.authUrl,
  basePath: '/api/auth',
  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;

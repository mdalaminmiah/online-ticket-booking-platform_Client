import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FullScreenLoader } from '@/components/ui/Spinner';

/** Requires an authenticated session. Refresh-safe: shows a loader while the
 *  session re-hydrates instead of bouncing the user to /login. */
export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullScreenLoader />;
  if (status === 'unauthenticated') {
    // Preserve the full target (query + hash) so deep links survive login.
    const from = location.pathname + location.search + location.hash;
    return <Navigate to="/login" replace state={{ from }} />;
  }
  return <Outlet />;
}

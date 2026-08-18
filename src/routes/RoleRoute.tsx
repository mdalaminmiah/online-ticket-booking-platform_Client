import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FullScreenLoader } from '@/components/ui/Spinner';
import type { Role } from '@/constants';

export function RoleRoute({ allow }: { allow: Role[] }) {
  const { status, user } = useAuth();

  if (status === 'loading') return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

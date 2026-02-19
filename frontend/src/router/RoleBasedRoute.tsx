import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleBasedRoute({ allowedRoles, children }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  const hasRole = user.roles.some((role) => allowedRoles.includes(role));

  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

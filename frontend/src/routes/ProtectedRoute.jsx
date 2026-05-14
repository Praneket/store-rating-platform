import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { user, initialized } = useSelector((s) => s.auth);
  if (!initialized) return null;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const RoleRoute = ({ roles }) => {
  const { user, initialized } = useSelector((s) => s.auth);
  if (!initialized) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
};

export const GuestRoute = () => {
  const { user, initialized } = useSelector((s) => s.auth);
  if (!initialized) return null;
  if (user) {
    const redirects = { ADMIN: '/admin/dashboard', USER: '/user/dashboard', STORE_OWNER: '/owner/dashboard' };
    return <Navigate to={redirects[user.role] || '/'} replace />;
  }
  return <Outlet />;
};

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth() {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div style={{ padding: 16 }}>A verificar sessão…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;

  return <Outlet />;
}
